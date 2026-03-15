import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserFromAccessToken } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUserFromAccessToken();
  if (!user) {
    redirect("/login");
  }

  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      subject: {
        include: {
          sections: {
            include: {
              videos: true
            }
          }
        }
      }
    }
  });

  const allVideos = await db.video.findMany();
  const completedProgress = await db.videoProgress.findMany({
    where: { userId: user.id, isCompleted: true }
  });

  const totalVideos = allVideos.length;
  const completedVideos = completedProgress.length;
  const percentage =
    totalVideos === 0 ? 0 : Math.round((completedVideos / totalVideos) * 100);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Profile</div>
          <h1 className="page-title">{user.name}</h1>
          <p className="page-subtitle">{user.email}</p>
        </div>
      </div>

      <section className="profile-overview">
        <div className="profile-card">
          <div className="profile-progress-header">
            <span className="profile-progress-title">Overall progress</span>
            <span className="profile-progress-value">{percentage}%</span>
          </div>
          <div className="profile-progress-bar">
            <div
              className="profile-progress-bar-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="profile-progress-meta">
            {completedVideos} of {totalVideos} videos completed across{" "}
            {enrollments.length} enrolled subjects.
          </p>
        </div>
      </section>

      <section className="profile-subjects">
        <h2 className="section-title">Your subjects</h2>
        {enrollments.length === 0 && (
          <p className="empty-subtitle">
            You&apos;re not enrolled in any subjects yet.
          </p>
        )}
        <div className="subject-grid">
          {enrollments.map((enrollment) => {
            const subjectVideos = enrollment.subject.sections.flatMap(
              (s) => s.videos
            );
            const subjectCompleted = completedProgress.filter((p) =>
              subjectVideos.some((v) => v.id === p.videoId)
            ).length;
            const subjectPercentage =
              subjectVideos.length === 0
                ? 0
                : Math.round(
                    (subjectCompleted / subjectVideos.length) * 100
                  );
            return (
              <div key={enrollment.subjectId} className="subject-card">
                <div className="subject-card-body">
                  <div className="subject-card-pill">Enrolled</div>
                  <h3 className="subject-card-title">
                    {enrollment.subject.title}
                  </h3>
                  <p className="subject-card-description">
                    {subjectCompleted} of {subjectVideos.length} lessons
                    completed
                  </p>
                </div>
                <div className="subject-card-footer">
                  <span className="subject-card-progress-value">
                    {subjectPercentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

