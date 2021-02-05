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
        const entity = await Entity.findByPk(id)
        const scenes = await Scene.findAll({
            where: {
                parentId: id
            },
            order: [
                ["order", "ASC"]
            ]
        })
        
        return res.json({entity, scenes})
    })
);

router.patch(
    "/:id(\\d+)",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        let id = parseInt (req.params.id)
        let {updates} = req.body
        

        await sequelize.transaction(async (tx) => {
            let entity = await Entity.findByPk(id, {transaction: tx})
            await entity.update({title: updates.title},{transaction: tx})

            for (let sceneId in updates.scenes) {
                let scene = await Scene.findByPk(sceneId, {transaction: tx})
                await scene.update(updates.scenes[sceneId],{transaction: tx})
            }

            if (updates.delete) {
                for (let i=0; i< updates.delete.length; i++) {
                    let sceneId = updates.delete[i];
                    let scene = await Scene.findByPk(sceneId, {transaction: tx})
                    await scene.destroy({transaction: tx})
                }
            }

        })
        
        return res.json({success:true})
    })
);

module.exports = router;
