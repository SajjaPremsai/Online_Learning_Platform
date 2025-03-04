import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is Required"]
    },
    options: {
        type: [String],
        required: [true, "Options are required"],
        validate: {
            validator: function (arr) {
                return arr.length >= 4; // Make sure there are at least 4 options
            },
            message: "At least four options are required"
        }
    },
    correctAnswer: {
        type: String,
        required: [true, "Correct answer is required"],
        validate: {
            validator: function (value) {
                // Fix reference: `this.options` instead of `this.option`
                return this.options.includes(value); 
            },
            message: "Correct answer should be one of the provided options"
        }
    }
});

const QuizSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course ID is required"]
    },
    questions: {
        type: [QuestionSchema],
        required: [true, "At least one question is required"],
        validate: {
            validator: function (arr) {
                return arr.length > 0; // Ensure there is at least one question
            },
            message: "Quiz must have at least one question"
        }
    }
}, { timestamps: true });

export default mongoose.model("Quiz", QuizSchema);
