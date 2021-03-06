const express = require("express");
const asyncHandler = require("express-async-handler");
const {restoreUser} = require("../../utils/auth");
const {Entity, sequelize} = require("../../db/models");
const {singleMulterUpload, singlePublicFileUpload} = require("../../awsS3");
const {Op} = require('sequelize');

const router = express.Router();

router.get(
    "/",
    restoreUser,
    asyncHandler(async (req,res) => {
        const { user } = req;
        const entities = await Entity.getEntitiesPerUser(user.id)

        return res.json(entities)
    })
);

router.post("/",
singleMulterUpload("image"),
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
singleMulterUpload("image"),
restoreUser,
asyncHandler(async (req,res) => {
    let {user} = req;
    user = user.toJSON();
    let data = req.body;
    let entity = {
        id : data.id,
        title : data.title,
        description : data.description,
        pseudonymId : parseInt(data.pseudonymId) || null,
        typeId : parseInt(data.typeId),
        parentId : parseInt(data.parentId) || null,
        isPublished : data.isPublished,
    }
    
    let imageUrl;
    if (req.file)
        imageUrl = await singlePublicFileUpload(req.file);
    
    let newEntity = await Entity.findByPk(entity.id, {
        where: {
            userId: user.id
        }
    });
    
    if (newEntity) {
        
        await sequelize.transaction(async (tx) => {
            
            let order = entity.order === undefined ? newEntity.order : entity.order;

            // if reordered within same parent not on the top level
            if (newEntity.parentId !== null 
                && entity.parentId === newEntity.parentId
                && entity.order !== newEntity.order) {
                //get all siblings except current
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

                if (order === "last") order = siblings.length+1

                if (order > newEntity.order) order--;
                //rearrange siblings, placing enity in the right position
                siblings = [...siblings.slice(0,order), entity, ...siblings.slice(order)]
                
                //update all entities that order isn't equal index except current entity
                await siblings.forEach(async (child,idx)=>{
                    if (child.order !== idx && child.id !== entity.id) {
                        await child.update({
                            order: idx
                        },{transaction: tx})
                    }
                })
            }

            //if entity moved to different parent and current parent isn't null
            if (entity.parentId !== undefined 
                && entity.parentId !== newEntity.parentId 
                && newEntity.parentId !== null) {
                //get all siblings except current
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
                //update all entities that order isn't equal index except current entity
                await siblings.forEach(async (child,idx)=>{
                    if (child.order !== idx) {
                        await child.update({
                            order: idx
                        },{transaction: tx})
                    }
                })
            }
            
            //if entity moved to different parent and new parent isn't null
            if (entity.parentId !== undefined 
                && entity.parentId !== newEntity.parentId 
                && entity.parentId !== null) {
                let newSiblings = await Entity.findAll({
                    where: {
                        parentId: entity.parentId,
                        userId: user.id
                    },
                    order: ["order"]
                },{transaction: tx})
                
                if (entity.order === undefined || entity.order === "last") {
                    order =  newSiblings.length;
                } else {
                    //rearrange siblings, placing enity in the right position
                    newSiblings = [...newSiblings.slice(0,order), entity, ...newSiblings.slice(order)]
                    
                    //update all entities that order isn't equal index except current entity
                    await newSiblings.forEach(async (child,idx)=>{
                        if (child.order !== idx && child.id !== entity.id) {
                            await child.update({
                                order: idx
                            },{transaction: tx})
                        }
                    })
                }
            }

            if (entity.parentId !== undefined 
                && entity.parentId !== newEntity.parentId 
                && entity.parentId === null 
                && order === "last") {
                    order = 0
            }

            if (imageUrl) {
                entity = {...entity, imageUrl}
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
