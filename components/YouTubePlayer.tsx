"use client";

import { useRef, useState } from "react";
import YouTube from "react-youtube";

type Props = {
  videoId: number;
  youtubeVideoId: string;
  initialPositionSeconds: number;
  durationSeconds: number;
  userId: number;
  nextVideoUrl?: string | null;
  updateProgress: any;
};

export default function YouTubePlayer({
  youtubeVideoId,
  videoId,
  initialPositionSeconds,
  durationSeconds,
  userId,
  nextVideoUrl,
  updateProgress
}: Props) {
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const onReady = (event: any) => {
    console.log('YouTube player ready');
    setReady(true);
    if (initialPositionSeconds > 0) {
      event.target.seekTo(initialPositionSeconds);
    }
  };

  const onStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      // Start tracking progress
      const interval = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          const isCompleted = currentTime >= durationSeconds * 0.9;
          updateProgress({
            videoId,
            userId,
            lastPositionSeconds: Math.floor(currentTime),
            isCompleted
          });
        }
      }, 5000); // Update every 5 seconds

      // Clear interval on pause or end
      const clearOnPause = () => clearInterval(interval);
      const clearOnEnd = () => clearInterval(interval);

      playerRef.current.addEventListener('onStateChange', (e: any) => {
        if (e.data === YouTube.PlayerState.PAUSED || e.data === YouTube.PlayerState.ENDED) {
          clearInterval(interval);
        }
      });
    }
  };

  const onError = (error: any) => {
    console.error('YouTube player error:', error);
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black flex items-center justify-center">
      {!ready && <div className="text-white">Loading video...</div>}
      <YouTube
        ref={playerRef}
        videoId={youtubeVideoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
      />
    </div>
  );
}

