import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, LayoutDashboard, User, BarChart3, Briefcase, Settings, LogOut, Cpu, FileText, GitBranch, Target, TrendingUp, Building2, Globe, Shield } from 'lucide-react';

interface SidebarProps {
  role: 'student' | 'institute' | 'industry' | 'government' | 'admin';
}

const navConfigs = {
  student: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/student' },
    { icon: User, label: 'Skill Passport', path: '/dashboard/student/passport' },
    { icon: Cpu, label: 'AI Analyzer', path: '/dashboard/student/analyzer' },
    { icon: Target, label: 'Skill Gap', path: '/dashboard/student/gaps' },
    { icon: TrendingUp, label: 'Career Paths', path: '/dashboard/student/careers' },
    { icon: FileText, label: 'Resume Upload', path: '/dashboard/student/resume' },
    { icon: GitBranch, label: 'GitHub Link', path: '/dashboard/student/github' },
  ],
  institute: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/institute' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/institute/analytics' },
    { icon: User, label: 'Students', path: '/dashboard/institute/students' },
    { icon: TrendingUp, label: 'Placement Trends', path: '/dashboard/institute/placement' },
    { icon: Target, label: 'Curriculum Gaps', path: '/dashboard/institute/gaps' },
  ],
  industry: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/industry' },
    { icon: Briefcase, label: 'Talent Pool', path: '/dashboard/industry/talent' },
    { icon: BarChart3, label: 'Skill Trends', path: '/dashboard/industry/trends' },
    { icon: Target, label: 'Job Matching', path: '/dashboard/industry/matching' },
  ],
  government: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/government' },
    { icon: Globe, label: 'National Insights', path: '/dashboard/government/insights' },
    { icon: BarChart3, label: 'Workforce Data', path: '/dashboard/government/workforce' },
    { icon: TrendingUp, label: 'Forecasting', path: '/dashboard/government/forecast' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: Shield, label: 'Users', path: '/dashboard/admin/users' },
    { icon: Building2, label: 'Institutes', path: '/dashboard/admin/institutes' },
    { icon: Settings, label: 'Settings', path: '/dashboard/admin/settings' },
  ],
};

const roleColors = {
  student: 'from-blue-500 to-cyan-400',
  institute: 'from-violet-500 to-purple-400',
  industry: 'from-emerald-500 to-teal-400',
  government: 'from-amber-500 to-orange-400',
  admin: 'from-rose-500 to-pink-400',
};

const roleLabels = {
  student: 'Student Portal',
  institute: 'Institute Portal',
  industry: 'Industry Portal',
  government: 'Gov Portal',
  admin: 'Admin Portal',
};

export default function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const navItems = navConfigs[role];

  return (
    <div className="w-60 min-h-screen glass border-r border-[rgba(99,179,237,0.1)] flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-[rgba(99,179,237,0.1)]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleColors[role]} flex items-center justify-center`}>
            <Brain size={16} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white">SkillSense AI</div>
            <div className="text-xs text-slate-500">{roleLabels[role]}</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[rgba(99,179,237,0.1)]">
        <Link to="/">
          <div className="sidebar-item">
            <LogOut size={16} />
            Sign Out
          </div>
        </Link>
      </div>
    </div>
  );
}
