import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Globe, TrendingUp, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { govData } from '../lib/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-bright rounded-xl px-3 py-2 text-xs border border-amber-500/20">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

export default function GovernmentDashboard() {
  return (
    <DashboardLayout role="government" title="National Skill Intelligence" subtitle="Ministry of Skill Development — Workforce Analytics Platform">
      <div className="space-y-6">
        {/* National Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students Tracked', value: (govData.totalStudents / 1000000).toFixed(1) + 'M', icon: Users, color: 'amber', change: '+8.2%' },
            { label: 'Employment Rate', value: `${govData.employmentRate}%`, icon: TrendingUp, color: 'emerald', change: '+2.1%' },
            { label: 'Skill Gap Index', value: `${govData.skillGapIndex}%`, icon: AlertTriangle, color: 'rose', change: '-1.8%' },
            { label: 'States Covered', value: '28', icon: Globe, color: 'blue', change: '+3' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    stat.color === 'amber' ? 'bg-amber-500/15 text-amber-400' :
                    stat.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                    stat.color === 'rose' ? 'bg-rose-500/15 text-rose-400' :
                    'bg-blue-500/15 text-blue-400'
                  }`}>
                    <stat.icon size={17} />
                  </div>
                  <span className={`text-xs flex items-center gap-0.5 ${
                    stat.change.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    <ArrowUpRight size={11} />{stat.change}
                  </span>
                </div>
                <div className="font-display text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* State Performance */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">State-wise Employment & Skill Scores</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={govData.stateData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="state" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="employed" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Employment %" />
              <Bar dataKey="score" fill="rgba(245,158,11,0.3)" radius={[4, 4, 0, 0]} name="Skill Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Demand & Workforce Forecast */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="stat-card">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Sector Demand vs Supply (2024)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={govData.sectorDemand} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="sector" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demand" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Demand" />
                <Bar dataKey="supply" fill="rgba(245,158,11,0.25)" radius={[0, 4, 4, 0]} name="Supply" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="stat-card">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Workforce Demand Forecast (2025–2029)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={govData.forecastData}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
                <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="demand" stroke="#f59e0b" fill="url(#demandGrad)" strokeWidth={2} name="Demand (M)" />
                <Area type="monotone" dataKey="supply" stroke="#10b981" fill="url(#supplyGrad)" strokeWidth={2} name="Supply (M)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {[{ label: 'Demand', color: '#f59e0b' }, { label: 'Supply', color: '#10b981' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-xs text-slate-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Program Effectiveness */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Training Program Effectiveness</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(99,179,237,0.1)]">
                  {['Program', 'Enrolled', 'Completed', 'Employed %', 'Effectiveness'].map(h => (
                    <th key={h} className="text-left text-xs text-slate-500 py-2 pr-6 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {govData.programEffectiveness.map((prog, i) => (
                  <tr key={i} className="border-b border-[rgba(99,179,237,0.05)] hover:bg-amber-500/3 transition-colors">
                    <td className="py-3 pr-6 text-sm font-medium text-white">{prog.program}</td>
                    <td className="py-3 pr-6 text-sm text-slate-400">{(prog.enrolled / 1000).toFixed(0)}K</td>
                    <td className="py-3 pr-6 text-sm text-slate-400">{(prog.completed / 1000).toFixed(0)}K</td>
                    <td className="py-3 pr-6">
                      <span className={`text-sm font-semibold ${
                        prog.employed >= 70 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>{prog.employed}%</span>
                    </td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-[#0d1829] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                            style={{ width: `${prog.employed}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{prog.employed >= 70 ? 'Good' : 'Fair'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Demand Skills */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">National Top Demand Skills</h3>
          <div className="flex flex-wrap gap-3">
            {govData.topDemandSkills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-sm text-slate-300 font-medium">{skill}</span>
                <span className="text-xs text-amber-400 font-semibold">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
