const express = require("express");
const asyncHandler = require("express-async-handler");

const {restoreUser} = require("../../utils/auth");
const {Scene, Entity} = require("../../db/models");
const {Op} = require('sequelize');

const router = express.Router();

router.get(
    "/:id(\\d+)",
    restoreUser,
    asyncHandler(async (req,res) => {
        const {user} = req;
        let id = parseInt (req.params.id)

        let entity = await Entity.findOne({
            where: {
                id,
                [Op.or]: {
                    userId: user.id,
                    isPublished: true
                }
            }
        })

        if (entity) {
            entity = entity.toJSON();
            let allEntities = await Entity.findAll({
                where: {
                    userId: entity.userId,
                    [Op.or]: {
                        userId: user.id,
                        isPublished: true
                    }
                },
                order: [
                    ["order", "ASC"]
                ]
            })
            allEntities = allEntities.map(item => item.toJSON());
            let path = [];

            let current = entity;
            while (current) {
                current = allEntities.find(item => item.id === current.parentId);
                if (current) path.push(current);
            }
            
            let siblings = await Entity.findAll({
                where: {
                    parentId: entity.parentId,
                    userId: entity.userId,
                    [Op.or]: {
                        userId: user.id,
                        isPublished: true
                    }
                },
                order: [
                    ["order", "ASC"]
                ]
            })

            let children;
            if (entity.typeId === 1) {
                children = await Scene.findAll({
                    where: {
                        parentId: id,
                        order: {
                            [Op.ne]: null
                        }
                    },
                    order: [
                        ["order", "ASC"]
                    ]
                })
            } else {
                children = await Entity.findAll({
                    where: {
                        parentId: id,
                        userId: entity.userId,
                        [Op.or]: {
                            userId: user.id,
                            isPublished: true
                        }
                    },
                    order: [
                        ["order", "ASC"]
                    ]
                })
            }
            
            return res.json({path, siblings, children})
        } 

        return res.json({error: "no such story"})
    })
);

router.get(
    "/:id(\\d+)/children",
    restoreUser,
    asyncHandler(async (req,res) => {
        const {user} = req;
        let id = parseInt (req.params.id)
        const entity = await Entity.findOne({
            where: {
                id,
                [Op.or]: {
                    userId: user.id,
                    isPublished: true
                }
            }
        })
        
        if (entity && entity.typeId === 1) {
            let children = await Scene.findAll({
                where: {
                    parentId: id,
                    order: {
                        [Op.ne]: null
                    }
                },
                order: [
                    ["order", "ASC"]
                ]
            })
            return res.json(children)
        }
        else if (entity && entity.typeId !== 1) {
            children = await Entity.findAll({
                where: {
                    parentId: id,
                    userId: entity.userId,
                    [Op.or]: {
                        userId: user.id,
                        isPublished: true
                    }
                },
                order: [
                    ["order", "ASC"]
                ]
            })
            return res.json(children)
        }

        return res.json({error: "no such story"})

    })
);

module.exports = router;
