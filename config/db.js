import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config();


const db_conn = mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
console.log("Connected to MongoDB")
})
.catch((err)=>{
console.log(err)
console.log("Error connecting to MongoDB")
})

export default db_conn