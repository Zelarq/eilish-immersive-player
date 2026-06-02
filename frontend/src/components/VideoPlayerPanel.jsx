import React from 'react';
import { Play, Maximize2, RefreshCw, Music } from 'lucide-react';

export function VideoPlayerPanel({ activeTrack, isPlaying, onTogglePlay, isFocused, onFocus, playerStatus }) {
  const handlePanelClick = (e) => {
    if (!isFocused) {
      onFocus();
    }
  };

  const handleOverlayClick = (e) => {
    // If focused, clicking the overlay toggles play/pause
    if (isFocused) {
      e.stopPropagation();
      onTogglePlay();
    }
  };

  // Helper to format status text and color
  const getStatusIndicator = () => {
    switch(playerStatus) {
      case 'playing':
        return { color: '#10B981', label: 'Playing' }; // Green
      case 'paused':
        return { color: '#F59E0B', label: 'Paused' }; // Orange
      case 'buffering':
        return { color: '#3B82F6', label: 'Buffering' }; // Blue
      case 'ready':
        return { color: '#10B981', label: 'Ready' };
      case 'loading-api':
        return { color: '#6B7280', label: 'Loading API...', pulse: true };
      case 'initializing-player':
        return { color: '#6B7280', label: 'Initializing...', pulse: true };
      default:
        if (playerStatus && playerStatus.startsWith('error')) {
          return { color: '#EF4444', label: `Playback Blocked (${playerStatus})` };
        }
        return { color: '#9CA3AF', label: playerStatus || 'Idle' };
    }
  };

  const status = getStatusIndicator();

  return (
    <div 
      className={`stage-panel ${isFocused ? 'center-focus' : 'right-focus'}`}
      onClick={handlePanelClick}
    >
      <div className="panel-container">
        
        {/* Inactive overlay to swap focus */}
        {!isFocused && (
          <div className="panel-hover-overlay">
            <div className="overlay-text">Focus Video Player</div>
          </div>
        )}

        {/* Video Player Wrapper */}
        <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000' }}>
          
          {/* Main YouTube API Anchor */}
          <div className="youtube-iframe-container" style={{ width: '100%', height: '100%' }}>
            <div id="youtube-player-iframe"></div>
          </div>

          {/* Audio Fallback Vinyl Mode */}
          {playerStatus === 'audio-fallback' && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, #102636 0%, #033047 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                zIndex: 4,
                padding: '24px'
              }}
            >
              {/* Rotating Vinyl Record */}
              <div 
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  backgroundColor: '#011621',
                  border: '8px solid #000',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.6), inset 0 0 10px rgba(255,255,255,0.05)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: isPlaying ? 'spin 15s linear infinite' : 'none'
                }}
                className="vinyl-record"
              >
                {/* Vinyl Grooves */}
                <div style={{ position: 'absolute', width: '80%', height: '80%', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', width: '60%', height: '60%', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                
                {/* Album Cover Center Label */}
                <div 
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #000',
                    zIndex: 2,
                    backgroundColor: 'var(--color-bg-slate-blue)'
                  }}
                >
                  {activeTrack.coverUrl ? (
                    <img 
                      src={activeTrack.coverUrl} 
                      alt="album label" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <Music style={{ margin: 'auto', color: 'var(--color-off-white)' }} />
                  )}
                </div>
                {/* Spindle Hole */}
                <div style={{ position: 'absolute', width: '10px', height: '10px', backgroundColor: 'var(--color-bg-deep-navy)', borderRadius: '50%', zIndex: 3, border: '2px solid #000' }} />
              </div>

              {/* Pulsing Visual Waveform Bars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '32px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => {
                  const animDuration = 0.5 + Math.random() * 0.8;
                  const animDelay = Math.random() * 0.5;
                  return (
                    <div 
                      key={bar}
                      style={{
                        width: '3px',
                        backgroundColor: 'var(--color-muted-blue)',
                        borderRadius: '2px',
                        height: isPlaying ? '32px' : '4px',
                        transform: 'scaleY(0.15)',
                        transformOrigin: 'bottom',
                        animation: isPlaying ? `equalize ${animDuration}s ease-in-out infinite alternate` : 'none',
                        animationDelay: `${animDelay}s`
                      }}
                    />
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span 
                  style={{ 
                    fontSize: '0.65rem', 
                    color: 'var(--color-muted-blue)', 
                    fontWeight: 700, 
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                  }}
                >
                  Audio Stream Active
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-light-grey)', fontStyle: 'italic', textAlign: 'center', opacity: 0.8 }}>
                  (Video unavailable / restricted by owner)
                </span>
              </div>
            </div>
          )}

          {/* Active play/pause click overlay */}
          {isFocused && (
            <div 
              onClick={handleOverlayClick}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 5,
                background: 'rgba(0, 0, 0, 0.01)', // Almost transparent to catch clicks
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s ease'
              }}
              className="video-click-detector"
            >
              {/* Pulse Play Icon briefly when paused overlay */}
              {!isPlaying && (
                <div 
                  style={{
                    backgroundColor: 'rgba(3, 48, 71, 0.8)',
                    border: '2px solid var(--color-off-white)',
                    borderRadius: '50%',
                    padding: '24px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    transform: 'scale(1)',
                    animation: 'pulse-slow 2s infinite',
                    pointerEvents: 'none' // Don't block clicks
                  }}
                >
                  <Play size={40} style={{ color: 'var(--color-off-white)', fill: 'var(--color-off-white)', marginLeft: '4px' }} />
                </div>
              )}
            </div>
          )}

          {/* Status Badge */}
          {isFocused && (
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(3, 48, 71, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(92, 103, 125, 0.3)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--color-off-white)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 6,
                pointerEvents: 'none'
              }}
            >
              <span 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: status.color,
                  animation: status.pulse ? 'pulse-glow 1s infinite alternate' : 'none',
                  boxShadow: `0 0 8px ${status.color}`
                }}
              />
              <span style={{ letterSpacing: '0.5px' }}>{status.label}</span>
            </div>
          )}

          {/* Video Metadata Floating Tag */}
          <div 
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: 'rgba(3, 48, 71, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(92, 103, 125, 0.3)',
              padding: '10px 16px',
              borderRadius: '10px',
              zIndex: 6,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            <span style={{ fontSize: '0.65rem', color: 'var(--color-muted-blue)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>NOW STREAMING</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-off-white)', fontWeight: 700 }}>{activeTrack.title}</span>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse-slow {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 243, 238, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(244, 243, 238, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 243, 238, 0); }
        }
        @keyframes pulse-glow {
          0% { opacity: 0.3; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes equalize {
          0% { transform: scaleY(0.15); }
          100% { transform: scaleY(1); }
        }
        .video-click-detector:hover {
          background: rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
