
const { Op } = require("sequelize");
const db = require("./../../models");

exports.userView = async (req, res) => {
    return res.render("admin/user");
};


exports.getUser = async (req, res) => {
    try{
        const {id} = req.query;
        if(!id) {
            return res.send({
                status: "error",
                message: "ID is required"
            })
        }
        const result = await db.user.findOne({
            where: {
                id
            }
        });
        return res.send(result);    
    }catch(err){
        console.log(err);
        return res.send({
            status: "error",
            message: err.mssage || "Something went wrong"
        })
    }
};

exports.getUsers = async (req, res) => {
    const {search} = req.query;
    let filters = Object.keys(req.body).length ? req.body : {};
    const limit = req.query.limit ? req.query.limit : 10;
    const offset = req.query.offset ? req.query.offset : 10;

    console.log({search});
    if(search){
        filters = {
            ...filters,
            [Op.or]: [
                {
                    name: {
                        [Op.like]: "%"+search + "%"
                    }
                },
                {
                    email: {
                        [Op.like]: "%"+search + "%"
                    }
                },
                {
                    username: {
                        [Op.like]: "%"+search + "%"
                    }
                }
            ]
        }
    }

    const users = await db.user.findAndCountAll({where: filters},limit,offset);
    
    return res.send(users);
};

exports.putUser = async (req, res) => {
    const fields = req.body;
    const {id} = req.query;
    if(!id){
        return res.send({
            status: "error",
            message: "id is required"
        })
    }
    const result = await db.user.update(fields,{
        where: {
            id
        }
    });
    return res.send(result);
};


exports.deleteUser = async (req, res) => {
    const {id} = req.query;
    if(!id){
        return res.send({
            status: "error",
            message: "id is required"
        })
    }
    await db.user.destroy({
        where: {
            id
        }
    });
    return res.send({
        status:"success",
        message: "Deleted successfully"
    });
};
