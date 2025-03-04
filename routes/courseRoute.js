import express from "express";
import Course from "../models/Course.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const route = express.Router();


route.post("/",verifyToken,roleMiddleware(["instructor"]), async(req,res)=>{
    try{
        const course = new Course({
            ...req.body,
            instructor: req.user.id
        })
        await course.save();
        res.status(201).json(course);
    }catch(error){
        res.status(500).json({message: error.message})
    }
});

route.get("/",async(req,res)=>{
    try{
        const courses = await Course.find().populate("instructor","name","email");
        res.json(courses);
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})

route.get("/:id",async(req,res)=>{
    try{
        const course = await Course.findById(req.params.id).populate("instructor","name","email");
        if(!course){
            return res.status(404).json({message: "Course not found"})
        }
        res.json(course)
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})

route.put("/:id", verifyToken, roleMiddleware(["instructor"]), async(req,res)=>{
    try{
        const course = await Course.findByIdAndUpdate(req.params.id,req.body,{ new : true});
        if(!course){
            return res.status(404).json({message: "Course not found"})
        }
        res.send(course)
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})

route.delete("/:id", verifyToken, roleMiddleware(["instructor"]), async(req,res)=>{
    try{
        const course = await Course.findByIdAndDelete(req.params.id);
        if(!course){
            return res.status(404).json({message: "Course not found"})
        }
        res.json({
            message: "Course deleted successfully"
        })
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})

export default route;