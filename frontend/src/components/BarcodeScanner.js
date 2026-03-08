import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
        onClose();
      },
      (err) => {
        setError('Camera not accessible. Please allow camera access.');
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>📷 Scan Barcode</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <p style={styles.sub}>Point your camera at a product barcode</p>
        {error && <p style={styles.error}>{error}</p>}
        <div id="qr-reader" style={{ width: '100%' }} />
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '28px',
    width: '100%', maxWidth: '480px',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  title: { color: '#fffffe', fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 700 },
  closeBtn: {
    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
    color: '#ff6b6b', borderRadius: '8px', padding: '6px 12px',
    cursor: 'pointer', fontSize: '0.9rem',
  },
  sub: { color: '#a7a9be', fontSize: '0.85rem', marginBottom: '20px' },
  error: { color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '12px' },
};

export default BarcodeScanner;