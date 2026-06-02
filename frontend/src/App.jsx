import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainStage } from './components/MainStage';
import { BottomPlaybackController } from './components/BottomPlaybackController';
import { useYoutubePlayer } from './hooks/useYoutubePlayer';

const API_BASE = 'http://localhost:8000';

function App() {
  const [tracks, setTracks] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeTrackDetails, setActiveTrackDetails] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [layoutFlipped, setLayoutFlipped] = useState(false);

  // Fetch all Billie Eilish tracks on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/tracks`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tracks');
        return res.json();
      })
      .then((data) => {
        setTracks(data);
        if (data.length > 0) {
          // Select first track by default on load
          handleSelectTrack(data[0], false);
        }
      })
      .catch((err) => console.error('Error fetching tracks:', err));
  }, []);

  // Fetch track content when selected
  const handleSelectTrack = (track, autoPlay = true) => {
    setActiveTrack(track);
    setCurrentTime(0);
    setDuration(0);
    if (autoPlay) {
      setIsPlaying(true);
    }
    
    fetch(`${API_BASE}/api/tracks/${track.id}/content`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch track details');
        return res.json();
      })
      .then((details) => {
        setActiveTrackDetails(details);
      })
      .catch((err) => console.error('Error fetching track content:', err));
  };

  // Skip Next track helper
  const handleNextTrack = () => {
    if (tracks.length === 0 || !activeTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === activeTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handleSelectTrack(tracks[nextIndex]);
  };

  // Skip Previous track helper
  const handlePrevTrack = () => {
    if (tracks.length === 0 || !activeTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === activeTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handleSelectTrack(tracks[prevIndex]);
  };

  // Bind custom YouTube player hooks
  const { seekTo, playerStatus } = useYoutubePlayer(
    activeTrack?.videoId || '',
    activeTrackDetails?.fallbackAudio || '',
    isPlaying,
    setIsPlaying,
    volume,
    (time) => setCurrentTime(time),
    (dur) => setDuration(dur),
    handleNextTrack // Auto skip next on track finish
  );

  // Toggle play/pause action
  const handleTogglePlay = () => {
    if (!activeTrack) return;
    setIsPlaying((prev) => !prev);
  };

  // Setup global keyboard shortcut (Spacebar) to toggle play/pause
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Guard: ignore when focused on input fields or textarea
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault(); // Stop default browser window scrolling
        handleTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTrack, isPlaying]);

  return (
    <div className="app-container">
      {/* 3-Pane Split Layout */}
      <div className="main-layout">
        
        {/* Pane 1: Left Library Sidebar */}
        <Sidebar
          tracks={tracks}
          activeTrack={activeTrack}
          onSelectTrack={(track) => handleSelectTrack(track)}
          isPlaying={isPlaying}
        />

        {/* Panes 2 & 3: Sliding Focal Center Stage */}
        <MainStage
          activeTrack={activeTrackDetails}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          currentTime={currentTime}
          onSeek={seekTo}
          layoutFlipped={layoutFlipped}
          onChangeLayout={(flipped) => setLayoutFlipped(flipped)}
          playerStatus={playerStatus}
        />

      </div>

      {/* Persistent Bottom Bar Controller */}
      <BottomPlaybackController
        activeTrack={activeTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        currentTime={currentTime}
        duration={duration}
        onSeek={seekTo}
        volume={volume}
        onChangeVolume={(vol) => setVolume(vol)}
        layoutFlipped={layoutFlipped}
        onChangeLayout={(flipped) => setLayoutFlipped(flipped)}
      />
    </div>
  );
}

export default App;
