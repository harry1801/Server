import { RecipeModel } from "../models/Recipes.js";

import express from 'express';
import verifyToken from "./users.js"
import mongoose from 'mongoose'
import { UserModel } from "../models/Users.js";

const router =express.Router();

router.get("/",async(req,res)=>{
    try {
        const response=await RecipeModel.find({});
        res.json(response);
    } catch (error) {
        res.json(error);
    }
});

router.post("/",verifyToken,async(req,res)=>{
    const recipe =new RecipeModel(req.body)
    try {
        const response=await recipe.save();
        res.json(response);
    } catch (error) {
        res.json(error);
    }
    
});

router.put("/", verifyToken, async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        
        if (!user || !recipe) {
            return res.status(404).json({ message: "User or Recipe not found" });
        }

        // Check if recipe is already saved
        if (!user.savedRecipes.includes(recipe._id)) {
            user.savedRecipes.push(recipe._id);
            await user.save();
        }

        res.json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.status(500).json({ message: "Error saving recipe", error });
    }
});


router.get("/savedRecipes/ids/:userID",async(req,res)=>{
    try {
        const user =await UserModel.findById(req.params.userID);

        res.json({savedRecipes:user?.savedRecipes})
        
    } catch (error) {
        res.json(error);
    }

});

router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const savedRecipes = await RecipeModel.find({ _id: { $in: user.savedRecipes }});

        res.json({ savedRecipes });  // Send the full recipe objects
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
});




export {router as recipesRouter};


