import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { getTranscript } from "../utils/transcript.js"
import { generateContent } from "../utils/gemini.js"

const processVideo = asyncHandler(async (req, res) => {
    const { youtubeUrl } = req.body

    if (!youtubeUrl) {
        throw new ApiError(400, "YouTube URL is required")
    }

    const { videoId, transcript } = await getTranscript(youtubeUrl)

    const summary = await generateContent(`Summarize this transcript in 100 words:\n${transcript}`)

const notesAndChapters = await generateContent(`From this transcript, give me:
NOTES:
(write bullet point study notes here)

CHAPTERS:
(list the main topics covered)

Transcript:\n${transcript}`)

const flashcardsAndQuiz = await generateContent(`From this transcript, return ONLY a JSON object: {"flashcards": [{"question":"...","answer":"..."}], "quiz": [{"question":"...","options":["A","B","C"],"answer":"A"}]}. Generate 5 flashcards and 5 quiz questions. No other text.\n${transcript}`)

let notes = "", chapters = "", flashcards = [], quiz = []

const parts = notesAndChapters.split('CHAPTERS:')
notes = parts[0].replace('NOTES:', '').trim()
chapters = parts[1]?.trim() || ""
try {
    const p2 = JSON.parse(flashcardsAndQuiz.replace(/```json|```/g, "").trim())
    flashcards = p2.flashcards || []
    quiz = p2.quiz || []
} catch(e) { flashcards = []; quiz = [] }
    const video = await Video.create({
    youtubeUrl,
    videoId,
    summary,
    notes,
    chapters,
    flashcards,
    quiz,
    createdBy: req.user._id
})

    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video processed successfully"))
})


const getUserVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"))
})


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findOne({ 
        _id: videoId, 
        createdBy: req.user._id 
    })

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"))
})


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { tags, rating, personalNotes } = req.body

    const video = await Video.findOneAndUpdate(
        { _id: videoId, createdBy: req.user._id },
        { $set: { tags, rating, personalNotes } },
        { new: true }
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video updated successfully"))
})


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findOneAndDelete({
        _id: videoId,
        createdBy: req.user._id
    })

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"))
})


export { processVideo, getUserVideos, getVideoById, updateVideo, deleteVideo }