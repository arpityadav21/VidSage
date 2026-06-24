import mongoose from "mongoose"

const flashcardSchema = new mongoose.Schema({
    question: String,
    answer: String
})

const videoSchema = new mongoose.Schema({
    youtubeUrl: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ""
    },
    summary: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    },
    chapters: {
        type: String,
        default: ""
    },
    flashcards: [flashcardSchema],
    tags: [String],
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    personalNotes: {
        type: String,
        default: ""
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const Video = mongoose.model("Video", videoSchema)