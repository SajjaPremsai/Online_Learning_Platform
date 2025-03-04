import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


router.post("/register", async (req,res)=>{
    try{
        const {name,email,password,role = "student"} = req.body;
        if(!["student","instructor"].includes(role)){
            return res.status(400).json({
                message:"Invalid role. Allowed roles: student, instructor"
            })
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({
            message: "User Registered Successfully",
            role: newUser.role
        })
    }catch(err){
        res.status(500).json({
            error: "Server Error, please try again"
        })
    }
})

router.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }
        const token = jwt.sign({
            id: user._id, role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn : "1d"});

        res.json({
            message: "Login Successful",
            token,
            role: user.role
        })
    }catch(error){
        res.status(500).json({
            error: "Server error, please try again"
        })
    }
})

router.get("/me", verifyToken, async (req,res)=>{
    try{
        const user = await User.findOne(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(user);
    }catch(error){
        res.status(500).json({
            error: "Server error, please try again"
        })
    }
})

router.put("/update-role/:id",verifyToken,roleMiddleware(["admin"]),async (req,res)=>{
    try{
        const {role} = req.body;
        if(!["student","instructor","admin"].includes(role)){
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const updateuser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if(!updateuser){
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.json({
            message: "User role updated Successfully",
            updateuser
        })
    }catch(error){
        res.status(500).json({
            error: "Server error, please try again"
        })
    }
})

export default router