import React, { useState } from 'react';

export default function Geolocation({ onTagSuccess }) {
  const [status, setStatus] = useState('');

  const getLocation = () => {
    setStatus('Locating...');
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus('✅ Location captured!');
          onTagSuccess({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => setStatus('❌ Unable to retrieve your location')
      );
    }
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <button type="button" onClick={getLocation} style={{ padding: '8px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        📍 Tag My Location
      </button>
      <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#555' }}>{status}</span>
    </div>
  );
}