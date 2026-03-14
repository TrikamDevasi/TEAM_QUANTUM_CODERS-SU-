import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-bright border-b border-[rgba(99,179,237,0.12)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">SkillSense <span className="gradient-text">AI</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How It Works</a>
          <a href="#impact" className="text-sm text-slate-400 hover:text-white transition-colors">Impact</a>
          <a href="#analytics" className="text-sm text-slate-400 hover:text-white transition-colors">Analytics</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="btn-ghost text-sm flex items-center gap-1.5"
            >
              Sign In <ChevronDown size={14} />
            </button>
            {loginOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-52 glass-bright rounded-xl overflow-hidden shadow-2xl"
              >
                {[
                  { label: 'Student Login', path: '/auth/student' },
                  { label: 'Institute Login', path: '/auth/institute' },
                  { label: 'Industry Login', path: '/auth/industry' },
                  { label: 'Government Login', path: '/auth/government' },
                  { label: 'Admin Login', path: '/auth/admin' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setLoginOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <button onClick={() => navigate('/auth/student')} className="btn-primary text-sm">
            Get Started
          </button>
        </div>

        <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass-bright border-t border-white/5 px-6 py-4 flex flex-col gap-3"
        >
          <a href="#features" className="text-sm text-slate-400">Features</a>
          <a href="#how-it-works" className="text-sm text-slate-400">How It Works</a>
          <button onClick={() => navigate('/auth/student')} className="btn-primary text-sm text-center">Get Started</button>
        </motion.div>
      )}
    </nav>
  );
}
