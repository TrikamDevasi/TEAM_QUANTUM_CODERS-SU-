import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Eye, EyeOff, ArrowLeft, User, Building2, Globe, Shield, Briefcase } from 'lucide-react';

const roleConfig = {
  student: {
    icon: User,
    label: 'Student',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-400',
    redirectPath: '/dashboard/student',
    fields: ['Full Name', 'University', 'Course', 'Year'],
  },
  institute: {
    icon: Building2,
    label: 'Institute',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-400',
    redirectPath: '/dashboard/institute',
    fields: ['Institution Name', 'City', 'Accreditation ID'],
  },
  industry: {
    icon: Briefcase,
    label: 'Industry',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-400',
    redirectPath: '/dashboard/industry',
    fields: ['Company Name', 'Industry Sector', 'Company Size'],
  },
  government: {
    icon: Globe,
    label: 'Government',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-400',
    redirectPath: '/dashboard/government',
    fields: ['Department Name', 'Ministry', 'Officer ID'],
  },
  admin: {
    icon: Shield,
    label: 'Admin',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-400',
    redirectPath: '/dashboard/admin',
    fields: [],
  },
};

export default function Auth() {
  const { role = 'student' } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(config.redirectPath);
    }, 1200);
  };

  const colorMap: Record<string, { text: string; border: string; bg: string; ring: string }> = {
    blue: { text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', ring: 'focus:border-blue-500/50' },
    violet: { text: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/10', ring: 'focus:border-violet-500/50' },
    emerald: { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', ring: 'focus:border-emerald-500/50' },
    amber: { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', ring: 'focus:border-amber-500/50' },
    rose: { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', ring: 'focus:border-rose-500/50' },
  };
  const colorClass = colorMap[config.color] ?? colorMap.blue;

  return (
    <div className="min-h-screen bg-[#050a14] grid-bg flex items-center justify-center px-4">
      {/* Orbs */}
      <div className="fixed top-1/3 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="glass-bright rounded-2xl p-8 border border-[rgba(99,179,237,0.15)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-4`}>
              <Icon size={26} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 text-sm">
              {config.label} Portal — SkillSense AI
            </p>
          </div>

          {/* Role tabs */}
          <div className="grid grid-cols-5 gap-1 glass rounded-xl p-1 mb-6">
            {Object.entries(roleConfig).map(([r, c]) => (
              <button
                key={r}
                onClick={() => navigate(`/auth/${r}`)}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                  r === role ? `${colorClass.bg} ${colorClass.text}` : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && config.fields.map((field) => (
              <div key={field}>
                <label className="block text-xs text-slate-500 mb-1.5">{field}</label>
                <input
                  type="text"
                  placeholder={field}
                  className={`w-full bg-[#080f1e] border ${colorClass.border} rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none ${colorClass.ring} transition-colors`}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={`w-full bg-[#080f1e] border ${colorClass.border} rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none ${colorClass.ring} transition-colors`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full bg-[#080f1e] border ${colorClass.border} rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 outline-none ${colorClass.ring} transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${config.gradient} text-white font-semibold py-3 rounded-xl transition-all hover:opacity-90 hover:shadow-lg font-display flex items-center justify-center gap-2 mt-2`}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                isSignup ? 'Create Account' : `Sign In as ${config.label}`
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className={`text-sm ${colorClass.text} hover:underline`}
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Demo hint */}
          <div className="mt-4 glass rounded-xl p-3 text-center">
            <p className="text-xs text-slate-600">Demo: use any email & password to access the dashboard</p>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Brain size={11} className="text-white" />
            </div>
            <span className="font-display text-xs text-slate-600">SkillSense AI — Measuring Skills, Predicting Futures</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
