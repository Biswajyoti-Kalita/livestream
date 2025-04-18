const { Op } = require("sequelize");
const db = require("../../models");

// exports.latestBinaries = async (req, res) => {
//   const { backend_version, frontend_version, app_version } = req.query;

//   const backend = await db.backend.findOne({
//     order: [["id", "DESC"]],
//   });
//   const frontend = await db.frontend.findOne({
//     order: [["id", "DESC"]],
//   });

//   return res.send({
//     backend,
//     frontend,
//   });
// };

// exports.checkForUpdate = async (req, res) => {
//   const { current_version } = req.query;

//   const latest = await db.app.findOne({
//     include: [
//       {
//         model: db.backend,
//         as: "backend",
//       },
//       {
//         model: db.frontend,
//         as: "frontend",
//       },
//     ],
//     order: [["id", "DESC"]],
//   });

//   let migration_required = latest.backend.db_changed;
//   let backend_update_required = true, frontend_update_required= true;

//   if (current_version) {
//     const currentVersion = await db.app.findOne({
//       where: {
//         version: current_version,
//       },
//       include: [
//         {
//           model: db.backend,
//           as: "backend",
//         },
//         {
//           model: db.frontend,
//           as: "frontend",
//         }
//       ]
//     });

//     if (currentVersion.id != latest.id) {

//       console.log("user has old version, check if migration is required");
//       const versionsBetween = await db.backend.findAll({
//         where: {
//           [Op.and]: [
//             {
//               id: {
//                 [Op.gt]: currentVersion.backend?.id,
//               },
//             },
//             {
//               id: {
//                 [Op.lte]: latest.backend?.id,
//               },
//             },
//           ],
//         },
//         attributes: ["db_changed"],
//         raw: true
//       });
//       console.log({versionsBetween});
//       const dbChangedIndex = versionsBetween.findIndex((vb) => vb.db_changed == true);
//       console.log({dbChangedIndex})
//       if ( dbChangedIndex!= -1)
//         migration_required = true;


//       if(latest.backend.version == currentVersion.backend.version){
//         backend_update_required = false;
//       }
//       if(latest.frontend.version == currentVersion.frontend.version){
//         frontend_update_required = false;
//       }
//     }
//     else {
//       return res.send({
//         update_required: false,
//         message: "User already has the latest binaries"
//       })
//     }
//   }else {

//   }

//   return res.send({
//     update_required: true,
//     latest,
//     migration_required,
//     backend_update_required,
//     frontend_update_required
//   });
// };

exports.getPublicPath = async (req, res) => {
    console.log("get public path ");
    const { id } = req.query;
    console.log({id});
    const meeting = await db.event.findOne({
        where: {
            uuid: id
        }
    });
    console.log({meeting});

    if(meeting){
        if(meeting["status"] == 2){
            return res.send({
                filepath: meeting["filepath"]
            })
        }
    }

    return res.send({
        filepath : ""
    })

}

exports.getEventById = async (req, res) => {
    console.log(" get event by id ");
    const meeting_id = req.params.id;

    const meeting = await db.event.findOne({
        where: {
            uuid: meeting_id
        }
    })

    return res.send(meeting);
}

exports.meetingView = async (req, res) => {
    const {id} = req.query;
    console.log({ id });
    let meeting = null;
    if(id){
        meeting = await db.event.findOne({
            where: {
                uuid: id
            },
            attributes: ["id", "uuid", "title", "agenda", "description", "start_time", "start_date", "status"]
        })    
    }
    return res.render("client/meeting", {
        meeting
    });
}
