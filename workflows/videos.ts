"use server";

import { db } from "@/lib/db";

export async function get(videoId: number, userId?: number) {
  const video = await db.video.findUnique({
    where: { id: videoId },
    include: {
      section: {
        include: {
          subject: true,
          videos: {
            orderBy: { orderIndex: "asc" }
          }
        }
      }
    }
  });

  if (!video || !video.section.subject.isPublished) return null;

  const sections = await db.section.findMany({
    where: { subjectId: video.section.subjectId },
    orderBy: { orderIndex: "asc" },
    include: {
      videos: {
        orderBy: { orderIndex: "asc" }
      }
    }
  });

  const orderedVideos = sections.flatMap((s) => s.videos);
  const currentIndex = orderedVideos.findIndex((v) => v.id === video.id);
  const previousVideo = currentIndex > 0 ? orderedVideos[currentIndex - 1] : null;
  const nextVideo =
    currentIndex >= 0 && currentIndex < orderedVideos.length - 1
      ? orderedVideos[currentIndex + 1]
      : null;

  let progressForCurrent: { lastPositionSeconds: number; isCompleted: boolean } | null =
    null;
  let previousCompleted = true;

  if (userId) {
    const progress = await db.videoProgress.findMany({
      where: {
        userId,
        videoId: {
          in: [video.id, previousVideo?.id ?? -1]
        }
      }
    });

    progressForCurrent =
      progress
        .filter((p) => p.videoId === video.id)
        .map((p) => ({
          lastPositionSeconds: p.lastPositionSeconds,
          isCompleted: p.isCompleted
        }))[0] ?? null;

    if (previousVideo) {
      previousCompleted =
        progress.find((p) => p.videoId === previousVideo.id)?.isCompleted ?? false;
    }
  }

  const locked = !previousCompleted;

  return {
    video,
    subject: video.section.subject,
    previousVideoId: previousVideo?.id ?? null,
    nextVideoId: nextVideo?.id ?? null,
    locked,
    lockedReason: locked
      ? "Complete the previous video to unlock this one."
      : null,
    progress: progressForCurrent ?? {
      lastPositionSeconds: 0,
      isCompleted: false
    }
  };
}

