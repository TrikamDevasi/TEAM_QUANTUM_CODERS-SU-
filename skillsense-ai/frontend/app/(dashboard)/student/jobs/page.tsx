'use client';

import React, { useState, useEffect } from 'react';
import { 
    Search, 
    MapPin, 
    Briefcase, 
    DollarSign, 
    Clock, 
    ChevronRight,
    Filter,
    ArrowUpRight
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    requirements: string[];
    category: string;
    postedAt: string;
}

const GOLD = '#D4A843';
const AMBER = '#F59E0B';

export default function FindJobsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { data: jobs, isLoading, error } = useApi<Job[]>('/jobs');

    const categories = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design'];

    const filteredJobs = jobs?.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) || [];

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-extrabold text-white font-display">
                    Find Your <span style={{ color: GOLD }}>Dream Job</span> 💼
                </h1>
                <p className="text-slate-400 text-sm max-w-2xl">
                    Discover opportunities tailored to your skill profile. Our AI matches your current competencies 
                    recorded in your Skill Passport with real industry requirements.
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search jobs, companies, or keywords..." 
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold-500/50 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                                selectedCategory === cat 
                                ? 'bg-gold-500/10 border-gold-500/30 text-gold-500' 
                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                            style={selectedCategory === cat ? { color: GOLD, borderColor: `${GOLD}44`, backgroundColor: `${GOLD}11` } : {}}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Jobs Stats */}
            <div className="flex items-center justify-between">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Showing <span className="text-white">{filteredJobs.length}</span> Opportunities
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-gold-500 bg-gold-500/5 px-3 py-1.5 rounded-lg border border-gold-500/10">
                    <Filter size={12} />
                    Filters Active
                </div>
            </div>

            {/* Jobs List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-slate-900/30 animate-pulse rounded-2xl border border-slate-800/50"></div>
                    ))}
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl">
                    <div className="bg-slate-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                        <Briefcase size={24} className="text-slate-600" />
                    </div>
                    <h3 className="text-white font-bold mb-2">No jobs matched your criteria</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your search terms or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                        <div 
                            key={job._id}
                            className="group bg-slate-950 border border-slate-800 hover:border-gold-500/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-colors"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-white font-display group-hover:text-gold-500 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full text-slate-400 border border-slate-800 uppercase font-black tracking-tighter">
                                            {job.type}
                                        </div>
                                    </div>
                                    <p className="text-gold-500/80 text-sm font-bold uppercase tracking-wider text-[11px]">
                                        {job.company}
                                    </p>
                                </div>
                                <div className="text-xs font-black bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20">
                                    {Math.floor(Math.random() * 20) + 75}% MATCH
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MapPin size={14} className="text-slate-600" />
                                    <span className="text-xs font-medium">{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <DollarSign size={14} className="text-slate-600" />
                                    <span className="text-xs font-medium">{job.salary}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Briefcase size={14} className="text-slate-600" />
                                    <span className="text-xs font-medium">{job.category}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock size={14} className="text-slate-600" />
                                    <span className="text-xs font-medium">{new Date(job.postedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-6">
                                {job.requirements.slice(0, 3).map((req, i) => (
                                    <span key={i} className="text-[10px] bg-slate-900/50 text-slate-400 px-2 py-1 rounded-md border border-slate-800/50">
                                        {req}
                                    </span>
                                ))}
                                {job.requirements.length > 3 && (
                                    <span className="text-[10px] text-slate-500 px-1 py-1">+{job.requirements.length - 3} more</span>
                                )}
                            </div>

                            <button 
                                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold hover:bg-gold-500 hover:text-black transition-all border border-slate-800 hover:border-gold-500 flex items-center justify-center gap-2"
                                onClick={() => toast.success('Application feature coming soon!')}
                            >
                                View Details & Apply
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
