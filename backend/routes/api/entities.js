const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Entity, Pseudonym } = require("../../db/models");
const { Op } = require('sequelize');

const router = express.Router();

router.get(
    "/",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        const entities = await Entity.findAll({ //World
            where: {
                userId: user.id,
                parentId: null,
                // typeId: {
                //     [Op.ne]: 1
                // }
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
                        as: "children",
                        order: [
                            ["order","ACS"]
                        ]
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
            },{
                model: Pseudonym
            }
        ],
            order: [
                ["title", "ASC"]
            ]
        })

        // const single_entities = await Entity.findAll({
        //     where: {
        //         userId: user.id,
        //         parentId: null,
        //         typeId: 1
        //     },
        //     include: {
        //         model: Pseudonym
        //     },
        //     order: [
        //         ["title", "ASC"]
        //     ]
        // })

        return res.json(entities)
    })
);

module.exports = router;
