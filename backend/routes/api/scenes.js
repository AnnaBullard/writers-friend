const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Scene, Entity } = require("../../db/models");

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

module.exports = router;
