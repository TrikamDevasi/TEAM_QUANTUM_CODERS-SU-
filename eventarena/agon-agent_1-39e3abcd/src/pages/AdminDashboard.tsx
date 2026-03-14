import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, Users, Building2, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const activityData = [
  { day: 'Mon', logins: 1240, analyses: 890 },
  { day: 'Tue', logins: 1380, analyses: 1020 },
  { day: 'Wed', logins: 1560, analyses: 1180 },
  { day: 'Thu', logins: 1290, analyses: 950 },
  { day: 'Fri', logins: 1720, analyses: 1340 },
  { day: 'Sat', logins: 980, analyses: 720 },
  { day: 'Sun', logins: 760, analyses: 540 },
];

const recentUsers = [
  { name: 'Aryan Mehta', role: 'Student', institute: 'IIT Bombay', status: 'active', joined: '2h ago' },
  { name: 'Dr. Priya Sharma', role: 'Institute', institute: 'NIT Trichy', status: 'active', joined: '4h ago' },
  { name: 'Rajesh Kumar', role: 'Industry', institute: 'TechCorp India', status: 'pending', joined: '6h ago' },
  { name: 'Anita Singh', role: 'Government', institute: 'MoSDE', status: 'active', joined: '1d ago' },
  { name: 'Vikram Nair', role: 'Student', institute: 'BITS Pilani', status: 'active', joined: '1d ago' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-bright rounded-xl px-3 py-2 text-xs border border-rose-500/20">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" title="Admin Control Panel" subtitle="System overview and user management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: '48,291', icon: Users, color: 'rose', change: '+1.2K today' },
            { label: 'Institutes', value: '342', icon: Building2, color: 'blue', change: '+8 this week' },
            { label: 'AI Analyses Run', value: '2.4M', icon: Activity, color: 'violet', change: '+12K today' },
            { label: 'System Health', value: '99.8%', icon: Shield, color: 'emerald', change: 'All systems OK' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    stat.color === 'rose' ? 'bg-rose-500/15 text-rose-400' :
                    stat.color === 'blue' ? 'bg-blue-500/15 text-blue-400' :
                    stat.color === 'violet' ? 'bg-violet-500/15 text-violet-400' :
                    'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    <stat.icon size={17} />
                  </div>
                  <span className="text-xs text-emerald-400">{stat.change}</span>
                </div>
                <div className="font-display text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity Chart */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Weekly Platform Activity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={activityData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="logins" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Logins" />
              <Bar dataKey="analyses" fill="rgba(244,63,94,0.3)" radius={[4, 4, 0, 0]} name="AI Analyses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Users */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Recent User Registrations</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(99,179,237,0.1)]">
                  {['User', 'Role', 'Organization', 'Status', 'Joined'].map(h => (
                    <th key={h} className="text-left text-xs text-slate-500 py-2 pr-6 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, i) => (
                  <tr key={i} className="border-b border-[rgba(99,179,237,0.05)] hover:bg-rose-500/3 transition-colors">
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-6">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === 'Student' ? 'bg-blue-500/15 text-blue-400' :
                        user.role === 'Institute' ? 'bg-violet-500/15 text-violet-400' :
                        user.role === 'Industry' ? 'bg-emerald-500/15 text-emerald-400' :
                        'bg-amber-500/15 text-amber-400'
                      }`}>{user.role}</span>
                    </td>
                    <td className="py-3 pr-6 text-sm text-slate-400">{user.institute}</td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-1.5">
                        {user.status === 'active' ? (
                          <><CheckCircle2 size={12} className="text-emerald-400" /><span className="text-xs text-emerald-400">Active</span></>
                        ) : (
                          <><AlertCircle size={12} className="text-amber-400" /><span className="text-xs text-amber-400">Pending</span></>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-6 text-xs text-slate-500">{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Status */}
        <div className="stat-card">
          <h3 className="font-display text-sm font-semibold text-white mb-4">System Services</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { service: 'AI Analysis Engine', status: 'Operational', uptime: '99.9%' },
              { service: 'Authentication API', status: 'Operational', uptime: '100%' },
              { service: 'Database Cluster', status: 'Operational', uptime: '99.8%' },
              { service: 'Resume Parser', status: 'Operational', uptime: '99.7%' },
              { service: 'GitHub Analyzer', status: 'Operational', uptime: '99.5%' },
              { service: 'Notification Service', status: 'Degraded', uptime: '97.2%' },
            ].map((svc, i) => (
              <div key={i} className="flex items-center justify-between p-3 glass rounded-xl">
                <div>
                  <div className="text-sm text-white font-medium">{svc.service}</div>
                  <div className="text-xs text-slate-500">{svc.uptime} uptime</div>
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${
                  svc.status === 'Operational' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    svc.status === 'Operational' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`} />
                  {svc.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
