import React from 'react';

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
      padding: '30px',
      boxSizing: 'border-box',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'white'
    }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          background: 'rgba(20, 25, 40, 0.65)',
          backdropFilter: 'blur(12px)',
          padding: '15px 30px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px', fontWeight: 600 }}>TUA LAUNCH COMMAND</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '14px', letterSpacing: '1px' }}>SPACE BASE ALPHA</p>
        </div>

        {/* Status Indicator */}
        <div style={{
          background: 'rgba(20, 25, 40, 0.65)',
          backdropFilter: 'blur(12px)',
          padding: '15px 30px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
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
      <div style={{
        alignSelf: 'flex-start',
        background: 'rgba(10, 15, 30, 0.8)',
        backdropFilter: 'blur(16px)',
        padding: '25px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        width: '320px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        pointerEvents: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={onLaunchTest}
            style={{
              flex: 1,
              padding: '15px 0',
              background: 'linear-gradient(135deg, #ff4400 0%, #cc3300 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 68, 0, 0.4)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            IGNITION
          </button>
          <button 
            onClick={onReset}
            style={{
              flex: 1,
              padding: '15px 0',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            ABORT
          </button>
        </div>
      </div>
    </div>
  );
}
