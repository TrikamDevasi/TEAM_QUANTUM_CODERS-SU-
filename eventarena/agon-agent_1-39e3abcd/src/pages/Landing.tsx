import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Brain, Zap, BarChart3, Shield, Target, TrendingUp, Users, Building2, Globe,
  ArrowRight, CheckCircle2, Cpu, FileSearch, Layers, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const FadeIn = ({ children, delay = 0, className = '' }: any) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const features = [
  { icon: Cpu, title: 'AI Skill Analyzer', desc: 'Deep analysis of resumes, GitHub repos, and projects using advanced AI to extract real competencies.', color: 'blue', gradient: 'from-blue-500/20 to-cyan-500/10' },
  { icon: BarChart3, title: 'Skill Score Dashboard', desc: 'Multi-dimensional skill scoring across technical, soft, and domain-specific competencies.', color: 'violet', gradient: 'from-violet-500/20 to-purple-500/10' },
  { icon: Target, title: 'Gap Analysis Engine', desc: 'Identifies missing skills for target roles and generates personalized learning roadmaps.', color: 'emerald', gradient: 'from-emerald-500/20 to-teal-500/10' },
  { icon: TrendingUp, title: 'Career Prediction', desc: 'Predicts best-fit career paths with salary benchmarks and growth forecasts.', color: 'amber', gradient: 'from-amber-500/20 to-orange-500/10' },
  { icon: Shield, title: 'Skill Passport', desc: 'Portable, verifiable digital credential that travels with students throughout their career.', color: 'cyan', gradient: 'from-cyan-500/20 to-blue-500/10' },
  { icon: Globe, title: 'Policy Intelligence', desc: 'National workforce analytics for governments to make data-driven training investments.', color: 'rose', gradient: 'from-rose-500/20 to-pink-500/10' },
];

const steps = [
  { num: '01', title: 'Student Uploads Data', desc: 'Resume, GitHub profile, projects, and certifications are submitted through the secure portal.', icon: FileSearch },
  { num: '02', title: 'AI Analyzes Skills', desc: 'Our engine extracts and scores 50+ competencies across technical, soft, and domain skills.', icon: Brain },
  { num: '03', title: 'Score & Insights Generated', desc: 'Personalized skill passport, job readiness score, and gap analysis are generated instantly.', icon: Zap },
  { num: '04', title: 'Dashboards Update', desc: 'Institutes, industry, and government dashboards receive real-time aggregated analytics.', icon: BarChart3 },
];

const impacts = [
  {
    role: 'Students',
    icon: Users,
    color: 'blue',
    bg: 'from-blue-500/15 to-blue-500/5',
    border: 'border-blue-500/20',
    points: ['Know your real skill level', 'Get personalized career roadmaps', 'Portable verified Skill Passport', 'AI-powered job matching'],
  },
  {
    role: 'Institutes',
    icon: Building2,
    color: 'violet',
    bg: 'from-violet-500/15 to-violet-500/5',
    border: 'border-violet-500/20',
    points: ['Track student outcomes at scale', 'Identify curriculum gaps', 'Boost placement rates', 'Prove program ROI to stakeholders'],
  },
  {
    role: 'Industry',
    icon: Layers,
    color: 'emerald',
    bg: 'from-emerald-500/15 to-emerald-500/5',
    border: 'border-emerald-500/20',
    points: ['Access verified skill pools', 'AI-powered candidate matching', 'Forecast talent supply gaps', 'Reduce hiring time by 60%'],
  },
  {
    role: 'Government',
    icon: Globe,
    color: 'amber',
    bg: 'from-amber-500/15 to-amber-500/5',
    border: 'border-amber-500/20',
    points: ['National skill intelligence', 'Policy impact measurement', 'Training program effectiveness', 'Workforce demand forecasting'],
  },
];

const stats = [
  { value: '2.4M+', label: 'Students Assessed' },
  { value: '94%', label: 'Prediction Accuracy' },
  { value: '340+', label: 'Partner Institutes' },
  { value: '60%', label: 'Faster Hiring' },
];

