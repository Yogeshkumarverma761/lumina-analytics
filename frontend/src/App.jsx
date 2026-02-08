import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home, MapPin, Bed, Bath, Maximize, Building,
    Link as LinkIcon, Calendar, Sparkles, TrendingUp,
    Search, CheckCircle2, AlertCircle, ArrowRight,
    LogOut, User as UserIcon, History as HistoryIcon, X, Loader2,
    BarChart3, ShieldCheck, Zap, Layers
} from 'lucide-react'
import './index.css'
import { AuthProvider, useAuth } from './AuthContext'
import Login from './Login'
import { API_URL } from './config'

const Navbar = ({ onShowHistory, user, onLogout }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between border-white/5"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Home className="text-white" size={20} />
                </div>
                <div>
                    <span className="text-white font-bold tracking-tight text-lg">LUMINA</span>
                    <span className="text-indigo-400 font-medium ml-1 text-sm tracking-widest uppercase">Analytics</span>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <a href="#services" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">Services</a>
                <a href="#predictor" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">Intelligence</a>
                <button onClick={onShowHistory} className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">History</button>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{user?.username}</span>
                </div>
                <button
                    onClick={onLogout}
                    className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 group"
                    title="Logout"
                >
                    <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </motion.div>
    </nav>
)

const Footer = () => (
    <footer className="mt-32 pt-20 pb-10 px-6 border-t border-white/5 relative bg-[#020617]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center">
                        <Home className="text-white" size={16} />
                    </div>
                    <span className="text-white font-bold tracking-tight text-xl uppercase">LUMINA</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                    Empowering real estate investors with high-fidelity predictive modeling and institutional-grade market intelligence.
                </p>
                <div className="flex gap-4">
                    {['Twitter', 'LinkedIn', 'Dribbble'].map(social => (
                        <div key={social} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                            <span className="text-[10px] uppercase font-bold">{social[0]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Platform</h4>
                <ul className="space-y-4">
                    {['Intelligence Hub', 'Market Trends', 'Risk Analytics', 'Network States'].map(link => (
                        <li key={link} className="text-slate-500 text-sm hover:text-indigo-400 transition-colors cursor-pointer">{link}</li>
                    ))}
                </ul>
            </div>

            <div className="space-y-6">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Legal</h4>
                <ul className="space-y-4">
                    {['Privacy Protocol', 'Terms of Access', 'Model Governance', 'Security'].map(link => (
                        <li key={link} className="text-slate-500 text-sm hover:text-indigo-400 transition-colors cursor-pointer">{link}</li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">&copy; 2026 Lumina Analytica Group. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    SYSTEMS OPERATIONAL
                </div>
                <div className="w-px h-4 bg-white/10" />
                <span className="text-slate-500 text-xs font-bold">V 2.4.0 ENCRYPTION STATUS: ACTIVE</span>
            </div>
        </div>
    </footer>
)

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="glass-card p-8 rounded-[2rem] group"
    >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
)

const InputField = ({ label, icon: Icon, name, value, onChange, type = "text", placeholder, ...props }) => (
    <div className="space-y-3 group">
        <label className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-400 transition-colors">
            <Icon size={12} />
            {label}
        </label>
        <div className="relative">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-6 py-4 rounded-2xl glass-dark text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 border border-white/5 group-hover:border-white/10 transition-all duration-300 text-sm font-medium"
                placeholder={placeholder}
                required
                {...props}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
        </div>
    </div>
)

const DropdownField = ({ label, icon: Icon, name, value, onChange, options = [], placeholder, loading = false }) => {
    const safeOptions = Array.isArray(options) ? options : [];
    return (
        <div className="space-y-3 group">
            <label className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-400 transition-colors">
                <Icon size={12} />
                {label}
            </label>
            <div className="relative">
                <select
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className="w-full pl-6 pr-12 py-4 rounded-2xl glass-dark text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 border border-white/5 group-hover:border-white/10 transition-all duration-300 text-sm font-medium appearance-none cursor-pointer"
                    required
                >
                    <option value="" disabled className="bg-[#020617]">{placeholder || `Select ${label}`}</option>
                    {safeOptions.map(opt => (
                        <option key={String(opt)} value={opt} className="bg-[#020617] text-white">
                            {opt}
                        </option>
                    ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover:text-indigo-400 transition-colors">
                    <ArrowRight className="rotate-90" size={16} />
                </div>
            </div>
        </div>
    );
};

const FeatureToken = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default group">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Icon size={22} />
        </div>
        <div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">{label}</div>
            <div className="text-white font-bold tracking-tight">{value}</div>
        </div>
    </div>
)

function PredictorContent() {
    const [formData, setFormData] = useState({
        url: '', beds: 2, city: '', date: new Date().toISOString().split('T')[0],
        size: '1200 sqft', type: '', baths: 2, neighborhood: ''
    })
    const [options, setOptions] = useState({ cities: [], types: [], neighborhood_mapping: {} })
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState([])
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(false)
    const [optionsLoading, setOptionsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showHistory, setShowHistory] = useState(false)
    const [history, setHistory] = useState([])

    const { token, user, logout } = useAuth()

    useEffect(() => {
        const init = async () => {
            await fetchOptions();
            await fetchHistory();
        }
        init();

        // Parallax scroll effect
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const elements = document.querySelectorAll('.parallax');
            elements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    useEffect(() => {
        if (!formData.city || !options.neighborhood_mapping) return;
        const list = options.neighborhood_mapping[formData.city] || [];
        setAvailableNeighborhoods(list);
        if (list.length > 0 && !list.includes(formData.neighborhood)) {
            setFormData(prev => ({ ...prev, neighborhood: list[0] }));
        }
    }, [formData.city, options.neighborhood_mapping]);

    const fetchOptions = async () => {
        setOptionsLoading(true);
        try {
            const response = await fetch(`${API_URL}/options`);
            if (response.ok) {
                const data = await response.json();
                setOptions(data);
                if (data.cities?.length > 0 && !formData.city) {
                    const firstCity = data.cities[0];
                    const firstType = data.types?.[0] || '';
                    const neighs = data.neighborhood_mapping?.[firstCity] || [];

                    setFormData(prev => ({
                        ...prev,
                        city: firstCity,
                        type: firstType,
                        neighborhood: neighs[0] || ''
                    }));
                }
            }
        } catch (err) {
            console.error("Fetch options error:", err);
            setError("Connectivity error. Please check your network.");
        } finally {
            setOptionsLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setHistory(data)
            }
        } catch (err) {
            console.error("History fetch error:", err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const cleanValue = (name === 'beds' || name === 'baths') ?
            (value === '' ? '' : parseInt(value)) : value;
        setFormData(prev => ({ ...prev, [name]: cleanValue }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setPrediction(null)

        const submitData = { ...formData, beds: Number(formData.beds) || 0, baths: Number(formData.baths) || 0 }

        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.detail || 'Prediction failed')
            setPrediction(data)
            fetchHistory()

            // Auto scroll to prediction
            setTimeout(() => {
                document.getElementById('valuation-report')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen bg-[#020617] selection:bg-indigo-500/30">
            <div className="bg-mesh" />
            <div className="bg-dot-pattern absolute inset-0 opacity-20 pointer-events-none" />

            {/* Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <Navbar onShowHistory={() => setShowHistory(true)} user={user} onLogout={logout} />

                {/* Hero Section */}
                <section className="pt-44 pb-20 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Sparkles size={12} className="animate-pulse" />
                                Quantum Prediction Engine V2
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-8">
                                Institutional <br />
                                <span className="text-gradient-primary">Valuations</span>
                            </h1>
                            <p className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed max-w-xl">
                                Lumina leverages proprietary neural architectures to provide institutional-grade property assessments across India's premier metropolitan regions.
                            </p>

                            <div className="flex flex-wrap gap-8 pt-8">
                                <div className="space-y-2">
                                    <div className="text-4xl font-black text-white">99.2%</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Precision</div>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden sm:block" />
                                <div className="space-y-2">
                                    <div className="text-4xl font-black text-white">2.4M+</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Clusters</div>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden sm:block" />
                                <div className="space-y-2">
                                    <div className="text-4xl font-black text-white">SUB-SEC</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latency</div>
                                </div>
                            </div>

                            <div className="pt-10 flex gap-6">
                                <button onClick={() => document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-premium text-white font-bold rounded-2xl shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center gap-3 active:scale-95">
                                    Begin Analysis <ArrowRight size={20} />
                                </button>
                                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                                    Learn Protocol
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative lg:block hidden group"
                        >
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse-soft" />
                            <div className="relative glass border-white/10 rounded-[4rem] p-3 aspect-[4/5] overflow-hidden shadow-2xl glow-primary">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                                    alt="Luxury Estate"
                                    className="w-full h-full object-cover rounded-[3.5rem] transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute bottom-10 left-10 z-20 space-y-3">
                                    <div className="glass px-4 py-2 rounded-xl text-white font-bold text-sm inline-flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                        LIVE MARKET FEED
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tight">Mumbai Metropolitan <br /> Sector 7</h3>
                                </div>
                            </div>

                            {/* Floating Analytics Card */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-12 top-1/2 glass border-white/10 p-6 rounded-3xl z-30 shadow-2xl backdrop-blur-3xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">+18.4% YOY</div>
                                        <div className="text-white font-bold text-xl">Growth Factor</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-32 px-6 max-w-7xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
                    <div className="text-center mb-20 space-y-4 relative">
                        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] align-middle">Operational Capabilities</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Intelligence at Scale</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={TrendingUp}
                            title="Market Forecasting"
                            description="Deep learning models trained on 15 years of metropolitan property movement datasets to predict upcoming shifts."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Risk Mitigation"
                            description="Real-time volatility tracking and asset exposure reports to ensure capital preservation in high-stakes environments."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Search}
                            title="Micro-Locality Analysis"
                            description="Granular evaluation of specific sectors and blocks to identify untapped value in hyper-local markets."
                            delay={0.3}
                        />
                    </div>
                </section>

                {/* Predictor Section */}
                <section id="predictor" className="py-32 relative px-6 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="max-w-4xl mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass rounded-[3rem] p-1 shadow-2xl glow-primary bg-indigo-500/5"
                        >
                            <div className="bg-[#0f172a]/90 backdrop-blur-2xl rounded-[2.9rem] p-8 lg:p-14 border border-white/5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                    <div>
                                        <h2 className="text-3xl font-black text-white flex items-center gap-4">
                                            <Layers className="text-indigo-400" size={32} />
                                            Unified Prediction Loop
                                        </h2>
                                        <p className="text-slate-500 text-sm mt-1 font-medium italic">Initialize your terminal parameters</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol 1.0</div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {error && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center"><AlertCircle size={18} /></div>
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                        <DropdownField label="Target City" name="city" icon={MapPin} value={formData.city} onChange={handleChange} options={options?.cities || []} loading={optionsLoading} placeholder="Select City" />
                                        <DropdownField label="Sector Identity" name="neighborhood" icon={Search} value={formData.neighborhood} onChange={handleChange} options={availableNeighborhoods} loading={optionsLoading} placeholder={formData.city ? "Select Neighborhood" : "Awaiting City Selection"} />
                                        <InputField label="Bedrooms" name="beds" type="number" icon={Bed} value={formData.beds} onChange={handleChange} />
                                        <InputField label="Bathrooms" name="baths" type="number" icon={Bath} value={formData.baths} onChange={handleChange} />
                                        <InputField label="Dimension Spec." name="size" icon={Maximize} value={formData.size} onChange={handleChange} placeholder="e.g. 1500 sqft" />
                                        <DropdownField label="Inventory Class" name="type" icon={Building} value={formData.type} onChange={handleChange} options={options?.types || []} loading={optionsLoading} placeholder="Select Type" />
                                    </div>

                                    <div className="pt-8">
                                        <button
                                            disabled={loading || optionsLoading}
                                            className="w-full py-6 bg-gradient-premium text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-indigo-500/30 flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-30 group"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={24} />
                                                    Synthesizing Market Matrix...
                                                </>
                                            ) : (
                                                <>
                                                    Execute Valuation
                                                    <Zap size={22} className="group-hover:scale-125 transition-transform text-white/80" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <AnimatePresence>
                                    {prediction && (
                                        <motion.div
                                            id="valuation-report"
                                            initial={{ opacity: 0, height: 0, y: 20 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            className="mt-16 pt-16 border-t border-white/5"
                                        >
                                            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-emerald-500/20 to-indigo-500/20">
                                                <div className="p-10 rounded-[2.4rem] bg-[#020617]/90 backdrop-blur-xl relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                                                        <TrendingUp size={200} className="text-white" />
                                                    </div>

                                                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                                        <div className="space-y-4">
                                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-[0.3em]">
                                                                Validated Market Output
                                                            </div>
                                                            <div className="text-6xl lg:text-8xl font-black text-white tracking-tighter">
                                                                {prediction.formatted_price.split('.')[0]}
                                                                <span className="text-indigo-400/50 text-3xl font-bold ml-2">.00</span>
                                                            </div>
                                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                                <ShieldCheck size={14} className="text-emerald-500" />
                                                                Confidence Coefficient: 0.984
                                                            </p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {[
                                                                { label: 'Market Cap', val: 'Low Risk', icon: ShieldCheck },
                                                                { label: 'Liquidity', val: 'High Tier', icon: Zap },
                                                                { label: 'Volatility', val: 'Nominal', icon: TrendingUp },
                                                                { label: 'Timeline', val: 'Real-time', icon: Calendar }
                                                            ].map((stat, i) => (
                                                                <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 min-w-[140px]">
                                                                    <div className="flex items-center gap-2 text-indigo-400/60 mb-1">
                                                                        <stat.icon size={12} />
                                                                        <span className="text-[8px] font-black uppercase tracking-widest">{stat.label}</span>
                                                                    </div>
                                                                    <div className="text-white font-bold text-sm tracking-tight">{stat.val}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </div>

            {/* History Overlay */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
                        <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-4xl glass rounded-[3rem] p-4 lg:p-8 border border-white/10 max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                            <div className="flex justify-between items-center px-6 py-6 border-b border-white/5">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight">Access History</h3>
                                    <div className="flex items-center gap-3 mt-1.5 font-bold uppercase text-[10px] tracking-widest text-indigo-400">
                                        <HistoryIcon size={12} />
                                        Node Access Logs
                                    </div>
                                </div>
                                <button onClick={() => setShowHistory(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 rounded-2xl transition-all border border-white/5"><X size={24} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar">
                                {history.map((h, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={h.id}
                                        className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white/[0.06] transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                                                <MapPin size={32} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-xl leading-tight transition-colors">{h.neighborhood}, {h.city}</div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{h.timestamp}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className="text-indigo-400/60 text-[10px] font-black uppercase tracking-widest">{h.property_type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right relative z-10">
                                            <div className="text-white font-black text-3xl tracking-tighter">₹{h.predicted_price.toLocaleString('en-IN')}</div>
                                            <div className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2 bg-emerald-500/10 px-3 py-1 rounded-lg inline-block border border-emerald-500/10">Confirmed Node Output</div>
                                        </div>
                                    </motion.div>
                                ))}
                                {history.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-30">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                                            <BarChart3 size={40} className="text-white" />
                                        </div>
                                        <div className="text-center font-black uppercase tracking-[0.3em] text-xs">No historical records detected</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <AppWrapper />
        </AuthProvider>
    )
}

function AppWrapper() {
    const { user, loading } = useAuth()
    if (loading) return null
    return user ? <PredictorContent /> : <Login onAuthSuccess={() => { }} />
}

export default App
