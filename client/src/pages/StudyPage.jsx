import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

function StudyPage() {
    const { videoId } = useParams()
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('summary')
    const [flipped, setFlipped] = useState({})
    const [quizAnswers, setQuizAnswers] = useState({})

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/videos/${videoId}`)
                setVideo(res.data.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchVideo()
    }, [videoId])

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">Loading...</div>
    if (!video) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">Video not found</div>

    const tabs = ['summary', 'notes', 'chapters', 'flashcards', 'quiz']

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">{video.title || video.videoId}</h1>
            <a href={video.youtubeUrl} target="_blank" className="text-blue-400 text-sm mb-6 block">Watch on YouTube ↗</a>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg capitalize font-semibold ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Summary */}
            {activeTab === 'summary' && (
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Summary</h2>
                    <p className="text-gray-300 leading-relaxed">{video.summary}</p>
                </div>
            )}

            {/* Notes */}
            {activeTab === 'notes' && (
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Study Notes</h2>
                    <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
    {typeof video.notes === 'string' 
        ? video.notes 
        : JSON.stringify(video.notes, null, 2)}
</pre>
                </div>
            )}

            {/* Chapters */}
            {activeTab === 'chapters' && (
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Chapters</h2>
                    <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">{
                        typeof video.chapters === 'string' ? video.chapters : JSON.stringify(video.chapters, null, 2)
                    }</pre>
                </div>
            )}

            {/* Flashcards */}
            {activeTab === 'flashcards' && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Flashcards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {video.flashcards?.map((card, i) => (
                            <div
                                key={i}
                                onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
                                className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 min-h-32 flex items-center justify-center text-center"
                            >
                                <p className="text-gray-300">
                                    {flipped[i] ? card.answer : card.question}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-3">Click a card to flip it</p>
                </div>
            )}

            {/* Quiz */}
            {activeTab === 'quiz' && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Quiz</h2>
                    {video.quiz?.map((q, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-6 mb-4">
                            <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
                            <p>{JSON.stringify(q.options)}</p>
                            <div className="flex flex-col gap-2">
                                {q.options?.map((opt, j) => (
                                    <button
                                        key={j}
                                        onClick={() => setQuizAnswers(prev => ({ ...prev, [i]: opt }))}
                                        className={`text-left px-4 py-2 rounded-lg ${
                                            quizAnswers[i] === opt
                                                ? opt === q.answer || q.options?.indexOf(q.answer) === j
                                                    ? 'bg-green-600'
                                                    : 'bg-red-600'
                                                : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default StudyPage