const dashboardLinks = [
  { label: 'Student Dashboard', path: '/dashboard/student', desc: 'Skill passport, AI analysis, career paths', icon: '🎓', color: 'blue' },
  { label: 'Institute Dashboard', path: '/dashboard/institute', desc: 'Analytics, placement trends, curriculum gaps', icon: '🏛️', color: 'violet' },
  { label: 'Industry Dashboard', path: '/dashboard/industry', desc: 'Talent pool, skill matching, market trends', icon: '🏢', color: 'emerald' },
  { label: 'Government Dashboard', path: '/dashboard/government', desc: 'National insights, workforce forecasting', icon: '🌐', color: 'amber' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050a14] grid-bg overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-cyan-400 border border-cyan-500/20 mb-8"
          >
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            AI-Powered Skill Intelligence Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          >
            Measuring Skills,
            <br />
            <span className="gradient-text">Predicting Futures</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SkillSense AI goes beyond certificates to measure real-world competencies,
            predict employability, and provide intelligence to institutions, industry, and government.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <button onClick={() => navigate('/auth/student')} className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
              Start Free Assessment <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/dashboard/student')} className="btn-ghost flex items-center gap-2 text-base px-8 py-3.5">
              View Demo Dashboard <ChevronRight size={18} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="text-xs text-slate-500">Scroll to explore</div>
          <div className="w-px h-12 bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6" id="problem">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-rose-400 border border-rose-500/20 mb-6">
              The Problem
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Certificates Don't Tell the
              <span className="gradient-text-gold"> Whole Story</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              The global skills gap costs economies $8.5 trillion annually. Traditional credentials
              fail to capture real competencies employers need.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { stat: '68%', desc: 'of graduates are underemployed despite having degrees', color: 'rose' },
              { stat: '82%', desc: 'of employers say certificates don\'t reflect actual job readiness', color: 'amber' },
              { stat: '$8.5T', desc: 'annual economic loss from the global skills mismatch crisis', color: 'orange' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="stat-card text-center">
                  <div className={`font-display text-5xl font-bold mb-3 ${item.color === 'rose' ? 'text-rose-400' : item.color === 'amber' ? 'text-amber-400' : 'text-orange-400'}`}>
                    {item.stat}
                  </div>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 px-6 relative" id="solution">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/3 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-cyan-400 border border-cyan-500/20 mb-6">
              The Solution
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              AI-Powered Outcome
              <span className="gradient-text"> Measurement</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              SkillSense AI analyzes what students actually know and can do — not just what
              they claim. Real data. Real insights. Real outcomes.
            </p>
          </FadeIn>

          <div className="glass rounded-2xl p-8 border border-blue-500/15">
            <div className="grid md:grid-cols-5 gap-4 items-center text-center">
              {[
                { label: 'Student Data', icon: '📄', sub: 'Resume + GitHub + Projects' },
                { label: '', icon: '→', sub: '' },
                { label: 'AI Analysis', icon: '🧠', sub: '50+ skill dimensions' },
                { label: '', icon: '→', sub: '' },
                { label: 'Smart Insights', icon: '📊', sub: 'Dashboards + Predictions' },
              ].map((item, i) => (
                <div key={i} className={item.icon === '→' ? 'text-blue-400 text-2xl font-bold' : ''}>
                  {item.icon === '→' ? (
                    <span className="hidden md:block">{item.icon}</span>
                  ) : (
                    <div className="glass rounded-xl p-5">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="font-display text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.sub}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-violet-400 border border-violet-500/20 mb-6">
              Platform Features
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to
              <span className="gradient-text"> Measure What Matters</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`stat-card bg-gradient-to-br ${f.gradient} group cursor-pointer`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    f.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    f.color === 'violet' ? 'bg-violet-500/20 text-violet-400' :
                    f.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                    f.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                    f.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 relative" id="how-it-works">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/3 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/20 mb-6">
              How It Works
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              From Raw Data to
              <span className="gradient-text"> Actionable Intelligence</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="stat-card text-center">
                  <div className="font-display text-4xl font-bold text-blue-500/20 mb-3">{step.num}</div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mx-auto mb-4">
                    <step.icon size={20} className="text-blue-400" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-24 px-6" id="impact">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-amber-400 border border-amber-500/20 mb-6">
              Impact
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Built for Every
              <span className="gradient-text"> Stakeholder</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              SkillSense AI creates value across the entire education-to-employment ecosystem.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {impacts.map((impact, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`stat-card bg-gradient-to-br ${impact.bg} border ${impact.border}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      impact.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      impact.color === 'violet' ? 'bg-violet-500/20 text-violet-400' :
                      impact.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      <impact.icon size={20} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">For {impact.role}</h3>
                  </div>
                  <div className="space-y-2.5">
                    {impact.points.map((p, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <CheckCircle2 size={14} className={`flex-shrink-0 ${
                          impact.color === 'blue' ? 'text-blue-400' :
                          impact.color === 'violet' ? 'text-violet-400' :
                          impact.color === 'emerald' ? 'text-emerald-400' :
                          'text-amber-400'
                        }`} />
                        <span className="text-slate-300 text-sm">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 px-6" id="analytics">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Explore the
              <span className="gradient-text"> Dashboards</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Role-specific analytics for every stakeholder in the ecosystem.</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardLinks.map((d, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <button
                  onClick={() => navigate(d.path)}
                  className="w-full stat-card text-left group cursor-pointer"
                >
                  <div className="text-3xl mb-3">{d.icon}</div>
                  <h3 className="font-display text-sm font-bold text-white mb-1.5">{d.label}</h3>
                  <p className="text-slate-500 text-xs mb-4">{d.desc}</p>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    d.color === 'blue' ? 'text-blue-400' : d.color === 'violet' ? 'text-violet-400' : d.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    Explore <ArrowRight size={12} />
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Smart <span className="gradient-text">Data Architecture</span>
            </h2>
            <p className="text-slate-400 text-sm">Secure, scalable, and privacy-first by design</p>
          </FadeIn>
          <FadeIn>
            <div className="glass rounded-2xl p-8 border border-blue-500/10">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { label: 'Student Data', icon: '👤', color: 'blue' },
                  { label: '→', icon: '', color: '' },
                  { label: 'Secure Storage', icon: '🔒', color: 'violet' },
                  { label: '→', icon: '', color: '' },
                  { label: 'AI Analytics', icon: '🧠', color: 'cyan' },
                  { label: '→', icon: '', color: '' },
                  { label: 'Insights API', icon: '⚡', color: 'emerald' },
                  { label: '→', icon: '', color: '' },
                  { label: 'Dashboards', icon: '📊', color: 'amber' },
                ].map((item, i) => (
                  item.label === '→' ? (
                    <span key={i} className="text-blue-500/40 text-xl font-bold hidden md:block">→</span>
                  ) : (
                    <div key={i} className="glass rounded-xl px-4 py-3 text-center min-w-[110px]">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs text-slate-300 font-medium">{item.label}</div>
                    </div>
                  )
                ))}
              </div>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {[
                  { title: 'JWT Authentication', desc: 'Role-based access control for all user types' },
                  { title: 'End-to-End Encryption', desc: 'All student data encrypted at rest and in transit' },
                  { title: 'GDPR Compliant', desc: 'Full data privacy controls and right to deletion' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl">
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-white">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="glass-bright rounded-3xl p-12 text-center border border-blue-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-cyan-500/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-6">
                  <Brain size={32} className="text-white" />
                </div>
                <h2 className="font-display text-4xl font-bold text-white mb-4">
                  Ready to Measure What
                  <span className="gradient-text"> Actually Matters?</span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                  Join 340+ institutes and 2.4M+ students already using SkillSense AI
                  to bridge the skills gap.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button onClick={() => navigate('/auth/student')} className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
                    Start Free <ArrowRight size={18} />
                  </button>
                  <button onClick={() => navigate('/auth/institute')} className="btn-ghost flex items-center gap-2 text-base px-8 py-3.5">
                    Institute Demo
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(99,179,237,0.1)] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm text-white">SkillSense AI</span>
          </div>
          <p className="text-slate-600 text-xs">© 2025 SkillSense AI. Measuring Skills, Predicting Futures.</p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
