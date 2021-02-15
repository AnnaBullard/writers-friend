const express = require("express");
const { check } = require('express-validator');
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Pseudonym, sequelize } = require("../../db/models");
const { Op } = require('sequelize');

const router = express.Router();

router.get(
    "/",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        const pseudonyms = await Pseudonym.findAll({
            where: {
                userId:user.id
            },
            order:["id"]
        })
        return res.json(pseudonyms)
    })
);

const validatePseudonym = [
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide first name.'),
      check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide last name.'),
    handleValidationErrors
  ];

router.post("/",
restoreUser,
validatePseudonym,
asyncHandler(async (req,res) => {
    let { user } = req;
    user = user.toJSON();
    let pseudo = req.body;
    let pseudonym;

    await sequelize.transaction(async (tx) => {

        if (pseudo.isActive) {
            let activePseudo = await Pseudonym.findOne({
                where: {
                    userId: user.id,
                    isActive: true
                }
            })
            if (activePseudo) {
                await activePseudo.update({
                    isActive:false
                },{transaction: tx})
            }
        }

        pseudonym = await Pseudonym.create({
            firstName: pseudo.firstName,
            middleName: pseudo.middleName,
            lastName: pseudo.lastName,
            isActive: pseudo.isActive,
            userId: user.id
        },{transaction: tx})
    })

    return res.json(pseudonym)
}))

router.patch("/",
restoreUser,
validatePseudonym,
asyncHandler(async (req,res) => {
    let { user } = req;
    user = user.toJSON();
    let pseudo = req.body;
    
    let pseudonym = await Pseudonym.findByPk(pseudo.id)

    await sequelize.transaction(async (tx) => {

        if (pseudo.isActive) {
            let activePseudo = await Pseudonym.findOne({
                where: {
                    userId: user.id,
                    isActive: true
                }
            })
            if (activePseudo) {
                await activePseudo.update({
                    isActive:false
                },{transaction: tx})
            }
        }

        await pseudonym.update({
            firstName: pseudo.firstName,
            middleName: pseudo.middleName,
            lastName: pseudo.lastName,
            isActive: pseudo.isActive
        },{transaction: tx})
    })


    return res.json(pseudonym)
}))

router.delete("/:id(\\d+)",
restoreUser,
asyncHandler(async (req,res) => {
    let { user } = req;
    user = user.toJSON();
    let { id } = req.params;
    id = parseInt(id);

    let pseudonym = await Pseudonym.findByPk(id)
    
    await sequelize.transaction(async (tx) => {
        
        await pseudonym.destroy({transaction: tx});

    })

    return res.json({success:true})
}))



module.exports = router;
