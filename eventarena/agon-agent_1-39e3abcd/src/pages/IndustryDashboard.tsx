import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Search, Briefcase, TrendingUp, Users, Star, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { industryData } from '../lib/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-bright rounded-xl px-3 py-2 text-xs border border-emerald-500/20">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function IndustryDashboard() {
  const [search, setSearch] = useState('');


  const filtered = industryData.topCandidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="industry" title="Industry Intelligence" subtitle={`${industryData.company} — Talent & Market Analytics`}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Open Roles', value: industryData.openRoles, icon: Briefcase, color: 'emerald', change: '+8' },
            { label: 'Matched Candidates', value: industryData.matchedCandidates, icon: Users, color: 'blue', change: '+24' },
            { label: 'Avg Match Score', value: `${industryData.avgMatchScore}%`, icon: Star, color: 'violet', change: '+2.1%' },
            { label: 'Skill Demand Index', value: '8.4/10', icon: TrendingUp, color: 'amber', change: 'Rising' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    stat.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                    stat.color === 'blue' ? 'bg-blue-500/15 text-blue-400' :
                    stat.color === 'violet' ? 'bg-violet-500/15 text-violet-400' :
                    'bg-amber-500/15 text-amber-400'
                  }`}>
                    <stat.icon size={17} />
                  </div>
                  <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                    <ArrowUpRight size={11} />{stat.change}
                  </span>
                </div>
                <div className="font-display text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill Demand vs Supply */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Skill Demand vs Supply Gap Analysis</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={industryData.skillDemand} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="demand" fill="#10b981" radius={[4, 4, 0, 0]} name="Demand" />
              <Bar dataKey="supply" fill="rgba(16,185,129,0.25)" radius={[4, 4, 0, 0]} name="Supply" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Market Trends + Talent Pool */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="stat-card">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Market Skill Trends (2024)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={industryData.marketTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ai" stroke="#8b5cf6" strokeWidth={2} dot={false} name="AI/ML" />
                <Line type="monotone" dataKey="cloud" stroke="#06b6d4" strokeWidth={2} dot={false} name="Cloud" />
                <Line type="monotone" dataKey="web" stroke="#10b981" strokeWidth={2} dot={false} name="Web Dev" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              {[{ label: 'AI/ML', color: '#8b5cf6' }, { label: 'Cloud', color: '#06b6d4' }, { label: 'Web Dev', color: '#10b981' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-xs text-slate-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stat-card">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Top Matched Candidates</h3>
            <div className="mb-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search candidates..."
                  className="w-full bg-[#080f1e] border border-[rgba(99,179,237,0.12)] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500/40 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              {filtered.map((candidate, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 glass rounded-xl hover:border-emerald-500/20 border border-transparent transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold font-display">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-white truncate">{candidate.name}</div>
                    <div className="text-xs text-slate-500 truncate">{candidate.university} • {candidate.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-bold text-emerald-400">{candidate.score}%</div>
                    <div className="text-xs text-slate-600">match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Post Job */}
        <div className="stat-card border border-emerald-500/15">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Post Job Requirements</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Job Title</label>
              <input placeholder="e.g. Senior React Developer" className="w-full bg-[#080f1e] border border-[rgba(99,179,237,0.12)] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Required Skills</label>
              <input placeholder="React, TypeScript, Node.js..." className="w-full bg-[#080f1e] border border-[rgba(99,179,237,0.12)] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Min. Skill Score</label>
              <input placeholder="e.g. 75" className="w-full bg-[#080f1e] border border-[rgba(99,179,237,0.12)] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none" />
            </div>
          </div>
          <button className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:opacity-90 transition-all font-display">
            Post & Find Matches with AI
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
