import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar
} from 'recharts';
import { Cpu, TrendingUp, Target, ArrowUpRight, Zap, CheckCircle2, AlertCircle, Star, Download } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { studentData } from '../lib/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-bright rounded-xl px-3 py-2 text-xs border border-blue-500/20">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">{p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'passport' | 'analyzer' | 'gaps' | 'careers'>('overview');

  return (
    <DashboardLayout role="student" title="Student Dashboard" subtitle={`Welcome back, ${studentData.name}`}>
      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'passport', label: 'Skill Passport' },
          { key: 'analyzer', label: 'AI Analyzer' },
          { key: 'gaps', label: 'Skill Gap' },
          { key: 'careers', label: 'Career Paths' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all font-display ${
              activeTab === tab.key
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'passport' && <PassportTab />}
      {activeTab === 'analyzer' && <AnalyzerTab />}
      {activeTab === 'gaps' && <GapsTab />}
      {activeTab === 'careers' && <CareersTab />}
    </DashboardLayout>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Skill Score', value: `${studentData.overallSkillScore}%`, icon: Star, color: 'blue', change: '+4.2%' },
          { label: 'Job Readiness', value: `${studentData.jobReadinessScore}%`, icon: Target, color: 'emerald', change: '+2.8%' },
          { label: 'Skills Assessed', value: '28', icon: Zap, color: 'violet', change: '+5' },
          { label: 'Career Matches', value: '4', icon: TrendingUp, color: 'amber', change: 'New: 1' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-500/15 text-blue-400' :
                  stat.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                  stat.color === 'violet' ? 'bg-violet-500/15 text-violet-400' :
                  'bg-amber-500/15 text-amber-400'
                }`}>
                  <stat.icon size={17} />
                </div>
                <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight size={11} />{stat.change}
                </span>
              </div>
              <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={studentData.radarData}>
              <PolarGrid stroke="rgba(99,179,237,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Skill Score Progress</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={studentData.progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6, fill: '#06b6d4' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <Cpu size={14} className="text-violet-400" />
          </div>
          <h3 className="font-display text-sm font-semibold text-white">AI Insights</h3>
          <span className="ml-auto text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">Gemini AI</span>
        </div>
        <div className="space-y-3">
          {studentData.aiInsights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-violet-400 text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-slate-300 text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PassportTab() {
  return (
    <div className="space-y-6">
      {/* Passport Card */}
      <div className="glass-bright rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-display font-bold text-2xl">
                {studentData.avatar}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-white">{studentData.name}</h2>
                <p className="text-slate-400 text-sm">{studentData.university}</p>
                <p className="text-slate-500 text-xs">{studentData.course} • {studentData.year}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Skill Score</div>
              <div className="font-display text-3xl font-bold gradient-text">{studentData.overallSkillScore}</div>
              <div className="text-xs text-slate-500">/100</div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {studentData.badges.map((badge, i) => (
              <span key={i} className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
                {badge.icon} {badge.name}
              </span>
            ))}
          </div>

          {/* Skill bars */}
          <div className="grid md:grid-cols-2 gap-4">
            {studentData.skills.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{s.skill}</span>
                  <span className="text-white font-semibold">{s.score}%</span>
                </div>
                <div className="h-2 bg-[#0d1829] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.score}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Download */}
          <button className="mt-6 btn-primary flex items-center gap-2 text-sm">
            <Download size={15} /> Download Skill Passport PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyzerTab() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Upload Resume', icon: '📄', desc: 'PDF or Word document', accept: '.pdf,.doc,.docx' },
          { label: 'Upload Project', icon: '📁', desc: 'ZIP file or GitHub URL', accept: '.zip' },
          { label: 'Link GitHub', icon: '🐙', desc: 'github.com/username', accept: '' },
        ].map((item, i) => (
          <div key={i} className="stat-card text-center cursor-pointer hover:border-blue-500/30 transition-all">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-display text-sm font-semibold text-white mb-1">{item.label}</h3>
            <p className="text-slate-500 text-xs mb-4">{item.desc}</p>
            <div className="h-1 w-12 bg-blue-500/20 rounded-full mx-auto" />
          </div>
        ))}
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} className="text-blue-400" />
          <h3 className="font-display text-sm font-semibold text-white">AI Skill Analyzer</h3>
          <span className="ml-auto text-xs text-cyan-400">Powered by Gemini AI</span>
        </div>
        <p className="text-slate-400 text-sm mb-5">
          Our AI analyzes your resume, GitHub repositories, and projects to extract real skills
          and generate a comprehensive competency score across 50+ dimensions.
        </p>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {analyzing ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
          ) : (
            <><Cpu size={15} /> Run AI Analysis</>
          )}
        </button>
      </div>

      {analyzed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="stat-card border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <h3 className="font-display text-sm font-semibold text-white">Analysis Complete</h3>
              <span className="ml-auto text-xs text-emerald-400">Just now</span>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { label: 'Problem Solving', score: 85, color: '#3b82f6' },
                { label: 'Technical Skills', score: 88, color: '#06b6d4' },
                { label: 'Communication', score: 72, color: '#8b5cf6' },
                { label: 'Project Experience', score: 79, color: '#10b981' },
                { label: 'Industry Readiness', score: 74, color: '#f59e0b' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(99,179,237,0.1)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15" fill="none"
                        stroke={item.color} strokeWidth="3"
                        strokeDasharray={`${item.score * 0.942} 94.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-white">{item.score}</span>
                  </div>
                  <p className="text-xs text-slate-500 text-center">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="stat-card">
            <h3 className="font-display text-sm font-semibold text-white mb-3">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'Git', 'REST APIs', 'TailwindCSS', 'Docker (basic)', 'SQL', 'Machine Learning', 'Data Structures'].map(skill => (
                <span key={skill} className="text-xs px-3 py-1.5 glass rounded-full text-slate-300 border border-blue-500/15">{skill}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function GapsTab() {
  return (
    <div className="space-y-6">
      <div className="stat-card">
        <h3 className="font-display text-sm font-semibold text-white mb-2">Skill Gap Analysis</h3>
        <p className="text-slate-400 text-xs mb-5">Skills you need to acquire for your target role: Full Stack Developer</p>
        <div className="space-y-3">
          {studentData.skillGaps.map((gap, i) => (
            <div key={i} className="flex items-center justify-between p-3 glass rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle size={15} className={`${
                  gap.priority === 'High' ? 'text-rose-400' :
                  gap.priority === 'Medium' ? 'text-amber-400' : 'text-slate-500'
                }`} />
                <span className="text-slate-300 text-sm">{gap.skill}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  gap.priority === 'High' ? 'bg-rose-500/15 text-rose-400' :
                  gap.priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-slate-500/15 text-slate-400'
                }`}>{gap.priority}</span>
                <span className="text-xs text-slate-500">{gap.timeToLearn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-card">
        <h3 className="font-display text-sm font-semibold text-white mb-4">Skill Scores vs Industry Benchmark</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={[
            { skill: 'React', you: 90, benchmark: 75 },
            { skill: 'Node.js', you: 82, benchmark: 70 },
            { skill: 'AWS', you: 45, benchmark: 72 },
            { skill: 'Docker', you: 38, benchmark: 65 },
            { skill: 'System Design', you: 55, benchmark: 70 },
            { skill: 'SQL', you: 78, benchmark: 68 },
          ]} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
            <XAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="you" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Your Score" />
            <Bar dataKey="benchmark" fill="rgba(99,179,237,0.2)" radius={[4, 4, 0, 0]} name="Industry Benchmark" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CareersTab() {
  return (
    <div className="space-y-6">
      <div className="stat-card">
        <h3 className="font-display text-sm font-semibold text-white mb-2">AI Career Recommendations</h3>
        <p className="text-slate-400 text-xs mb-5">Based on your skill profile, here are your best-fit career paths</p>
        <div className="space-y-3">
          {studentData.careerPaths.map((career, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 glass rounded-xl hover:border-blue-500/20 border border-transparent transition-all cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-sm font-semibold text-white">{career.role}</span>
                  {i === 0 && <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">Best Match</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{career.salary}</span>
                  <span>Demand: {career.demand}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl font-bold text-blue-400">{career.match}%</div>
                <div className="text-xs text-slate-500">match</div>
              </div>
              <div className="w-24">
                <div className="h-2 bg-[#0d1829] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${career.match}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
