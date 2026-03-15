import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUserFromAccessToken } from "@/lib/auth";
import { tree } from "@/workflows/subjects";
import { get as getVideo } from "@/workflows/videos";
import { update as updateProgress } from "@/workflows/progress";
import YouTubePlayer from "@/components/YouTubePlayer";

type Props = {
  params: { slug: string; videoId: string };
};

export default async function LearningViewPage({ params }: Props) {
  const user = await getCurrentUserFromAccessToken();
  if (!user) {
    redirect("/login");
  }

  const subject = await db.subject.findUnique({
    where: { slug: params.slug },
  });
  if (!subject || !subject.isPublished) {
    notFound();
  }

  // Ensure enrollment exists when user starts watching this subject
  await db.enrollment.upsert({
    where: {
      userId_subjectId: {
        userId: user.id,
        subjectId: subject.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      subjectId: subject.id,
    },
  });

  const videoId = Number(params.videoId);
  if (Number.isNaN(videoId)) {
    notFound();
  }

  const videoInfo = await getVideo(videoId, user.id);
  if (!videoInfo) {
    notFound();
  }

  if (videoInfo.locked) {
    redirect(`/subjects/${subject.slug}`);
  }

  const subjectTree = await tree(subject.id, user.id);
  if (!subjectTree) {
    notFound();
  }

  const allVideos = subjectTree.sections.flatMap((s) => s.videos);
  const currentIndex = allVideos.findIndex((v) => v.id === videoId);
  const previous = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < allVideos.length - 1
      ? allVideos[currentIndex + 1]
      : null;

  const progress = videoInfo.progress;

  // Cleaned and fixed handleCompleted function
  async function handleCompleted() {
    "use server";

    if (!subject) {
      // Subject is null, redirect to homepage
      redirect(`/`);
    }

    if (next) {
      // Go to next video
      redirect(`/subjects/${subject.slug}/video/${next.id}`);
    } else {
      // No next video, go back to subject overview
      redirect(`/subjects/${subject.slug}`);
    }
  }

  return (
    <div className="learning-shell">
      <div className="learning-main">
        <div className="learning-header">
          <div>
            <div className="eyebrow">{subject.title}</div>
            <h1 className="learning-title">{videoInfo.video.title}</h1>
            <p className="learning-meta">
              {Math.round(videoInfo.video.durationSeconds / 60)} min •{" "}
              {progress.isCompleted ? "Completed" : "In progress"}
            </p>
          </div>
        </div>

        <div className="learning-player">
          <YouTubePlayer
            videoId={videoInfo.video.id}
            youtubeVideoId={videoInfo.video.youtubeVideoId}
            initialPositionSeconds={progress.lastPositionSeconds}
            durationSeconds={videoInfo.video.durationSeconds}
            userId={user.id}
            nextVideoUrl={next ? `/subjects/${subject.slug}/video/${next.id}` : null}
            updateProgress={updateProgress}
          />
        </div>

        <div className="learning-controls">
          <Link href={`/subjects/${subject.slug}`} className="outline-link">
            ← Back to overview
          </Link>
          <div className="learning-nav-buttons">
            {previous && (
              <Link
                href={`/subjects/${subject.slug}/video/${previous.id}`}
                className="btn-secondary text-xs"
              >
                Previous
              </Link>
            )}
            {next && (
              <form action={handleCompleted}>
                <button type="submit" className="btn-primary text-xs">
                  Next video
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <aside className="learning-sidebar">
        <div className="outline-header">
          <span className="outline-title">Course content</span>
          <span className="outline-subtitle">
            {allVideos.filter((v) => v.completed).length} of {allVideos.length} completed
          </span>
        </div>
        <div className="outline-body">
          {subjectTree.sections.map((section) => (
            <div key={section.id} className="outline-section">
              <div className="outline-section-title">{section.title}</div>
              {section.videos.map((video) => {
                const isCurrent = video.id === videoId;
                const locked = video.locked;
                const baseClass = locked
                  ? "outline-item outline-item-locked"
                  : isCurrent
                  ? "outline-item outline-item-current"
                  : "outline-item";
                return (
                  <Link
                    key={video.id}
                    href={locked ? "#" : `/subjects/${subject.slug}/video/${video.id}`}
                    className={baseClass}
                  >
                    <div className="outline-item-left">
                      <span
                        className={
                          video.completed
                            ? "outline-dot outline-dot-complete"
                            : locked
                            ? "outline-dot outline-dot-locked"
                            : "outline-dot outline-dot-active"
                        }
                      />
                      <span className="outline-item-title">{video.title}</span>
                    </div>
                    <span className="outline-item-meta">
                      {Math.round(video.durationSeconds / 60)} min
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}