import { useEffect, useRef, useState } from 'react';

export function useYoutubePlayer(videoId, fallbackAudioUrl, isPlaying, setIsPlaying, volume, onTimeUpdate, onDurationChange, onTrackEnd) {
  const playerRef = useRef(null);
  const audioRef = useRef(null);
  const iframeContainerId = 'youtube-player-iframe';
  const timeIntervalRef = useRef(null);
  
  const [playerStatus, setPlayerStatus] = useState('loading-api');
  const [isReady, setIsReady] = useState(false);
  const [useAudio, setUseAudio] = useState(false);

  // Initialize HTML5 Audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Load YouTube IFrame API script dynamically and initialize player
  useEffect(() => {
    // Reset fallback mode whenever track/videoId changes
    setUseAudio(false);
    setIsReady(false);
    
    // Stop any playing audio fallback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // Recreate placeholder div inside container first
    const container = document.querySelector('.youtube-iframe-container');
    if (container) {
      container.innerHTML = `<div id="${iframeContainerId}"></div>`;
    }

    if (window.YT && window.YT.Player) {
      setPlayerStatus('api-ready');
      initializePlayer();
    } else {
      setPlayerStatus('loading-api');
      if (!document.getElementById('youtube-iframe-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        setPlayerStatus('api-ready');
        initializePlayer();
      };
    }

    function initializePlayer() {
      const container = document.querySelector('.youtube-iframe-container');
      if (container && !document.getElementById(iframeContainerId)) {
        container.innerHTML = `<div id="${iframeContainerId}"></div>`;
      }

      setPlayerStatus('initializing-player');

      if (!videoId) {
        setPlayerStatus('no-video');
        return;
      }

      try {
        playerRef.current = new window.YT.Player(iframeContainerId, {
          videoId: videoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3
          },
          events: {
            onReady: (event) => {
              setIsReady(true);
              setPlayerStatus('ready');
              try {
                event.target.setVolume(volume);
                event.target.setPlaybackQuality('large'); // Force 480p resolution
                onDurationChange(event.target.getDuration());
                
                if (isPlaying) {
                  event.target.playVideo();
                } else {
                  event.target.pauseVideo();
                }
              } catch (e) {
                console.error('Error in YouTube onReady:', e);
                setPlayerStatus('error-ready');
              }
            },
            onStateChange: (event) => {
              try {
                const playerState = event.data;
                if (playerState === 1) {
                  setIsPlaying(true);
                  setPlayerStatus('playing');
                  event.target.setPlaybackQuality('large');
                  startTimeTracking();
                } else if (playerState === 2) {
                  setIsPlaying(false);
                  setPlayerStatus('paused');
                  stopTimeTracking();
                } else if (playerState === 0) {
                  setIsPlaying(false);
                  setPlayerStatus('ended');
                  stopTimeTracking();
                  if (onTrackEnd) onTrackEnd();
                } else if (playerState === 3) {
                  setPlayerStatus('buffering');
                }
              } catch (e) {
                console.error('Error in YouTube onStateChange:', e);
              }
            },
            onError: (event) => {
              console.warn('YouTube Player Error code:', event.data, '- Triggering Audio Fallback!');
              // Codes: 101/150 (embed disabled), 2 (invalid id), 5 (HTML5 error), 100 (removed/private)
              switchToAudioFallback();
            }
          }
        });
      } catch (err) {
        console.error('Error creating YT.Player:', err);
        switchToAudioFallback();
      }
    }

    function switchToAudioFallback() {
      setUseAudio(true);
      setPlayerStatus('audio-fallback');
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    }

    return () => {
      stopTimeTracking();
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [videoId]);

  // Sync HTML5 Audio properties when fallback is active
  useEffect(() => {
    if (!useAudio || !fallbackAudioUrl || !audioRef.current) return;

    audioRef.current.src = fallbackAudioUrl;
    audioRef.current.load();
    audioRef.current.volume = volume / 100;

    const handleTimeUpdate = () => {
      onTimeUpdate(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
      onDurationChange(audioRef.current.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onTrackEnd) onTrackEnd();
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audioRef.current.play().catch((err) => console.warn('Audio play request blocked:', err));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [useAudio, fallbackAudioUrl]);

  // Sync play/pause commands
  useEffect(() => {
    if (useAudio) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.warn('Audio play request blocked:', err));
      } else {
        audioRef.current.pause();
      }
    } else {
      if (!isReady || !playerRef.current) return;
      try {
        const state = playerRef.current.getPlayerState();
        if (isPlaying && state !== 1) {
          playerRef.current.playVideo();
        } else if (!isPlaying && state === 1) {
          playerRef.current.pauseVideo();
        }
      } catch (e) {}
    }
  }, [isPlaying, isReady, useAudio]);

  // Sync Volume level
  useEffect(() => {
    if (useAudio) {
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
      }
    } else {
      if (!isReady || !playerRef.current) return;
      try {
        playerRef.current.setVolume(volume);
      } catch (e) {}
    }
  }, [volume, isReady, useAudio]);

  // Start tracking active playback time for YouTube
  const startTimeTracking = () => {
    stopTimeTracking();
    timeIntervalRef.current = setInterval(() => {
      try {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          onTimeUpdate(playerRef.current.getCurrentTime());
        }
      } catch (e) {}
    }, 250);
  };

  const stopTimeTracking = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  };

  // Manual Seek Action
  const seekTo = (seconds) => {
    if (useAudio) {
      if (audioRef.current) {
        audioRef.current.currentTime = seconds;
        onTimeUpdate(seconds);
      }
    } else {
      try {
        if (playerRef.current && playerRef.current.seekTo) {
          playerRef.current.seekTo(seconds, true);
          onTimeUpdate(seconds);
        }
      } catch (e) {}
    }
  };

  return { seekTo, playerStatus };
}
