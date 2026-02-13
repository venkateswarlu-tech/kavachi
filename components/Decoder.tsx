
import React, { useState, useRef } from 'react';
import { Eye, Unlock, ShieldAlert, Loader2, Download, Copy, Check, FileCode } from 'lucide-react';
import { decryptAndDecompress } from '../services/cryptoService';
import { extractDataFromImage } from '../services/steganographyService';

const Decoder: React.FC = () => {
  const [stegoFile, setStegoFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStegoFile(file);
      setExtractedData(null);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!stegoFile || !password) return;

    setIsProcessing(true);
    setError(null);
    try {
      // Step 1: Sentry Extraction (Bits from Pixels)
      const encryptedBlob = await extractDataFromImage(stegoFile);
      
      // Step 2: Fortress Decryption
      const decrypted = decryptAndDecompress(encryptedBlob, password);
      
      setExtractedData(decrypted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (extractedData) {
      navigator.clipboard.writeText(extractedData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Eye className="w-7 h-7 text-emerald-500" />
          Sentry Extraction Engine
        </h2>
        <p className="text-slate-400 mt-2">Scan stego-objects to reveal hidden payloads and verify cryptographic signatures.</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">1. Stego Object</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                stegoFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900'
              }`}
            >
              <div className="p-3 bg-slate-800 rounded-full mb-3">
                <FileCode className={`w-6 h-6 ${stegoFile ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>
              <p className="text-slate-300 font-medium">{stegoFile ? stegoFile.name : 'Select Stego-Image'}</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">2. Verification Key</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Encryption Key"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none mono"
              />
              <Unlock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            </div>
            
            <button
              onClick={handleExtract}
              disabled={!stegoFile || !password || isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Decrypting Payload...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Extract Secret
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {extractedData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-400">Payload Recovered</label>
              <button 
                onClick={copyToClipboard}
                className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative group">
              <p className="text-slate-100 leading-relaxed font-medium mono whitespace-pre-wrap">{extractedData}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Decoder;
