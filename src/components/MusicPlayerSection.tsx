'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ScrollAnimations';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { DEMO_TRACKS, getAudioEngine, type TrackConfig } from '@/lib/audio-engine';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ListMusic,
  Loader2,
} from 'lucide-react';

interface DbTrack {
  id: string;
  title: string;
  titleRu: string;
  description: string | null;
  genre: string | null;
  duration: number | null;
  fileName: string | null;
  audioUrl: string | null;
  order: number;
  isActive: boolean;
}

interface UnifiedTrack {
  id: string;
  title: string;
  titleRu: string;
  genre: string;
  audioUrl: string | null;
  isDemo: boolean;
  demoType?: TrackConfig['type'];
}

function AudioPlayer() {
  const { t, language } = useLanguage();
  const engine = useRef(getAudioEngine());
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showTrackList, setShowTrackList] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allTracks, setAllTracks] = useState<UnifiedTrack[]>([]);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch tracks from database on mount
  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await fetch('/api/tracks');
        if (res.ok) {
          const dbTracks: DbTrack[] = await res.json();

          const dbUnified: UnifiedTrack[] = dbTracks
            .map((t) => ({
              id: t.id,
              title: t.title,
              titleRu: t.titleRu,
              genre: t.genre || 'Unknown',
              audioUrl: t.audioUrl,
              isDemo: false,
            }));

          // Only add demo tracks if no real tracks exist
          if (dbUnified.length > 0) {
            setAllTracks(dbUnified);
          } else {
            const demoUnified: UnifiedTrack[] = DEMO_TRACKS.map((t, i) => ({
              id: `demo-${i}`,
              title: t.title,
              titleRu: t.titleRu,
              genre: t.genre,
              fileName: null,
              isDemo: true,
              demoType: t.type,
            }));
            setAllTracks(demoUnified);
          }
        }
      } catch {
        // Fallback to demo tracks on error
        const demoUnified: UnifiedTrack[] = DEMO_TRACKS.map((t, i) => ({
          id: `demo-${i}`,
          title: t.title,
          titleRu: t.titleRu,
          genre: t.genre,
          fileName: null,
          isDemo: true,
          demoType: t.type,
        }));
        setAllTracks(demoUnified);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTracks();
  }, []);

  // Sync progress for HTML audio
  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      const audio = htmlAudioRef.current;
      if (audio && !audio.paused && audio.duration) {
        setPlaybackProgress(audio.currentTime);
        setPlaybackDuration(audio.duration);
      }
    }, 250);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      engine.current.stop();
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
      }
      stopProgressTracking();
    };
  }, [stopProgressTracking]);

  const currentTrackData = allTracks[currentTrack];
  const trackTitle = currentTrackData
    ? language === 'ru'
      ? currentTrackData.titleRu
      : currentTrackData.title
    : '';
  const trackGenre = currentTrackData?.genre || '';

  const togglePlay = useCallback(() => {
    if (!currentTrackData) return;

    if (isPlaying) {
      if (currentTrackData.isDemo) {
        engine.current.stop();
      } else {
        if (htmlAudioRef.current) htmlAudioRef.current.pause();
      }
      setIsPlaying(false);
      stopProgressTracking();
    } else {
      if (currentTrackData.isDemo) {
        // Stop HTML audio if switching to demo
        if (htmlAudioRef.current) {
          htmlAudioRef.current.pause();
          htmlAudioRef.current = null;
        }
        engine.current.play();
        setIsPlaying(true);
        setPlaybackProgress(0);
        setPlaybackDuration(0);
      } else {
        // Stop engine if switching to real audio
        engine.current.stop();

        if (htmlAudioRef.current && htmlAudioRef.current.src === currentTrackData.audioUrl) {
          htmlAudioRef.current.play();
        } else {
          const audio = new Audio(currentTrackData.audioUrl!);
          audio.volume = isMuted ? 0 : volume;
          audio.onended = () => {
            setIsPlaying(false);
            setPlaybackProgress(0);
            stopProgressTracking();
            // Auto-advance
            const next = (currentTrack + 1) % allTracks.length;
            setCurrentTrack(next);
          };
          audio.onerror = () => {
            setIsPlaying(false);
          };
          audio.play();
          htmlAudioRef.current = audio;
        }
        setIsPlaying(true);
        startProgressTracking();
      }
    }
  }, [isPlaying, currentTrackData, currentTrack, allTracks.length, volume, isMuted, startProgressTracking, stopProgressTracking]);

  const playTrack = useCallback((index: number) => {
    if (index === currentTrack && isPlaying) return;

    const targetTrack = allTracks[index];
    if (!targetTrack) return;

    // Stop current playback
    engine.current.stop();
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
      htmlAudioRef.current = null;
    }
    setIsPlaying(false);
    stopProgressTracking();
    setPlaybackProgress(0);
    setPlaybackDuration(0);

    setCurrentTrack(index);

    // Small delay then play
    setTimeout(() => {
      if (targetTrack.isDemo) {
        engine.current.setCurrentTrackIndex(DEMO_TRACKS.findIndex((d) => d.title === targetTrack.title));
        if (engine.current.getCurrentTrackIndex() === -1) {
          // Fallback: play by index if title doesn't match
          const demoIdx = parseInt(targetTrack.id.replace('demo-', ''));
          engine.current.setCurrentTrackIndex(demoIdx);
        }
        engine.current.play();
        setIsPlaying(true);
      } else {
        const audio = new Audio(targetTrack.audioUrl!);
        audio.volume = isMuted ? 0 : volume;
        audio.onended = () => {
          setIsPlaying(false);
          setPlaybackProgress(0);
          stopProgressTracking();
          const next = (index + 1) % allTracks.length;
          setCurrentTrack(next);
        };
        audio.onerror = () => {
          setIsPlaying(false);
        };
        audio.play();
        htmlAudioRef.current = audio;
        setIsPlaying(true);
        startProgressTracking();
      }
    }, 50);
  }, [currentTrack, isPlaying, allTracks, volume, isMuted, startProgressTracking, stopProgressTracking]);

  const nextTrack = useCallback(() => {
    if (allTracks.length === 0) return;
    const next = (currentTrack + 1) % allTracks.length;
    playTrack(next);
  }, [currentTrack, allTracks.length, playTrack]);

  const prevTrack = useCallback(() => {
    if (allTracks.length === 0) return;
    const prev = (currentTrack - 1 + allTracks.length) % allTracks.length;
    playTrack(prev);
  }, [currentTrack, allTracks.length, playTrack]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (currentTrackData?.isDemo) {
      engine.current.setVolume(v);
    }
    if (htmlAudioRef.current) {
      htmlAudioRef.current.volume = v;
    }
    setIsMuted(v === 0);
  }, [currentTrackData]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(0.5);
      if (currentTrackData?.isDemo) engine.current.setVolume(0.5);
      if (htmlAudioRef.current) htmlAudioRef.current.volume = 0.5;
      setIsMuted(false);
    } else {
      setVolume(0);
      if (currentTrackData?.isDemo) engine.current.setVolume(0);
      if (htmlAudioRef.current) htmlAudioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, currentTrackData]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (allTracks.length === 0) return null;

  const progressPercent = playbackDuration > 0 ? (playbackProgress / playbackDuration) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Player Card */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        {/* Visualizer */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-b from-amber-500/5 to-transparent overflow-hidden">
          <WaveformVisualizer isPlaying={isPlaying} barCount={60} color="#D4AF37" />
          
          {/* Track info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-sm font-medium text-white truncate">{trackTitle}</p>
            <p className="text-xs text-amber-400/70">{trackGenre}</p>
          </div>
        </div>

        {/* Progress bar */}
        {currentTrackData && !currentTrackData.isDemo ? (
          <div className="relative h-1 bg-white/5 group cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="absolute top-0 left-0 right-0 flex justify-between px-2 -mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-zinc-500">
              <span>{formatTime(playbackProgress)}</span>
              <span>{formatTime(playbackDuration)}</span>
            </div>
          </div>
        ) : (
          <div className="h-1 bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
              initial={{ width: '0%' }}
              animate={isPlaying ? { width: '100%' } : { width: '0%' }}
              transition={isPlaying ? { duration: 30, ease: 'linear' } : { duration: 0.3 }}
              key={currentTrack + (isPlaying ? 'playing' : 'paused')}
            />
          </div>
        )}

        <CardContent className="p-4">
          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTrack}
              className="text-zinc-400 hover:text-white hover:bg-white/10 h-10 w-10"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              onClick={togglePlay}
              className="h-14 w-14 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-400/30 transition-all"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextTrack}
              className="text-zinc-400 hover:text-white hover:bg-white/10 h-10 w-10"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume & Tracklist toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white hover:bg-white/10 h-8 w-8"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 sm:w-28 accent-amber-500 h-1 cursor-pointer"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTrackList(!showTrackList)}
              className="text-zinc-400 hover:text-amber-400 hover:bg-white/10 gap-1.5 text-xs"
            >
              <ListMusic className="h-4 w-4" />
              <span className="hidden sm:inline">
                {allTracks.length} tracks
              </span>
            </Button>
          </div>
        </CardContent>

        {/* Track List */}
        <AnimatePresence>
          {showTrackList && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="max-h-96 overflow-y-auto p-2 space-y-0.5">
                {allTracks.map((track, i) => {
                  const title = language === 'ru' ? track.titleRu : track.title;
                  const isActive = i === currentTrack;
                  return (
                    <button
                      key={track.id}
                      onClick={() => playTrack(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-amber-500/10 border border-amber-500/20'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-white/5">
                        {isActive && isPlaying ? (
                          <div className="flex gap-[2px] items-end h-4">
                            {[1, 2, 3].map((bar) => (
                              <div
                                key={bar}
                                className="w-[3px] bg-amber-400 rounded-full animate-pulse"
                                style={{
                                  height: `${Math.random() * 100}%`,
                                  animationDelay: `${bar * 100}ms`,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <Music className="h-3.5 w-3.5 text-zinc-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isActive ? 'text-amber-400' : 'text-zinc-300'
                        }`}>
                          {title}
                        </p>
                        <p className="text-xs text-zinc-500">{track.genre}</p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

export function MusicPlayerSection() {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.015] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.player.sectionTitle}
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mb-4" />
            <p className="text-zinc-400 max-w-2xl mx-auto">
              {t.player.sectionSubtitle}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <AudioPlayer />
        </ScrollAnimation>
      </div>
    </section>
  );
}
