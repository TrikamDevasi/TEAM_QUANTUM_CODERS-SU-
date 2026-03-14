import Sidebar from './Sidebar';

interface Props {
  role: 'student' | 'institute' | 'industry' | 'government' | 'admin';
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ role, children, title, subtitle }: Props) {
  return (
    <div className="flex min-h-screen bg-[#050a14]">
      <Sidebar role={role} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
