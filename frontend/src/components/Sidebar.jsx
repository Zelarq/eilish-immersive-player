import React from 'react';
import { Music, Disc, Radio } from 'lucide-react';

export function Sidebar({ tracks, activeTrack, onSelectTrack, isPlaying }) {
  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid var(--color-muted-blue)' }}>
      {/* Sidebar Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(92, 103, 125, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Radio style={{ color: 'var(--color-off-white)', animation: 'pulse 2s infinite' }} size={24} />
        <div>
          <h1 style={{ color: 'var(--color-off-white)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px' }}>EILISH</h1>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-muted-blue)', fontWeight: 600, letterSpacing: '2px' }}>IMMERSIVE PLAYER</span>
        </div>
      </div>

      {/* Playlist Library */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted-blue)', letterSpacing: '1.5px', marginBottom: '16px', textTransform: 'uppercase', paddingLeft: '8px' }}>
          My Library
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tracks.map((track) => {
            const isActive = activeTrack && activeTrack.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--color-bg-slate-blue)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                  transition: 'all 0.2s ease-in-out',
                }}
                className="library-track-card"
              >
                <div 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', // Circle like a vinyl disc!
                    backgroundColor: 'rgba(92, 103, 125, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'var(--color-off-white)' : 'var(--color-muted-blue)',
                    boxShadow: isActive ? '0 4px 10px rgba(0, 0, 0, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    border: isActive ? '2px solid var(--color-off-white)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {track.coverUrl ? (
                    <img 
                      src={track.coverUrl} 
                      alt={track.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        animation: (isActive && isPlaying) ? 'spin 12s linear infinite' : 'none'
                      }} 
                    />
                  ) : (
                    <Music size={16} />
                  )}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 
                    style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      color: isActive ? 'var(--color-off-white)' : 'var(--color-light-grey)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      margin: 0
                    }}
                  >
                    {track.title}
                  </h3>
                  <p 
                    style={{ 
                      fontSize: '0.7rem', 
                      color: 'var(--color-muted-blue)', 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      margin: '2px 0 0 0'
                    }}
                  >
                    {track.album}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Cover Art Panel */}
      <div 
        style={{ 
          padding: '20px', 
          borderTop: '1px solid rgba(92, 103, 125, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          background: 'linear-gradient(180deg, transparent, rgba(48, 76, 98, 0.15))'
        }}
      >
        <div 
          style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #033047 0%, #304C62 50%, #5C677D 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '16px'
          }}
        >
          {/* Subtle Abstract Waveforms */}
          <div style={{ 
            position: 'absolute', 
            width: '150%', 
            height: '150%', 
            border: '1px solid rgba(244, 243, 238, 0.03)', 
            borderRadius: '50%',
            top: '-25%',
            left: '-25%',
            animation: 'spin 12s linear infinite'
          }} />
          
          <div style={{ 
            position: 'absolute', 
            width: '120%', 
            height: '120%', 
            border: '1px dashed rgba(244, 243, 238, 0.04)', 
            borderRadius: '50%',
            top: '-10%',
            left: '-10%',
            animation: 'spin 20s linear infinite reverse'
          }} />

          <span 
            style={{ 
              fontFamily: 'var(--font-lyrics)', 
              fontSize: '3rem', 
              color: 'var(--color-off-white)',
              textShadow: '0 0 10px rgba(244, 243, 238, 0.3)',
              lineHeight: 1,
              zIndex: 1,
              transform: 'rotate(-5deg)'
            }}
          >
            Billie
          </span>
          <span 
            style={{ 
              fontSize: '0.65rem', 
              color: 'var(--color-light-grey)', 
              letterSpacing: '5px', 
              marginTop: '4px',
              textTransform: 'uppercase',
              fontWeight: 500,
              zIndex: 1
            }}
          >
            Eilish
          </span>
        </div>
      </div>
      
      {/* Inline animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        .library-track-card:hover {
          background-color: rgba(48, 76, 98, 0.4) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
