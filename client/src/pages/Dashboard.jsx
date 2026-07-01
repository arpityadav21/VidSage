import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await api.get('/videos')
                setVideos(res.data.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchVideos()
    }, [])

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Study Library</h1>
                <button
                    onClick={() => navigate('/process')}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
                >
                    + New Video
                </button>
            </div>

            {videos.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                    <p className="text-xl">No videos yet!</p>
                    <p className="mt-2">Paste a YouTube URL to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(video => (
                        <div
                            key={video._id}
                            onClick={() => navigate(`/study/${video._id}`)}
                            className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition"
                        >
                            <h2 className="text-lg font-semibold mb-2">{video.title || video.videoId}</h2>
                            <p className="text-gray-400 text-sm line-clamp-3">{video.summary}</p>
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {video.tags?.map(tag => (
                                    <span key={tag} className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">{tag}</span>
                                ))}
                            </div>
                            {video.rating && <p className="text-yellow-400 mt-2">{'⭐'.repeat(video.rating)}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard