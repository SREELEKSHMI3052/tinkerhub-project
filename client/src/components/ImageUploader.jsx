import React, { useState } from 'react';

export default function ImageUploader({ onUploadSuccess }) {
  const [preview, setPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      // Create an image object to read dimensions
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        // Create an invisible canvas to resize the image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while keeping aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        // Draw the resized image onto the canvas
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert back to a highly compressed JPEG string (70% quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        setPreview(compressedBase64); // Show preview
        onUploadSuccess(compressedBase64); // Send tiny string to backend
      };
    };
  };

  return (
    <div style={{ margin: '10px 0', padding: '10px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
        📸 Upload Photo Proof:
      </label>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        style={{ width: '100%', cursor: 'pointer' }} 
      />
      {preview && (
        <img 
          src={preview} 
          alt="Preview" 
          style={{ marginTop: '15px', maxHeight: '120px', borderRadius: '8px', display: 'block', border: '1px solid #eee' }} 
        />
      )}
    </div>
  );
}