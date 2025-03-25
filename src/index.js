import express from "express";

import cors from 'cors';

import mongoose  from "mongoose";

import { userRouter } from './routes/users.js'
import { recipesRouter } from './routes/recipes.js'

const app=express();

app.use(express.json());


app.use(cors());


app.use("/auth",userRouter)
app.use("/recipes",recipesRouter)

mongoose.connect("mongodb+srv://harsh:har04tiw@cluster0.r4zuffh.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0");

//connecting to the database
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


