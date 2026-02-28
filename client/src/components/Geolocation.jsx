import React, { useState } from 'react';

export default function Geolocation({ onTagSuccess }) {
  const [status, setStatus] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div style={{ margin: '10px 0', display: 'flex', gap: isMobile ? '8px' : '10px', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }}>
      <button type="button" onClick={getLocation} style={{ padding: isMobile ? '10px 12px' : '8px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: isMobile ? '0.85rem' : '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', flex: isMobile ? '1' : 'auto' }}>
        📍 Tag My Location
      </button>
      <span style={{ marginLeft: isMobile ? '0' : '10px', fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#555' }}>{status}</span>
    </div>
  );
}