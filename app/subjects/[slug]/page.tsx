import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserFromAccessToken } from "@/lib/auth";
import { tree } from "@/workflows/subjects";

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
};

export default async function SubjectOverviewPage({ params }: Props) {
  const subject = await db.subject.findUnique({
    where: { slug: params.slug }
  });
  if (!subject || !subject.isPublished) {
    notFound();
  }

  const user = await getCurrentUserFromAccessToken();

  const subjectTree = await tree(subject.id, user?.id);
  if (!subjectTree) {
    notFound();
  }

  const firstUnlockedVideo =
    subjectTree.sections
      .flatMap((s) => s.videos)
      .find((v) => !v.locked) ?? null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Subject</div>
          <h1 className="page-title">{subject.title}</h1>
          <p className="page-subtitle">{subject.description}</p>
        </div>
        <div className="subject-cta">
          <div className="subject-price">
            <span className="subject-price-label">Course price</span>
            <span className="subject-price-value">
              ₹{(subject.priceCents / 100).toFixed(2)}
            </span>
          </div>
          {firstUnlockedVideo && (
            <Link
              href={`/subjects/${subject.slug}/video/${firstUnlockedVideo.id}`}
              className="btn-primary subject-start-btn"
            >
              Start learning
            </Link>
          )}
        </div>
      </div>

      <div className="overview-layout">
        <section className="overview-main">
          <h2 className="section-title">What you will watch</h2>
          <p className="section-subtitle">
            Complete each video in order to unlock the next, just like a structured
            Udemy course.
          </p>
          <div className="payment-card">
            <div className="payment-title">Payment options</div>
            <p className="payment-subtitle">
              This is a demo LMS – payments are simulated, no real charges.
            </p>
            <div className="payment-badges">
              <span className="payment-badge">Visa</span>
              <span className="payment-badge">Mastercard</span>
              <span className="payment-badge">UPI</span>
              <span className="payment-badge">Netbanking</span>
            </div>
          </div>
        </section>
        <aside className="overview-outline">
          <div className="outline-header">
            <span className="outline-title">Outline</span>
            <span className="outline-subtitle">
              {subjectTree.sections.reduce(
                (acc, s) => acc + s.videos.filter((v) => v.completed).length,
                0
              )}{" "}
              of{" "}
              {subjectTree.sections.reduce(
                (acc, s) => acc + s.videos.length,
                0
              )}{" "}
              completed
            </span>
          </div>
          <div className="outline-body">
            {subjectTree.sections.map((section) => (
              <div key={section.id} className="outline-section">
                <div className="outline-section-title">{section.title}</div>
                {section.videos.map((video) => (
                  <div key={video.id} className="outline-item">
                    <div className="outline-item-left">
                      <span
                        className={
                          video.completed
                            ? "outline-dot outline-dot-complete"
                            : video.locked
                            ? "outline-dot outline-dot-locked"
                            : "outline-dot outline-dot-active"
                        }
                      />
                      <span className="outline-item-title">{video.title}</span>
                    </div>
                    <span className="outline-item-meta">
                      {Math.round(video.durationSeconds / 60)} min
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="outline-footer">
            <span className="outline-note">
              You&apos;ll be guided through videos in order; each unlocks once the
              previous is completed.
            </span>
            <Link href="/subjects" className="outline-link">
              ← Back to all subjects
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

