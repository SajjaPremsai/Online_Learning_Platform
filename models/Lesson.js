import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title:{
        type: String,
        required: true
    },
    videoUrl:{
        type: String,
        required: true
    },
    content:{
        type:String
    }
}, { timestamps : true });

export default mongoose.model("Lesson",LessonSchema);