const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Entity, Pseudonym, sequelize } = require("../../db/models");
const { Op } = require('sequelize');

const router = express.Router();

async function EntitiesForUser(id) {
    const entities = await Entity.findAll({ //World
        where: {
            userId: id,
            parentId: null
        },
        include: [{
            model:Entity,                   //Series
            as: "children",
            required: false,
            include: {
                model:Entity,               //Book
                as: "children",
                required: false,
                include: {
                    model:Entity,           // Story/Chapter
                    as: "children"
                }
            }
        },{
            model: Pseudonym
        }
    ]
    })

    return entities;
}

router.get(
    "/",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        const entities = await EntitiesForUser(user.id)

        return res.json(entities)
    })
);

router.post("/",
restoreUser,
asyncHandler(async (req,res) => {
    let { user } = req;
    user = user.toJSON();
    let {entity} = req.body;
    
    let order = 0;
    
    if (entity.parentId) {
        let parent = await Entity.findByPk(parseInt(entity.parentId), {
            include: {
                model: Entity,
                as: "children"
            }
        })
        parent = parent.toJSON();
        order = parent.children.length

    }
    
    let newEntity = await Entity.create({...entity, order, userId: user.id})

    const entities = await EntitiesForUser(user.id)

    return res.json(entities)
}))

router.delete("/:id(\\d+)",
restoreUser,
asyncHandler(async (req,res) => {
    let { user } = req;
    user = user.toJSON();
    let { id } = req.params;
    id = parseInt(id);

    let entity = await Entity.findByPk(id)

    await sequelize.transaction(async (tx) => {
        if (entity.parentId) {
            let children = await Entity.findAll({
                where: {
                    parentId: entity.parentId,
                    id: {
                        [Op.ne]: id
                    }
                },
                order: ["order"]
            },{transaction: tx})

            await children.forEach(async (child,idx)=>{
                await child.update({
                    order: idx
                },{transaction: tx})
            })

        }
        
        await entity.destroy({transaction: tx});

    })

    const entities = await EntitiesForUser(user.id)

    return res.json(entities)
}))



module.exports = router;
