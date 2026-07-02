import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function ProcessVideo() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
    const res = await api.post('/videos/process', { youtubeUrl: url })
    const videoId = res.data?.data?._id
    if (videoId) {
        navigate(`/study/${videoId}`)
    } else {
        setError('Video processed but could not redirect')
    }
} catch (err) {
    setError(err.response?.data?.message || 'Something went wrong')
}
    finally {
        setLoading(false)
    }
}

return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
        <div className="bg-gray-800 rounded-xl p-8 w-full max-w-xl">
            <h1 className="text-3xl font-bold mb-2">Process a Video</h1>
            <p className="text-gray-400 mb-6">Paste a YouTube lecture URL to generate notes, summary, flashcards and quiz.</p>

            {error && <p className="text-red-400 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-gray-700 text-white rounded-lg p-3 outline-none mb-4"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg"
                >
                    {loading ? 'Processing... (this may take 20 seconds)' : 'Process Video'}
                </button>
            </form>
        </div>
    </div>
)
}

export default ProcessVideo