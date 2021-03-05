const express = require("express");
const asyncHandler = require("express-async-handler");
const { restoreUser } = require("../../utils/auth");
const { Entity, Pseudonym, sequelize } = require("../../db/models");
const { Op } = require('sequelize');

const router = express.Router();

async function EntitiesForUser(id) {

    const entities = await Entity.getEntitiesPerUser(id);

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

    return res.json(newEntity)
}))

router.patch("/",
restoreUser,
asyncHandler(async (req,res) => {
    let { user } = req;
    user = user.toJSON();
    let {entity} = req.body;
    
    let newEntity = await Entity.findByPk(entity.id, {
        where: {
            userId: user.id
        }
    });
    
    if (newEntity) {
        
        await sequelize.transaction(async (tx) => {
            
            let order = 0;

            if(newEntity.parentId !== null) {
                let siblings = await Entity.findAll({
                    where: {
                        parentId: newEntity.parentId,
                        id: {
                            [Op.ne]: newEntity.id
                        },
                        userId: user.id
                    },
                    order: ["order"]
                },{transaction: tx})
                
                await siblings.forEach(async (child,idx)=>{
                    if (child.order !== idx) {
                        await child.update({
                            order: idx
                        },{transaction: tx})
                    }
                })
            }
            
            if(entity.parentId !== null) {
                let newSiblings = await Entity.findAll({
                    where: {
                        parentId: entity.parentId,
                        id: {
                            [Op.ne]: newEntity.id
                        },
                        userId: user.id
                    }
                },{transaction: tx})
                
                order = newSiblings.length;
            }

            await newEntity.update({...entity, order},{transaction: tx})
        })
    }
    return res.json(newEntity)
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

    return res.json(entity)
}))



module.exports = router;
