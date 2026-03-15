"use server";

import { db } from "@/lib/db";

export async function update(input: {
  videoId: number;
  userId: number;
  lastPositionSeconds: number;
  isCompleted: boolean;
}) {
  const video = await db.video.findUnique({
    where: { id: input.videoId }
  });
  if (!video) {
    return { ok: false as const, error: "Video not found" as const };
  }

  const cappedSeconds = Math.min(
    Math.max(0, Math.floor(input.lastPositionSeconds)),
    video.durationSeconds
  );

  await db.videoProgress.upsert({
    where: {
      userId_videoId: {
        userId: input.userId,
        videoId: input.videoId
      }
    },
    update: {
      lastPositionSeconds: input.isCompleted ? video.durationSeconds : cappedSeconds,
      isCompleted: input.isCompleted
    },
    create: {
      userId: input.userId,
      videoId: input.videoId,
      lastPositionSeconds: input.isCompleted ? video.durationSeconds : cappedSeconds,
      isCompleted: input.isCompleted
    }
  });

  return { ok: true as const };
}

