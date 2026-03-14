'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface AIStatus {
  success: boolean;
  data: {
    openai: { success: boolean; message: string };
    perplexity: { success: boolean; message: string };
  };
}

export default function AIHealthPage() {
  const [status, setStatus] = useState<AIStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const response = await axios.get(`${apiUrl}/ai-health`);
      setStatus(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            AI Service Health Check
          </h1>
          <p className="text-gray-400">Verify your OpenAI and Perplexity API connections</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OpenAI Card */}
          <div className="bg-[#161618] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                  ●
                </span>
                OpenAI
              </h2>
              {status?.data.openai.success ? (
                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Active</span>
              ) : (
                <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">Error</span>
              )}
            </div>
            
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Used for skill extraction, analysis summaries, and career matching recommendations.
            </p>

            <div className={`p-4 rounded-xl text-xs font-mono break-words ${status?.data.openai.success ? 'bg-green-500/5 text-green-300' : 'bg-red-500/5 text-red-300'}`}>
              {loading ? 'Testing...' : status?.data.openai.message || 'Waiting for status...'}
            </div>
          </div>

          {/* Perplexity Card */}
          <div className="bg-[#161618] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                  ✦
                </span>
                Perplexity
              </h2>
              {status?.data.perplexity.success ? (
                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Active</span>
              ) : (
                <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">Error</span>
              )}
            </div>

            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Used for real-time industry demand research and market trend analysis.
            </p>

            <div className={`p-4 rounded-xl text-xs font-mono break-words ${status?.data.perplexity.success ? 'bg-green-500/5 text-green-300' : 'bg-red-500/5 text-red-300'}`}>
              {loading ? 'Testing...' : status?.data.perplexity.message || 'Waiting for status...'}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <button 
            onClick={checkHealth}
            disabled={loading}
            className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Running Diagnostic...' : 'Re-Run Diagnostic'}
          </button>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="text-gray-500 text-xs text-center max-w-md">
            Note: Your API keys are stored securely on the backend. This tool tests connectivity between your server and the AI providers.
          </div>
        </div>
      </div>
    </div>
  );
}
