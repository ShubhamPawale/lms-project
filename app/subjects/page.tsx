import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUserFromAccessToken } from "@/lib/auth";

export default async function SubjectsPage() {
  const user = await getCurrentUserFromAccessToken();

  const subjects = await db.subject.findMany({
    where: { isPublished: true },
    include: {
      sections: {
        include: {
          videos: true
        }
      },
      enrollments: user
        ? {
            where: { userId: user.id }
          }
        : false
    },
    orderBy: { title: "asc" }
  });

  let completedBySubject: Record<number, { completed: number; total: number }> =
    {};

  if (user) {
    const progress = await db.videoProgress.findMany({
      where: { userId: user.id, isCompleted: true }
    });
    const completedVideoIds = new Set(progress.map((p) => p.videoId));

    subjects.forEach((subject) => {
      const allVideos = subject.sections.flatMap((s) => s.videos);
      const total = allVideos.length;
      const completed = allVideos.filter((v) =>
        completedVideoIds.has(v.id)
      ).length;
      completedBySubject[subject.id] = { completed, total };
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse subjects</h1>
          <p className="page-subtitle">
            Structured video courses with strict progression, similar to Udemy’s
            learning view.
          </p>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-title">No subjects yet</h2>
          <p className="empty-subtitle">
            Once you seed the database, your published subjects will appear here as
            rich course cards with progress and thumbnails.
          </p>
        </div>
      ) : (
        <div className="subject-grid">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/subjects/${subject.slug}`}
              className="subject-card"
            >
              <div className="subject-card-body">
                <div
                  className={`subject-card-thumb thumb-${subject.thumbnailKey ?? "default"}`}
                  aria-hidden="true"
                />
                <div className="subject-card-pill">Subject</div>
                <h2 className="subject-card-title">{subject.title}</h2>
                <p className="subject-card-description">
                  {subject.description}
                </p>
              </div>
              <div className="subject-card-footer">
                <span className="subject-card-link">
                  ₹{(subject.priceCents / 100).toFixed(2)}
                </span>
                {user && completedBySubject[subject.id] ? (
                  <span className="subject-card-progress-value">
                    {Math.round(
                      (completedBySubject[subject.id].completed /
                        Math.max(completedBySubject[subject.id].total, 1)) *
                        100
                    )}
                    % complete
                  </span>
                ) : (
                  <span className="subject-card-progress-value">
                    Not started
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

