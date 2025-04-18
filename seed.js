const { Op } = require("sequelize");
const db = require("./src/models");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  const admin = await db.user.create({
    name: "admin",
    email: "admin@livestream.com",
    password: await bcrypt.hash("a12345", 10),
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
          id: {
            [Op.gte]: 1
          }
        }
      })
})();

  // createClients();
//db.user.findAll().then((res) => console.log(res));
 //createAdmin();
// deleteAdmins();
