import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const verifyToken = async (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }catch(error){
        return res.status(400).json({
            message: "Invalid token"
        })
    }
};