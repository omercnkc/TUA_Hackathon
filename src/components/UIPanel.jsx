import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Terminal, Activity, Zap, Play, RotateCcw, ShieldAlert } from 'lucide-react';

const S = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '30px',
    boxSizing: 'border-box',
    fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
    color: '#e0f7fa',
    background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 5, 10, 0.4) 100%)',
    zIndex: 1000
  },
  corner: (type) => ({
    position: 'absolute',
    width: '50px',
    height: '50px',
    border: '2px solid rgba(0, 229, 255, 0.4)',
    ...(type === 'tl' && { top: 20, left: 20, borderRight: 'none', borderBottom: 'none' }),
    ...(type === 'tr' && { top: 20, right: 20, borderLeft: 'none', borderBottom: 'none' }),
    ...(type === 'bl' && { bottom: 20, left: 20, borderRight: 'none', borderTop: 'none' }),
    ...(type === 'br' && { bottom: 20, right: 20, borderLeft: 'none', borderTop: 'none' }),
  }),
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    pointerEvents: 'auto'
  },
  commandBox: {
    background: 'rgba(0, 20, 30, 0.85)',
    backdropFilter: 'blur(12px)',
    padding: '12px 24px',
    border: '1px solid rgba(0, 229, 255, 0.3)',
    borderLeft: '4px solid #00e5ff',
    boxShadow: '0 0 20px rgba(0, 229, 255, 0.1)'
  },
  statusBadge: (status) => ({
    background: 'rgba(0, 20, 30, 0.85)',
    backdropFilter: 'blur(12px)',
    padding: '12px 24px',
    border: '1px solid rgba(0, 229, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 0 20px rgba(0, 229, 255, 0.1)'
  }),
  dot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 10px ${color}`,
    animation: 'pulse 2s infinite'
  }),
  mainPanel: {
    alignSelf: 'flex-start',
    background: 'rgba(0, 15, 20, 0.85)',
    backdropFilter: 'blur(16px)',
    padding: '24px',
    border: '1px solid rgba(0, 229, 255, 0.2)',
    borderLeft: '4px solid #00e5ff',
    width: '380px',
    boxShadow: '0 0 40px rgba(0, 229, 255, 0.15)',
    pointerEvents: 'auto',
    position: 'relative',
    marginTop: 'auto',
    marginBottom: '20px'
  },
  telemetryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px'
  },
  telemetryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: 'rgba(0, 229, 255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  value: (color = 'white') => ({
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: '"JetBrains Mono", monospace',
    color: color
  }),
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '30px'
  },
  btn: (type) => ({
    flex: 1,
    padding: '14px',
    background: type === 'launch' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 51, 51, 0.05)',
    border: `1px solid ${type === 'launch' ? '#00e5ff' : 'rgba(255, 51, 51, 0.5)'}`,
    color: type === 'launch' ? '#00e5ff' : '#ff4444',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  })
};

export default function UIPanel({ 
  height, velocity = 0, fuel = 100, countdown = 10, status = 'PRE-LAUNCH', 
  onLaunchTest, onReset 
}) {
  const panelRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    gsap.from(headerRef.current, { y: -30, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.from(panelRef.current, { x: -50, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.2 });
  }, []);

  const isCountingDown = countdown > 0 && countdown < 10 && status === 'PRE-LAUNCH';
  const displayStatus = status === 'LIFTOFF' || status === 'ASCENT' ? 'IN-FLIGHT' : status;

  return (
    <div style={S.overlay}>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .hud-btn:hover { filter: brightness(1.2); transform: translateY(-1px); box-shadow: 0 4px 15px rgba(0, 229, 255, 0.2); }
        .hud-btn:active { transform: translateY(0); }
      `}</style>
      
      <div style={S.corner('tl')} /> <div style={S.corner('tr')} />
      <div style={S.corner('bl')} /> <div style={S.corner('br')} />

      <header ref={headerRef} style={S.header}>
        <div style={S.commandBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={18} color="#00e5ff" />
            <h1 style={{ margin: 0, fontSize: '18px', letterSpacing: '3px', fontWeight: 600, color: '#00e5ff' }}>
              TACTICAL LAUNCH COMMAND
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 28px', opacity: 0.6, fontSize: '10px', letterSpacing: '2px' }}>
            SYS.OP: BASE ALPHA // ENCRYPTED_STREAM // ONLINE
          </p>
        </div>

        <div style={S.statusBadge(status)}>
          <div style={S.dot(status === 'LIFTOFF' || status === 'ASCENT' ? '#00e676' : '#ffd700')} />
          <span style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px' }}>{displayStatus}</span>
        </div>
      </header>

      <div ref={panelRef} style={S.mainPanel}>
        <div style={{ position: 'absolute', top: 8, right: 12, fontSize: '9px', opacity: 0.4, letterSpacing: '1px' }}>
          DATA_STREAM_ACTIVE // {new Date().toLocaleTimeString()}
        </div>

        <div style={S.label}>
          <Activity size={12} />
          REAL-TIME TELEMETRY
        </div>
        
        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(0,229,255,0.4), transparent)', margin: '12px 0 20px 0' }} />

        <div style={S.telemetryGrid}>
          <div style={S.telemetryItem}>
            <span style={S.label}>Altitude</span>
            <span style={S.value()}>
              {height.toFixed(0)} <span style={{ fontSize: '14px', opacity: 0.5 }}>m</span>
            </span>
          </div>
          <div style={S.telemetryItem}>
            <span style={S.label}>Velocity</span>
            <span style={S.value()}>
              {velocity.toFixed(1)} <span style={{ fontSize: '14px', opacity: 0.5 }}>m/s</span>
            </span>
          </div>
          <div style={S.telemetryItem}>
            <span style={S.label}>Fuel Level</span>
            <span style={S.value(fuel < 20 ? '#ff4444' : 'white')}>
              {fuel.toFixed(0)} <span style={{ fontSize: '14px', opacity: 0.5 }}>%</span>
            </span>
          </div>
          <div style={S.telemetryItem}>
            <span style={S.label}>T-Minus</span>
            <span style={S.value(isCountingDown ? '#ff4444' : '#00e676')}>
              00:{countdown.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div style={S.buttonGroup}>
          <button className="hud-btn" onClick={onLaunchTest} style={S.btn('launch')}>
            <Play size={16} fill="currentColor" />
            IGNITION
          </button>
          <button className="hud-btn" onClick={onReset} style={S.btn('abort')}>
            <RotateCcw size={16} />
            ABORT
          </button>
        </div>

        <div style={{ marginTop: '20px', fontSize: '9px', opacity: 0.3, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={10} />
          AUTHORIZED ACCESS ONLY // PROTOCOL 07-X
        </div>
      </div>
    </div>
  );
}
