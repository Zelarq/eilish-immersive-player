import React, { useEffect, useRef } from 'react';
import { Sparkles, Info } from 'lucide-react';

export function LyricsPanel({ activeTrack, currentTime, onSeek, isFocused, onFocus }) {
  const scrollContainerRef = useRef(null);
  const activeLineRef = useRef(null);

  const lyrics = activeTrack.lyrics || [];
  const trivia = activeTrack.trivia || [];

  // Find currently active lyric line
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Smooth scroll active lyric into center of container
  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  const handlePanelClick = () => {
    if (!isFocused) {
      onFocus();
    }
  };

  const handleLineClick = (e, time) => {
    if (isFocused) {
      e.stopPropagation();
      onSeek(time);
    }
  };

  return (
    <div 
      className={`stage-panel ${isFocused ? 'center-focus' : 'right-focus'}`}
      onClick={handlePanelClick}
    >
      <div className="panel-container" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Inactive overlay to swap focus */}
        {!isFocused && (
          <div className="panel-hover-overlay">
            <div className="overlay-text">Focus Lyrics & Trivia</div>
          </div>
        )}

        {/* Panel Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid rgba(92, 103, 125, 0.15)', marginBottom: '16px' }}>
          <Sparkles style={{ color: 'var(--color-off-white)' }} size={16} />
          <h2 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-light-grey)', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
            Interactive Lyrics
          </h2>
        </div>

        {/* Lyrics scroll area */}
        <div 
          ref={scrollContainerRef}
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '40px 0', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            position: 'relative'
          }}
          className="lyrics-scroll-container"
        >
          {lyrics.length > 0 ? (
            lyrics.map((line, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  ref={isActive ? activeLineRef : null}
                  onClick={(e) => handleLineClick(e, line.time)}
                  className={`lyric-line ${isActive ? 'active' : ''}`}
                >
                  <p className="lyrics-text">
                    {line.text}
                  </p>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--color-muted-blue)', fontStyle: 'italic', margin: 'auto' }}>
              No lyrics available for this track.
            </div>
          )}
        </div>

        {/* Song Trivia Section */}
        {trivia.length > 0 && isFocused && (
          <div 
            style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '1px solid rgba(92, 103, 125, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} style={{ color: 'var(--color-muted-blue)' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-muted-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>Behind The Track</span>
            </div>
            <div 
              style={{ 
                maxHeight: '80px', 
                overflowY: 'auto', 
                fontSize: '0.75rem', 
                color: 'var(--color-light-grey)', 
                lineHeight: '1.5',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingRight: '8px'
              }}
            >
              {trivia.map((fact, idx) => (
                <p key={idx} style={{ margin: 0, paddingLeft: '8px', borderLeft: '2px solid var(--color-muted-blue)' }}>
                  {fact}
                </p>
              ))}
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        /* Smooth fade effects for active lyrics scrolling list */
        .lyrics-scroll-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(180deg, var(--color-bg-slate-blue) 0%, transparent 100%);
          z-index: 2;
          pointer-events: none;
        }
        .lyrics-scroll-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(0deg, var(--color-bg-slate-blue) 0%, transparent 100%);
          z-index: 2;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
