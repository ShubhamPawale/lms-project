"use server";

import { db } from "@/lib/db";
import { getCurrentUserFromAccessToken } from "@/lib/auth";

export async function list() {
  const subjects = await db.subject.findMany({
    where: { isPublished: true },
    orderBy: { title: "asc" }
  });
  return subjects;
}

export async function tree(subjectId: number, userId?: number) {
  const subject = await db.subject.findUnique({
    where: { id: subjectId }
  });
  if (!subject || !subject.isPublished) {
    return null;
  }

  const sections = await db.section.findMany({
    where: { subjectId: subject.id },
    orderBy: { orderIndex: "asc" },
    include: {
      videos: {
        orderBy: { orderIndex: "asc" }
      }
    }
  });

  let progressByVideoId: Record<
    number,
    { lastPositionSeconds: number; isCompleted: boolean }
  > = {};

  if (userId) {
    const progress = await db.videoProgress.findMany({
      where: { userId, video: { section: { subjectId: subject.id } } }
    });
    progressByVideoId = Object.fromEntries(
      progress.map((p) => [
        p.videoId,
        { lastPositionSeconds: p.lastPositionSeconds, isCompleted: p.isCompleted }
      ])
    );
  }

  const orderedVideos = sections.flatMap((section) =>
    section.videos.map((v) => ({ sectionId: section.id, video: v }))
  );

  const resultSections = sections.map((section) => {
    return {
      id: section.id,
      title: section.title,
      orderIndex: section.orderIndex,
      videos: section.videos.map((video) => {
        const idx = orderedVideos.findIndex((v) => v.video.id === video.id);
        const previous = idx > 0 ? orderedVideos[idx - 1].video : null;
        const previousCompleted = previous
          ? progressByVideoId[previous.id]?.isCompleted ?? false
          : true;
        const progress = progressByVideoId[video.id];
        const completed = progress?.isCompleted ?? false;
        const locked = !previousCompleted;

        return {
          id: video.id,
          title: video.title,
          description: video.description,
          youtubeVideoId: video.youtubeVideoId,
          durationSeconds: video.durationSeconds,
          orderIndex: video.orderIndex,
          locked,
          completed,
          lastPositionSeconds: progress?.lastPositionSeconds ?? 0
        };
      })
    };
  });

  return {
    subject,
    sections: resultSections
  };
}

export async function listForCurrentUser() {
  const user = await getCurrentUserFromAccessToken();
  if (!user) return [];

  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      subject: true
    }
  });

  return enrollments.map((e) => e.subject);
}

