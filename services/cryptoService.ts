
import CryptoJS from 'crypto-js';
import pako from 'pako';

export const encryptAndCompress = (text: string, key: string): string => {
  // 1. Compression
  const compressed = pako.deflate(text);
  const compressedStr = btoa(String.fromCharCode.apply(null, Array.from(compressed)));
  
  // 2. AES-256 Encryption
  const encrypted = CryptoJS.AES.encrypt(compressedStr, key).toString();
  
  return encrypted;
};

export const decryptAndDecompress = (encryptedStr: string, key: string): string => {
  try {
    // 1. AES-256 Decryption
    const bytes = CryptoJS.AES.decrypt(encryptedStr, key);
    const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedBase64) throw new Error("Invalid decryption key or corrupted data.");

    // 2. Decompression
    const compressed = new Uint8Array(atob(decryptedBase64).split("").map(c => c.charCodeAt(0)));
    const decompressed = pako.inflate(compressed, { to: 'string' });
    
    return decompressed;
  } catch (err) {
    console.error("Extraction failed", err);
    throw new Error("Failed to extract data. Ensure the key is correct and file is valid.");
  }
};
