import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, ArrowRight, Home, Chrome, ShieldCheck, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from './AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { API_URL } from './config'

const FloatingNode = ({ delay = 0, style }) => (
    <motion.div
        animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
            duration: 4,
            repeat: Infinity,
            delay,
        }}
        className="absolute w-2 h-2 rounded-full bg-indigo-500"
        style={style}
    />
)

function Login({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { login } = useAuth()

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_URL}/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            })
            const data = await response.json()
            if (response.ok) {
                await login(data.access_token)
                onAuthSuccess()
            } else {
                setError(data.detail || "Access Denied: Google Identity verification failed")
            }
        } catch (err) {
            setError("Identity Service Connectivity Error")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleError = () => {
        setError("Security Notice: Google Authentication session interrupted")
    }

    const handleSubmit = async (e) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const response = await fetch(`${API_URL}/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        username: formData.username,
                        password: formData.password
                    })
                })
                const data = await response.json()
                if (!response.ok) throw new Error(data.detail || 'Access credentials invalid')
                await login(data.access_token)
                onAuthSuccess()
            } else {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
                const data = await response.json()
                if (!response.ok) throw new Error(data.detail || 'Identity could not be initialized')
                setIsLogin(true)
                setError("Profile established successfully. Please authenticate.")
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
            <div className="bg-mesh" />
            <div className="bg-dot-pattern absolute inset-0 opacity-10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-[1100px] min-h-[700px] grid grid-cols-1 lg:grid-cols-2 glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl glow-primary z-10"
            >
                {/* Branding Sidebar */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0f172a]/80 border-r border-white/5 relative overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
                        alt="Modern Interior"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay transition-transform duration-[20s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-[#020617]/80 to-[#020617] pointer-events-none" />

                    <div className="absolute inset-0 opacity-20">
                        <FloatingNode style={{ top: '20%', left: '30%' }} delay={0} />
                        <FloatingNode style={{ top: '50%', left: '70%' }} delay={1} />
                        <FloatingNode style={{ top: '80%', left: '40%' }} delay={2} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                <Home className="text-white" size={24} />
                            </div>
                            <span className="text-white font-bold tracking-tight text-2xl uppercase italic">LUMINA</span>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                            <ShieldCheck size={14} />
                            Military Grade Encryption
                        </div>
                        <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                            Unlock High-Fidelity <br />
                            <span className="text-gradient-primary">Asset Intelligence</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Access institutional-grade real estate forecasting and neural market analysis in real-time.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-8 border-t border-white/5 pt-8">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-slate-800 shadow-xl" />
                            ))}
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">+12,400 Institutional Partners Joined</div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-10 lg:p-20 flex flex-col justify-center relative overflow-hidden bg-[#020617]/40 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.05] to-transparent pointer-events-none" />

                    {/* Floating Decorative Image for Login Page */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0.15, x: 0 }}
                        className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none hidden lg:block"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=500&q=60"
                            className="w-full h-full object-cover rounded-full filter grayscale sepia brightness-50 contrast-125"
                            alt="Data Abstract"
                        />
                    </motion.div>

                    <div className="mb-12 lg:hidden flex justify-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg"> <Home className="text-white" size={20} /> </div>
                            <span className="text-white font-bold tracking-tight text-xl uppercase italic">Lumina</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-12">
                        <h2 className="text-4xl font-black text-white tracking-tighter">
                            {isLogin ? 'Welcome Back' : 'System Enrollment'}
                        </h2>
                        <p className="text-slate-500 text-base font-medium">
                            {isLogin ? 'Authenticate to access your analytics dashboard' : 'Initialize your prediction profile on the network'}
                        </p>
                    </div>

                    <div className="w-full mb-10 group">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                            shape="rectangular"
                            theme="filled_black"
                            text="signin_with"
                            size="large"
                            width="100%"
                        />
                    </div>

                    <div className="flex items-center gap-6 mb-10">
                        <div className="h-px bg-white/5 flex-1" />
                        <span className="text-slate-600 text-[10px] uppercase font-black tracking-[0.3em]">Institutional Access</span>
                        <div className="h-px bg-white/5 flex-1" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2 group">
                                <div className="relative">
                                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Identification ID"
                                        className="w-full pl-14 pr-6 py-5 rounded-2xl glass-dark text-white border border-white/5 focus:ring-2 focus:ring-indigo-500/30 outline-none placeholder-slate-700 text-sm font-medium transition-all group-hover:border-white/10"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-2 group">
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            placeholder="Institutional Email"
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl glass-dark text-white border border-white/5 focus:ring-2 focus:ring-indigo-500/30 outline-none placeholder-slate-700 text-sm font-medium transition-all group-hover:border-white/10"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 group">
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Access Protocol Key"
                                        className="w-full pl-14 pr-6 py-5 rounded-2xl glass-dark text-white border border-white/5 focus:ring-2 focus:ring-indigo-500/30 outline-none placeholder-slate-700 text-sm font-medium transition-all group-hover:border-white/10"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-4 ${error.includes('successfully') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                <AlertCircle size={20} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full py-5 bg-gradient-premium text-white font-black rounded-2xl shadow-2xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    {isLogin ? 'Authenticate Node' : 'Initialize Profile'}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-500 text-xs hover:text-indigo-400 transition-all font-bold uppercase tracking-[0.2em] relative"
                        >
                            {isLogin ? "Request Network Access?" : "Existing Identity Hub? Authenticate"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
