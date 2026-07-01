import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const { setUser } = useAuth()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
        const res = await api.post('/users/login', { email, password })
        setUser(res.data.data.user)
        navigate('/dashboard')
    } catch (err) {
        setError(err.response?.data?.message || 'Login failed')
    }
}


return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h1 className="text-3xl font-bold text-white mb-6">Welcome back</h1>
            
            {error && <p className="text-red-400 mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-1 block">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg p-3 outline-none"
                        placeholder="Enter your email"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-gray-400 text-sm mb-1 block">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg p-3 outline-none"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                >
                    Login
                </button>
            </form>

            <p className="text-gray-400 text-center mt-4">
                Don't have an account? <Link to="/register" className="text-blue-400">Register</Link>
            </p>
        </div>
    </div>
)
}


export default Login