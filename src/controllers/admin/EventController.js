const { Op } = require("sequelize");
const db = require("./../../models");
const path = require("path");
const fs = require("fs");
const { startStreaming } = require("../../services/ffmpegService");
const { chatNamespace } = require("../../services/websocketService");

exports.eventView = async (req, res) => {
  return res.render("admin/event");
};

exports.getEvents = async (req, res) => {
  const { search } = req.query;
  let filters = req.body && Object.keys(req.body).length ? req.body : {};
  const limit = req.query.limit ? req.query.limit : 10;
  const offset = req.query.offset ? req.query.offset : 10;

  console.log({ search });
  if (search) {
    filters = {
      ...filters,
      [Op.or]: [
        {
          title: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          agenda: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    };
  }

  const events = await db.event.findAndCountAll({ where: filters ,

    order: [['id', 'DESC']]

  }, limit, offset);

  return res.send(events);
};

exports.getEvent = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.send({
        status: "error",
        message: "ID is required",
      });
    }
    const result = await db.event.findOne({
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

exports.addEvent = async (req, res) => {
  try {
    const { title, filepath } = req.body;
    if (!title) {
      return res.send({
        status: "error",
        message: "Title is required",
      });
    }
    if (!filepath) {
      return res.send({
        status: "error",
        message: "Filepath is required",
      });
    }

    const result = await db.event.create(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.send({
      status: "error",
      message: err.mssage || "Something went wrong",
    });
  }
};

exports.putEvent = async (req, res) => {
  const fields = req.body;
  const { id } = req.query;
  if (!id) {
    return res.send({
      status: "error",
      message: "id is required",
    });
  }

  const result = await db.event.update(fields, {
    where: {
      id,
    },
  });
  return res.send(result);
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.send({
      status: "error",
      message: "id is required",
    });
  }

  const event = await db.event.findOne({
    where: {
      id
    }
  });

  if(event){
    try{      
    const filepath = event['filepath'].substring(event['filepath'].lastIndexOf("/")+ 1);  
    fs.unlinkSync( path.join(__dirname, "..", "..", "..", "uploads", filepath) );
    }catch(err){
      console.log(err);
    }
  }



  await db.event.destroy({
    where: {
      id,
    },
  });
  return res.send({
    status: "success",
    message: "Deleted successfully",
  });
};


exports.startEvent = async  (req, res) => {
  const {id } = req.body;
  const event = await db.event.findOne({
    where: {
      id
    }
  });
  if(!id){
    return res.send({
      status:"error",
      message: "Event doesn;t exist"
    })
  }

  if(event["status"] != 0){
    return res.send({
      status:"error",
      message: event["status"] == 1 ? "Event already in progress" : "Event is complete"
    })
  }

  const filepath = event['filepath'].substring( event['filepath'].lastIndexOf("/")+ 1);
  const inputFile = path.join( __dirname, "..", "..", "..", "uploads", filepath);

  startStreaming(inputFile, event["uuid"], async () => {
    console.log("streaming done");
    await db.event.update({
      status: 2
    }, {
      where: {
        id
      }
    })
    // delete the .ts files

    // Broadcast message to all clients in the room
    chatNamespace.to(event["uuid"]).emit('event_ended', {});
    
  });

  await db.event.update({
    status: 1
  }, {
    where: {
      id
    }
  });


  return res.send({
    status:"success",
    message:"Event started streaming...."
  })

}
