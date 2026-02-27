import React, { useState } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import { theme } from '../theme';

export default function ImageUploader({ onUploadSuccess }) {
  const [preview, setPreview] = useState('');

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Compress the image to ensure it easily transmits to the DB
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setPreview(compressedBase64);
        onUploadSuccess(compressedBase64);
      };
    };
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: preview ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', border: preview ? `1px solid ${theme.success}` : theme.border, borderRadius: '12px', color: preview ? theme.success : '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', transition: 'all 0.3s' }}>
        {preview ? <CheckCircle size={18} /> : <Camera size={18} color={theme.primary} />}
        {preview ? 'Photo Attached Successfully' : 'Upload Photo Proof'}
        <input type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
      </label>
      {preview && <img src={preview} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px', border: theme.border }} />}
    </div>
  );
}