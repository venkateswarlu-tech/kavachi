
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, BarChart3, Upload, ArrowRight, Download, Terminal, Info, ChevronRight, Activity } from 'lucide-react';
import { AppTab, StegoResult } from './types';
import Encoder from './components/Encoder';
import Decoder from './components/Decoder';
import AnalysisReport from './components/AnalysisReport';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.ENCODER);
  const [lastResult, setLastResult] = useState<StegoResult | null>(null);

  const handleEncodingSuccess = (result: StegoResult) => {
    setLastResult(result);
    setActiveTab(AppTab.METRICS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
              <Shield className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">Project Kavach</h1>
              <p className="text-[10px] text-sky-400 font-medium tracking-widest uppercase opacity-70">Steganographic Defense System</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-800/40 p-1 rounded-xl border border-slate-700/50">
            <TabButton 
              active={activeTab === AppTab.ENCODER} 
              onClick={() => setActiveTab(AppTab.ENCODER)}
              icon={<Lock className="w-4 h-4" />}
              label="Stealth Encoder"
            />
            <TabButton 
              active={activeTab === AppTab.DECODER} 
              onClick={() => setActiveTab(AppTab.DECODER)}
              icon={<Eye className="w-4 h-4" />}
              label="Sentry Decoder"
            />
            <TabButton 
              active={activeTab === AppTab.METRICS} 
              onClick={() => setActiveTab(AppTab.METRICS)}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Metrics & AI"
              disabled={!lastResult}
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {activeTab === AppTab.ENCODER && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-sky-400">
                  <Info className="w-5 h-5" />
                  <h2 className="font-semibold uppercase text-xs tracking-wider">System Overview</h2>
                </div>
                <div className="space-y-4">
                  <Step icon={<div className="w-2 h-2 rounded-full bg-sky-500" />} title="Chitra-Gupta Logic" desc="Adaptive LSB pixel manipulation for high-fidelity carrier output." />
                  <Step icon={<div className="w-2 h-2 rounded-full bg-indigo-500" />} title="Fortress Layer" desc="AES-256 CTR mode encryption with ZLib compression for space efficiency." />
                  <Step icon={<div className="w-2 h-2 rounded-full bg-emerald-500" />} title="Sentry Verification" desc="Real-time PSNR/MSE metrics calculation for integrity assurance." />
                </div>
              </div>
              <div className="bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2 text-sky-400">
                  <Activity className="w-5 h-5" />
                  <h2 className="font-semibold uppercase text-xs tracking-wider">Live Diagnostics</h2>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Encryption Entropy: <span className="text-white mono">High</span><br/>
                  Detection Threshold: <span className="text-white mono">Below 0.02%</span><br/>
                  Carrier Integrity: <span className="text-white mono">Target 45dB+</span>
                </p>
              </div>
            </div>
            <div className="lg:col-span-8">
              <Encoder onEncodingSuccess={handleEncodingSuccess} />
            </div>
          </div>
        )}

        {activeTab === AppTab.DECODER && (
          <div className="max-w-3xl mx-auto">
            <Decoder />
          </div>
        )}

        {activeTab === AppTab.METRICS && lastResult && (
          <AnalysisReport result={lastResult} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50 text-xs">
            <Terminal className="w-4 h-4" />
            <span className="mono">KAVACH_v1.0.4_STABLE</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
            Built for National Cybersecurity Hackathon • 2024
          </div>
        </div>
      </footer>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; disabled?: boolean }> = ({ active, onClick, icon, label, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      disabled ? 'opacity-30 cursor-not-allowed' :
      active 
        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const Step: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

export default App;
