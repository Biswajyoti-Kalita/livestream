const { Op } = require("sequelize");
const db = require("./../../models");
const { addUserToRoom } = require("../../services/meetingRoom");
const { chatNamespace } = require("../../services/websocketService");

exports.chatView = async (req, res) => {
  const backends = await db.backend.findAll();
  const frontends = await db.frontend.findAll();
  
  return res.render("admin/chat", {frontends, backends});
};

exports.getChats = async (req, res) => {
  const { search } = req.query;
  let filters = Object.keys(req.body).length ? req.body : {};
  const limit = req.query.limit ? req.query.limit : 10;
  const offset = req.query.offset ? req.query.offset : 10;

  console.log({ search });
  if (search) {
    filters = {
      ...filters,
      [Op.or]: [
        {
          version: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          description: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    };
  }

  const chats = await db.chat.findAndCountAll(
    {
      where: filters,
      include: [
        {
          model: db.backend,
          as: "backend",
        },        {
          model: db.frontend,
          as: "frontend",
        },
      ],
      order: [['id', 'DESC']]
    },
    limit,
    offset
  );

  return res.send(chats);
};

exports.getChat = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.send({
        status: "error",
        message: "ID is required",
      });
    }
    const result = await db.chat.findOne({
      where: {
        id,
      },
    });
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.send({
      status: "error",
      message: err.mssage || "Something went wrong",
    });
  }
};

exports.addChat = async (req, res) => {
  try {
    const { version } = req.body;
    if (!version) {
      return res.send({
        status: "error",
        message: "Version is required",
      });
    }

    const checkExist = await db.chat.findOne({
      where: {
        version,
      },
    });
    if (checkExist) {
      return res.send({
        status: "error",
        message: "Version already exist",
      });
    }

    const result = await db.chat.create(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.send({
      status: "error",
      message: err.mssage || "Something went wrong",
    });
  }
};

exports.putChat = async (req, res) => {
  const fields = req.body;
  const { id } = req.query;
  if (!id) {
    return res.send({
      status: "error",
      message: "id is required",
    });
  }

  if (
    !fields["version"] ||
    fields["version"] === undefined ||
    fields["version"] === null
  )
    return res.send({
      status: "error",
      message: "Version is required",
    });

  const checkExist = await db.chat.findOne({
    where: {
      version: fields["version"],
      id: {
        [Op.ne]: id,
      },
    },
  });
  if (checkExist) {
    return res.send({
      status: "error",
      message: "Version already exist",
    });
  }

  const result = await db.chat.update(fields, {
    where: {
      id,
    },
  });
  return res.send(result);
};

exports.deleteChat = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.send({
      status: "error",
      message: "id is required",
    });
  }
  await db.chat.destroy({
    where: {
      id,
    },
  });
  return res.send({
    status: "success",
    message: "Deleted successfully",
  });
};


exports.addTempUser = async (req,res) => {
  const {meetingId, num} = req.body;
  const userCount = getRoomSize(meetingId);
  const temp_user_id = uuidv4().substring(5);
  for(let i=0; i< num;i++){
    setTimeout(() => {
      addUserToRoom(meetingId,"temp_user_"+ temp_user_id +i)
      chatNamespace.to(meetingId).emit('users_update', { count: userCount + i + 1 });
    }, 500, i)
  }
  return res.send({
    status:"success",
    message: "Added count"
  })
}