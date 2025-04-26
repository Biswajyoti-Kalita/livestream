const { Op } = require("sequelize");
const db = require("./../../models");
const path = require("path");
const fs = require("fs");


exports.meetingView = async (req, res) => {
  return res.render("admin/meeting");
};

exports.getMeetings = async (req, res) => {
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
          user_id: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          organization: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    };
  }

  const meetings = await db.meeting.findAndCountAll({ where: filters ,

    order: [['id', 'DESC']]

  }, limit, offset);

  return res.send(meetings);
};

exports.getMeeting = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.send({
        status: "error",
        message: "ID is required",
      });
    }
    const result = await db.meeting.findOne({
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

exports.addMeeting = async (req, res) => {
  try {
    const { organization, name, user_id } = req.body;
    if (!name) {
      return res.send({
        status: "error",
        message: "TitlNamee is required",
      });
    }
    
    const result = await db.meeting.create(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.send({
      status: "error",
      message: err.mssage || "Something went wrong",
    });
  }
};

exports.putMeeting = async (req, res) => {
  const fields = req.body;
  const { id } = req.query;
  if (!id) {
    return res.send({
      status: "error",
      message: "id is required",
    });
  }

  const result = await db.meeting.update(fields, {
    where: {
      id,
    },
  });
  return res.send(result);
};

exports.deleteMeeting = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.send({
      status: "error",
      message: "id is required",
    });
  }

  await db.meeting.destroy({
    where: {
      id,
    },
  });
  return res.send({
    status: "success",
    message: "Deleted successfully",
  });
};

