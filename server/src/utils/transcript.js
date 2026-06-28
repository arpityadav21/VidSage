import { YoutubeTranscript } from "youtube-transcript"

const getTranscript = async (youtubeUrl) => {
    const urlObj = new URL(youtubeUrl)
    const videoId = urlObj.searchParams.get("v")

    if (!videoId) {
        throw new Error("Invalid YouTube URL")
    }

    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId)
    
    const transcript = transcriptArr
        .map(item => item.text)
        .join(" ")

    return { videoId, transcript }
}

export { getTranscript }