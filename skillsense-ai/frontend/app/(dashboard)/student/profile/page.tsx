'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
    User, 
    Mail, 
    MapPin, 
    Briefcase, 
    Camera, 
    Save, 
    Clock, 
    Award, 
    TrendingUp,
    X
} from 'lucide-react';

export default function ProfilePage() {
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState('');
  const [stats, setStats] = useState({
    assessments: 0,
    topScore: 0,
    latestPrediction: 'Software Engineer'
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: (user as any).bio || '',
        location: (user as any).location || '',
        skills: (user as any).skills || []
      });
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const [assessmentRes, careerRes] = await Promise.all([
        api.get('/assessments/history'),
        api.get('/ai/history') // Assuming this returns career history or similar
      ]);
      
      if (assessmentRes.data.success) {
        const history = assessmentRes.data.data;
        setStats(prev => ({
          ...prev,
          assessments: history.length,
          topScore: history.length > 0 ? Math.max(...history.map((h: any) => h.score)) : 0
        }));
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/profile/update', profileData);
      if (data.success) {
        toast.success(data.message || 'Profile updated successfully!');
        await checkAuth(); // Refresh user in store
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const uploadToast = toast.loading('Uploading avatar...');
    try {
      const { data } = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        toast.success('Avatar updated!', { id: uploadToast });
        await checkAuth();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: uploadToast });
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const newSkills = skillInput.split(',').map(s => s.trim()).filter(s => s && !profileData.skills.includes(s));
    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, ...newSkills]
    }));
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400">Manage your skill passport and personal information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-500/30">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.name} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <User size={48} className="text-slate-600" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg">
                <Camera size={18} className="text-white" />
                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
              </label>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-slate-400 text-sm mb-4 capitalize">{user.role}</p>
            
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-2 border-t border-slate-800 mt-4">
              <Clock size={14} />
              <span>
                Last active: {user.createdAt ? 'Recently' : 'Unknown'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Skill Summary</h3>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Assessments Taken</p>
                <p className="text-lg font-bold text-white">{stats.assessments}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Highest Score</p>
                <p className="text-lg font-bold text-white">{stats.topScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Email (Read-only)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                    <input 
                      type="email" 
                      value={user.email} 
                      disabled
                      className="w-full bg-slate-900/50 border border-slate-800/50 rounded-xl py-2.5 pl-10 pr-4 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Job Role/Target</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Bio</label>
                <textarea 
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Skills</label>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-4 bg-slate-950/30 border border-slate-800 rounded-xl">
                  {profileData.skills.length === 0 && (
                    <span className="text-slate-600 text-sm">No skills added yet.</span>
                  )}
                  {profileData.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg text-sm border border-indigo-500/20 shadow-sm transition-all hover:border-indigo-500/40"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeSkill(skill)}
                        className="hover:text-pink-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm"
                    placeholder="Add skills (comma-separated)..."
                  />
                  <button 
                    type="button" 
                    onClick={addSkill}
                    className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-800/20 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
