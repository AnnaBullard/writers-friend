const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
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
            const scenes = await Scene.findAll({
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

module.exports = router;
