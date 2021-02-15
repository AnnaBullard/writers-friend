const express = require("express");
const asyncHandler = require("express-async-handler");

const { restoreUser } = require("../../utils/auth");
const { Scene, Entity, sequelize } = require("../../db/models");

const router = express.Router();

router.get(
    "/:id(\\d+)",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        let id = parseInt (req.params.id)
        const entity = await Entity.findOne({
            where: {
                id,
                userId: user.id,
                typeId: 1
            }
        })

        if (entity) {
            let scenes = await Scene.findAll({
                where: {
                    parentId: id
                },
                order: [
                    ["order", "ASC"]
                ]
            })
            if (!scenes || scenes.length === 0) {
                const newScene = await Scene.create({parentId: entity.id, order: 0, text:""})
                scenes = [newScene]
            }
            return res.json({entity, scenes})
        } else {
            return res.json({error: "no such story"})
        }
    })
);

router.get(
    "/:id(\\d+)/read",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        let id = parseInt (req.params.id)
        const entity = await Entity.findOne({
            where: {
                id,
                typeId: 1,
                [Op.or]: {
                    userId: user.id,
                    isPublished: true
                }
            }
        })

        if (entity) {
            let scenes = await Scene.findAll({
                where: {
                    parentId: id
                },
                order: [
                    ["order", "ASC"]
                ]
            })
            return res.json({entity, scenes})
        } else {
            return res.json({error: "no such story"})
        }
    })
);

router.patch(
    "/:id(\\d+)",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        let id = parseInt (req.params.id)
        let {updates} = req.body

        let newScenes = {};

        await sequelize.transaction(async (tx) => {
            let entity = await Entity.findByPk(id, {transaction: tx})
            await entity.update({title: updates.title},{transaction: tx})

            for (let sceneId in updates.scenes) {
                let scene = await Scene.findByPk(sceneId, {transaction: tx})
                await scene.update(updates.scenes[sceneId],{transaction: tx})
            }

            for (let i = 0; i < updates.new.length; i++){
                let scene = await Scene.create({
                    text: updates.new[i].text, 
                    order: updates.new[i].order,
                    parentId: id
                }, {transaction: tx})
                newScenes[updates.new[i].id] = scene.id
            }

            if (updates.deleted) {
                for (let i=0; i< updates.deleted.length; i++) {
                    let sceneId = updates.deleted[i];
                    let scene = await Scene.findByPk(sceneId, {transaction: tx})
                    await scene.destroy({transaction: tx})
                }
            }

        })
        
        return res.json({newScenes})
    })
);

router.get(
    "/start",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;

        await sequelize.transaction(async (tx) => {
            const entity = await Entity.create({
                userId: user.id,
                typeId: 1,
                order: 0
            }, {transaction: tx})
    
            const scene = await Scene.create({
                parentId: entity.id,
                order: 0,
                text: ""
            }, {transaction: tx})

            return res.json({entity, scene})
        })

        return res.json({error: "something went wrong"})
    })
);

module.exports = router;
