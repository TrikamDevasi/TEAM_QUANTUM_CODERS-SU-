import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';
import { TrendingUp, Users, Award, Target, ArrowUpRight, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { instituteData } from '../lib/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-bright rounded-xl px-3 py-2 text-xs border border-violet-500/20">
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

export default function InstituteDashboard() {
  const placementRate = Math.round((instituteData.placedStudents / instituteData.totalStudents) * 100);

  return (
    <DashboardLayout role="institute" title="Institute Analytics" subtitle={`${instituteData.name} — Real-time skill intelligence`}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: instituteData.totalStudents.toLocaleString(), icon: Users, color: 'violet', change: '+12%' },
            { label: 'Placement Rate', value: `${placementRate}%`, icon: Award, color: 'emerald', change: '+4%' },
            { label: 'Avg Skill Score', value: `${instituteData.avgSkillScore}/100`, icon: Target, color: 'blue', change: '+3.2' },
            { label: 'Top Skill', value: instituteData.topSkill, icon: TrendingUp, color: 'amber', change: 'ML +18%' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    stat.color === 'violet' ? 'bg-violet-500/15 text-violet-400' :
                    stat.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                    stat.color === 'blue' ? 'bg-blue-500/15 text-blue-400' :
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

        {/* Skill Distribution & Placement Trends */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="stat-card">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Skill Distribution Across Students</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={instituteData.skillDistribution} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="skill" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="students" radius={[0, 4, 4, 0]} name="Students">
                  {instituteData.skillDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="stat-card">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Placement Trends (2020–2024)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={instituteData.placementTrends}>
                <defs>
                  <linearGradient id="placementGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
                <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" stroke="#8b5cf6" fill="url(#placementGrad)" strokeWidth={2.5} name="Placement %" />
                <Area type="monotone" dataKey="avgSalary" stroke="#06b6d4" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Avg Salary (LPA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Department Performance Heatmap</h3>
          <div className="grid grid-cols-5 gap-3">
            {instituteData.departmentPerformance.map((dept, i) => (
              <div key={i} className="text-center">
                <div
                  className="rounded-xl p-4 mb-2 transition-all hover:scale-105 cursor-pointer"
                  style={{
                    background: `rgba(139, 92, 246, ${dept.score / 150})`,
                    border: `1px solid rgba(139, 92, 246, ${dept.score / 200})`,
                  }}
                >
                  <div className="font-display text-2xl font-bold text-white">{dept.score}</div>
                  <div className="text-xs text-slate-400 mt-0.5">/100</div>
                </div>
                <div className="text-xs font-medium text-slate-300">{dept.dept}</div>
                <div className="text-xs text-slate-600">{dept.students} students</div>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum Gaps */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="font-display text-sm font-semibold text-white">Curriculum Gaps Identified by AI</h3>
          </div>
          <div className="space-y-3">
            {instituteData.curriculumGaps.map((gap, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm text-slate-300 w-40">{gap.area}</span>
                <div className="flex-1 h-2.5 bg-[#0d1829] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gap.gap}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${
                      gap.priority === 'Critical' ? 'bg-rose-500' :
                      gap.priority === 'High' ? 'bg-amber-500' :
                      gap.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-500'
                    }`}
                  />
                </div>
                <span className="text-xs text-slate-500 w-8">{gap.gap}%</span>
                <span className={`text-xs px-2 py-0.5 rounded-full w-16 text-center ${
                  gap.priority === 'Critical' ? 'bg-rose-500/15 text-rose-400' :
                  gap.priority === 'High' ? 'bg-amber-500/15 text-amber-400' :
                  gap.priority === 'Medium' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-slate-500/15 text-slate-400'
                }`}>{gap.priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Program ROI', value: '342%', desc: 'Return on educational investment', color: 'emerald' },
            { label: 'Employer Satisfaction', value: '91%', desc: 'Industry partner rating', color: 'blue' },
            { label: 'Alumni Salary Growth', value: '2.8x', desc: 'vs national average', color: 'violet' },
          ].map((metric, i) => (
            <div key={i} className="stat-card text-center">
              <div className={`font-display text-4xl font-bold mb-2 ${
                metric.color === 'emerald' ? 'text-emerald-400' :
                metric.color === 'blue' ? 'text-blue-400' : 'text-violet-400'
              }`}>{metric.value}</div>
              <div className="font-medium text-white text-sm">{metric.label}</div>
              <div className="text-xs text-slate-500 mt-1">{metric.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
