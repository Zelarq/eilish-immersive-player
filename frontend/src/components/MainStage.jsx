import React from 'react';
import { VideoPlayerPanel } from './VideoPlayerPanel';
import { LyricsPanel } from './LyricsPanel';

export function MainStage({ activeTrack, isPlaying, onTogglePlay, currentTime, onSeek, layoutFlipped, onChangeLayout, playerStatus }) {
  if (!activeTrack) {
    return (
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#022538',
          gap: '16px'
        }}
      >
        <div 
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            border: '3px solid var(--color-muted-blue)', 
            borderTopColor: 'var(--color-off-white)',
            animation: 'spin 1s linear infinite'
          }} 
        />
        <p style={{ color: 'var(--color-muted-blue)', fontSize: '0.9rem', letterSpacing: '1px' }}>
          Loading track player...
        </p>
      </div>
    );
  }

  return (
    <div className="main-stage">
      {/* Video Player Panel */}
      <VideoPlayerPanel
        activeTrack={activeTrack}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        isFocused={!layoutFlipped}
        onFocus={() => onChangeLayout(false)}
        playerStatus={playerStatus}
      />

      {/* Lyrics & Trivia Panel */}
      <LyricsPanel
        activeTrack={activeTrack}
        currentTime={currentTime}
        onSeek={onSeek}
        isFocused={layoutFlipped}
        onFocus={() => onChangeLayout(true)}
      />
    </div>
  );
}
