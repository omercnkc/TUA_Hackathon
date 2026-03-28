import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Developer 1 is responsible for the UI panel structure & visuals.
// Developer 2 will pass telemetry data, countdown, and other logic as props.
export default function UIPanel({ 
  height, 
  velocity = 0, 
  fuel = 100, 
  countdown = 10,
  status = 'PRE-LAUNCH',
  onLaunchTest, 
  onReset 
}) {
  const dashboardRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Elegant entrance animation sequence with GSAP
    gsap.fromTo(headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
    );

    gsap.fromTo(dashboardRef.current.children,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // Lets clicks pass through to 3D canvas
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px',
      boxSizing: 'border-box',
      fontFamily: '"Geist Mono", "SF Mono", "Consolas", monospace', // Monospace font for HUD feel
      color: '#e0f7fa',
      // Sci-Fi HUD vignette
      background: 'radial-gradient(circle at center, transparent 60%, rgba(0, 5, 10, 0.4) 100%)'
    }}>
      
      {/* Sci-Fi Corner Borders */}
      <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '2px solid #00e5ff', borderLeft: '2px solid #00e5ff', opacity: 0.7 }}></div>
      <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: '2px solid #00e5ff', borderRight: '2px solid #00e5ff', opacity: 0.7 }}></div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: '2px solid #00e5ff', borderLeft: '2px solid #00e5ff', opacity: 0.7 }}></div>
      <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '2px solid #00e5ff', borderRight: '2px solid #00e5ff', opacity: 0.7 }}></div>

      {/* Top Header */}
      <header ref={headerRef} style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          background: 'rgba(0, 20, 30, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '15px 30px',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderLeft: '4px solid #00e5ff',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '4px', fontWeight: 600, color: '#00e5ff', textShadow: '0 0 10px rgba(0,229,255,0.5)' }}>TACTICAL LAUNCH COMMAND</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '12px', letterSpacing: '2px' }}>SYS.OP: BASE ALPHA // ONLINE</p>
        </div>

        {/* Status Indicator */}
        <div style={{
          background: 'rgba(0, 20, 30, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '15px 30px',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRight: '4px solid #00e5ff',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: status === 'LAUNCHED' ? '#00e676' : '#ffea00',
            boxShadow: `0 0 10px ${status === 'LAUNCHED' ? '#00e676' : '#ffea00'}`
          }}></div>
          <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px' }}>{status}</span>
        </div>
      </header>

      {/* Telemetry Dashboard (Developer 2 will connect this) */}
      <div ref={dashboardRef} style={{
        alignSelf: 'flex-start',
        background: 'rgba(0, 15, 20, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        borderLeft: '4px solid #00e5ff',
        width: '350px',
        boxShadow: '0 0 30px rgba(0, 229, 255, 0.1)',
        pointerEvents: 'auto',
        position: 'relative'
      }}>
        {/* Decorative HUD Elements */}
        <div style={{ position: 'absolute', top: 5, right: 10, fontSize: '10px', opacity: 0.5, letterSpacing: '2px' }}>DATA_STREAM_ACTIVE</div>
        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderBottom: '2px solid #00e5ff', borderRight: '2px solid #00e5ff' }}></div>

        <h2 style={{ margin: '0 0 25px 0', fontSize: '16px', color: '#00e5ff', letterSpacing: '3px', textTransform: 'uppercase', borderBottom: '1px dashed rgba(0,229,255,0.3)', paddingBottom: '15px' }}>
          Real-Time Telemetry
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Altitude</span>
            <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace' }}>{(typeof height === "number" ? height : 0).toFixed(0)} <span style={{ fontSize: '16px', opacity: 0.6 }}>m</span></span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Velocity</span>
            <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace' }}>{velocity.toFixed(1)} <span style={{ fontSize: '16px', opacity: 0.6 }}>m/s</span></span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Fuel Level</span>
            <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace', color: fuel < 20 ? '#ff3333' : 'white' }}>{fuel.toFixed(0)} <span style={{ fontSize: '16px', opacity: 0.6 }}>%</span></span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>T-Minus</span>
            <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace', color: countdown <= 3 && countdown > 0 ? '#ff3333' : '#00e676' }}>
              00:{countdown.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Developer Override Controls */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button 
            onClick={onLaunchTest}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid #00e5ff',
              color: '#00e5ff',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              cursor: 'pointer',
              textShadow: '0 0 8px rgba(0,229,255,0.5)',
              boxShadow: 'inset 0 0 10px rgba(0,229,255,0.2), 0 0 10px rgba(0,229,255,0.2)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.target.style.background = '#00e5ff'; e.target.style.color = '#000'; }}
            onMouseOut={(e) => { e.target.style.background = 'rgba(0, 229, 255, 0.1)'; e.target.style.color = '#00e5ff'; }}
          >
            IGNITION
          </button>
          <button 
            onClick={onReset}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'rgba(255, 51, 51, 0.05)',
              border: '1px solid rgba(255, 51, 51, 0.4)',
              color: '#ff3333',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.target.style.background = '#ff3333'; e.target.style.color = '#000'; }}
            onMouseOut={(e) => { e.target.style.background = 'rgba(255, 51, 51, 0.05)'; e.target.style.color = '#ff3333'; }}
          >
            ABORT
          </button>
        </div>
      </div>
    </div>
  );
}
