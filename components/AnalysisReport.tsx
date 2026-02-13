
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Download, BrainCircuit, Activity, CheckCircle2, AlertCircle, FileText, Share2, Loader2 } from 'lucide-react';
import { StegoResult, MetricData } from '../types';
import { generateAIAnalysis } from '../services/geminiService';

interface AnalysisReportProps {
  result: StegoResult;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  useEffect(() => {
    const fetchAI = async () => {
      setIsAnalysing(true);
      const summary = await generateAIAnalysis(result.report);
      setAiSummary(summary);
      setIsAnalysing(false);
    };
    fetchAI();
  }, [result.report]);

  const barData: MetricData[] = [
    { name: 'PSNR (dB)', value: result.report.psnr },
    { name: 'Accuracy (%)', value: result.report.accuracy },
    { name: 'Security Index', value: result.report.securityIndex },
  ];

  const psnrRating = result.report.psnr > 45 ? 'Exceptional' : result.report.psnr > 40 ? 'High' : 'Medium';
  const mseRating = result.report.mse < 0.1 ? 'Low' : 'Noticeable';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Kavach Security Report</h2>
          <p className="text-slate-400">Forensic analysis and integrity validation for <span className="text-sky-400 font-medium">{result.originalFileName}</span></p>
        </div>
        <div className="flex gap-3">
          <a 
            href={result.stegoImageUrl} 
            download={`stego_${result.originalFileName}`}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Download Stego
          </a>
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/20">
            <Share2 className="w-4 h-4" />
            Share Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <MetricCard 
          title="PSNR" 
          value={`${result.report.psnr.toFixed(2)} dB`} 
          desc="Peak Signal-to-Noise Ratio" 
          rating={psnrRating}
          icon={<Activity className="w-5 h-5 text-sky-400" />}
        />
        <MetricCard 
          title="MSE" 
          value={result.report.mse.toFixed(6)} 
          desc="Mean Squared Error" 
          rating={mseRating}
          icon={<BarChart3 className="w-5 h-5 text-indigo-400" />}
        />
        <MetricCard 
          title="Accuracy" 
          value={`${result.report.accuracy}%`} 
          desc="Bit Extraction Integrity" 
          rating="Perfect"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Comparison */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            Stego Object Review
          </h3>
          <div className="relative group">
            <img 
              src={result.stegoImageUrl} 
              alt="Stego Result" 
              className="rounded-xl border border-slate-800 w-full object-contain max-h-[400px] bg-slate-950"
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm">
              <p className="text-white text-sm font-medium">LSB Layer: Hidden bits active</p>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            AI-Driven Security Audit
          </h3>
          <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-24 h-24 text-purple-500" />
            </div>
            {/* Added Loader2 from lucide-react */}
            {isAnalysing ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                <p className="text-slate-500 animate-pulse font-medium">Synthesizing threat model...</p>
              </div>
            ) : (
              <div className="relative z-10">
                <p className="text-slate-300 leading-relaxed italic">
                  "{aiSummary}"
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Audit complete • Analysis engine Gemini-3-Pro
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
        <h3 className="text-lg font-bold mb-8">Statistical Distribution</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#0ea5e9' : index === 1 ? '#10b981' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; desc: string; rating: string; icon: React.ReactNode }> = ({ title, value, desc, rating, icon }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
        rating === 'Exceptional' || rating === 'Perfect' ? 'bg-emerald-500/10 text-emerald-400' : 
        rating === 'High' || rating === 'Low' ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'
      }`}>
        {rating}
      </span>
    </div>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-white mono">{value}</p>
      <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </div>
  </div>
);

const BarChart3 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h3"/>
  </svg>
);

export default AnalysisReport;
