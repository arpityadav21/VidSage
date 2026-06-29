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

    // Fetch transcript
    const { videoId, transcript } = await getTranscript(youtubeUrl)

    // Generate all content from Gemini
    const [summary, notes, chapters, flashcardsRaw, quizRaw] = await Promise.all([
        generateContent(`Summarize this video transcript in 150-200 words:\n${transcript}`),
        generateContent(`Generate detailed structured study notes with headings and bullet points from this transcript:\n${transcript}`),
        generateContent(`Break this transcript into chapters with timestamps if possible. Format as: Chapter 1: [title] - [brief description]:\n${transcript}`),
        generateContent(`Generate 10 flashcards from this transcript. Return ONLY a JSON array like this: [{"question": "...", "answer": "..."}]. No extra text:\n${transcript}`),
        generateContent(`Generate a 5 question multiple choice quiz from this transcript. Return ONLY a JSON array like this: [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}]. No extra text:\n${transcript}`)
    ])

    // Parse flashcards
    let flashcards = []
    try {
        const cleaned = flashcardsRaw.replace(/```json|```/g, "").trim()
        flashcards = JSON.parse(cleaned)
    } catch(e) {
        flashcards = []
    }

    // Parse quiz 
    let quiz = []
    try {
        const cleaned = quizRaw.replace(/```json|```/g, "").trim()
        quiz = JSON.parse(cleaned)
    } catch(e) {
        quiz = []
    }

    // Save to MongoDB
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