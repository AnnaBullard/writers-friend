const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Entity } = require("../../db/models");

const router = express.Router();

router.get(
    "/",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        const entities = await Entity.findAll({
            where: {
                userId: user.id,
                parentId: null
            },
            include: {
                model:Entity,
                as: "children",
                required: false,
                include: {
                    model:Entity,
                    as: "children",
                    required: false,
                    include: {
                        model:Entity,
                        as: "children",
                    },
                    order: [
                        ["order","ACS"],
                        ["title", "ASC"]
                    ]
                },
                order: [
                    ["order","ASC"],
                    ["title", "ASC"]
                ]
            },
            order: [
                ["title", "ASC"]
            ]
        })
        return res.json(entities)
    })
);

module.exports = router;
