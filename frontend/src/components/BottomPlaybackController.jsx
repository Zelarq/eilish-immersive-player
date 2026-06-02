import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Columns, 
  Music 
} from 'lucide-react';

export function BottomPlaybackController({
  activeTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
  volume,
  onChangeVolume,
  layoutFlipped,
  onChangeLayout
}) {
  
  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressBarClick = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    onSeek(percentage * duration);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Toggle Mute Helper
  const handleToggleMute = () => {
    if (volume > 0) {
      onChangeVolume(0);
    } else {
      onChangeVolume(50); // Default restore
    }
  };

  return (
    <div className="bottom-playback-controller">
      
      {/* Left Pane: Track Information */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', minWidth: '180px' }}>
        {activeTrack ? (
          <>
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(92, 103, 125, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {activeTrack.coverUrl ? (
                <img 
                  src={activeTrack.coverUrl} 
                  alt={activeTrack.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <Music size={20} style={{ color: 'var(--color-off-white)' }} />
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div 
                style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  color: 'var(--color-off-white)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {activeTrack.title}
              </div>
              <div 
                style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--color-light-grey)',
                  opacity: 0.8,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '2px'
                }}
              >
                {activeTrack.album}
              </div>
            </div>
          </>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-blue)' }}>No active track</div>
        )}
      </div>

      {/* Center Pane: Media Controls & Seeker */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '8px',
          width: '45%',
          maxWidth: '600px'
        }}
      >
        {/* Buttons Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="btn" style={{ opacity: 0.5 }}>
            <Shuffle size={16} />
          </button>
          
          <button className="btn" onClick={onPrev} disabled={!activeTrack}>
            <SkipBack size={18} style={{ fill: 'currentColor' }} />
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={onTogglePlay} 
            disabled={!activeTrack}
            style={{ padding: '12px' }}
          >
            {isPlaying ? (
              <Pause size={20} style={{ fill: 'currentColor' }} />
            ) : (
              <Play size={20} style={{ fill: 'currentColor', marginLeft: '2px' }} />
            )}
          </button>
          
          <button className="btn" onClick={onNext} disabled={!activeTrack}>
            <SkipForward size={18} style={{ fill: 'currentColor' }} />
          </button>
          
          <button className="btn" style={{ opacity: 0.5 }}>
            <Repeat size={16} />
          </button>
        </div>

        {/* Seeker Slider */}
        <div className="progress-bar-container">
          <span>{formatTime(currentTime)}</span>
          <div className="progress-bar-rail" onClick={handleProgressBarClick}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="progress-bar-handle" />
            </div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Pane: Utilities (Volume, Focal Swap Trigger) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-end', width: '25%', minWidth: '180px' }}>
        
        {/* Layout Swapper Quick Button */}
        <button 
          className="btn" 
          onClick={() => onChangeLayout(!layoutFlipped)}
          title="Swap focal focus layout"
          style={{
            color: layoutFlipped ? 'var(--color-off-white)' : 'var(--color-light-grey)',
            backgroundColor: layoutFlipped ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            borderRadius: '6px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            fontWeight: 500,
            border: '1px solid rgba(92, 103, 125, 0.3)'
          }}
        >
          <Columns size={15} />
          <span>Focal Shift</span>
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(92, 103, 125, 0.3)' }} />

        {/* Volume controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn" onClick={handleToggleMute} style={{ padding: '6px' }}>
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onChangeVolume(parseInt(e.target.value))}
            className="volume-slider"
          />
        </div>
      </div>

    </div>
  );
}
