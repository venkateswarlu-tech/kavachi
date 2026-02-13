
import React, { useState, useRef } from 'react';
import { Upload, Lock, ShieldCheck, Download, Loader2, Image as ImageIcon, Send } from 'lucide-react';
import { encryptAndCompress } from '../services/cryptoService';
import { embedDataInImage } from '../services/steganographyService';
import { StegoResult } from '../types';

interface EncoderProps {
  onEncodingSuccess: (result: StegoResult) => void;
}

const Encoder: React.FC<EncoderProps> = ({ onEncodingSuccess }) => {
  const [carrierFile, setCarrierFile] = useState<File | null>(null);
  const [secretMessage, setSecretMessage] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCarrierFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleEmbed = async () => {
    if (!carrierFile || !secretMessage || !password) return;

    setIsProcessing(true);
    try {
      // Step 1: Fortress (Encrypt + Compress)
      const encryptedBlob = encryptAndCompress(secretMessage, password);
      
      // Step 2: Stealth (Embed in Image)
      const { stegoImageUrl, report } = await embedDataInImage(carrierFile, encryptedBlob);
      
      onEncodingSuccess({
        stegoImageUrl,
        report,
        originalFileName: carrierFile.name
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Encoding failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Lock className="w-7 h-7 text-sky-500" />
          Stealth Embedding Engine
        </h2>
        <p className="text-slate-400 mt-2">Deploy your secret message within a visual carrier file with cryptographic integrity.</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">1. Select Carrier Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                previewUrl ? 'border-sky-500/50 bg-sky-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900'
              }`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-2 rounded-lg" />
              ) : (
                <div className="flex flex-col items-center text-center px-4">
                  <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-300 font-medium">Click or Drag Image</p>
                  <p className="text-slate-500 text-sm mt-1">PNG recommended for lossless embedding</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Configuration Area */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">2. Secret Payload</label>
              <textarea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                placeholder="Enter sensitive data to be hidden..."
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder:text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none resize-none mono text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">3. Security Key (AES-256)</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Master Encryption Key"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none mono"
                />
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>FIPS-compliant cryptographic workflow active</span>
          </div>
          <button
            onClick={handleEmbed}
            disabled={!carrierFile || !secretMessage || !password || isProcessing}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Execute Kavach Defense
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Encoder;
