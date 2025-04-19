const { Op } = require("sequelize");
const db = require("./src/models");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  const admin = await db.user.create({
    name: "admin",
    email: "adel@nextbroadcast.media",
    password: await bcrypt.hash("adel@nextbroadcast.media", 10),
    role: 0
  });
  console.log(admin);
};
const deleteAdmins = async() => {
  await db.user.destroy({
    where : {
      id: {
        [Op.gte]: 1
      }
    }
  })
}

(() => {
    db.event.update({
        status: 0
      }, {
        where: {
          id: 10
        }
      })
});

  // createClients();
//db.user.findAll().then((res) => console.log(res));
createAdmin();
// deleteAdmins();
