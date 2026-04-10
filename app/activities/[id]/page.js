import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { ArrowLeft } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const activity = await Activity.findById(id).lean();
  return {
    title: activity ? `${activity.title} - Portfolio` : 'Activity Not Found',
  };
}

export default async function ActivityDetailPage({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const activity = await Activity.findById(id).lean();

  if (!activity) {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8] flex items-center justify-center"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400 mb-4">404</p>
          <h2 className="text-2xl font-semibold text-stone-900 tracking-[-0.02em] mb-6">Activity Not Found</h2>
          <Link href="/activities" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 transition-all">
            <ArrowLeft size={14} /> Back to Activities
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date(activity.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .md-content { color: #57534e; font-size: 16px; line-height: 1.85; }
        .md-content h1 { font-size: 1.75rem; font-weight: 600; color: #1c1917; letter-spacing: -0.03em; margin: 2.5rem 0 1rem; }
        .md-content h2 { font-size: 1.35rem; font-weight: 600; color: #1c1917; letter-spacing: -0.02em; margin: 2rem 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e7e5e4; }
        .md-content h3 { font-size: 1.05rem; font-weight: 600; color: #292524; letter-spacing: -0.01em; margin: 1.5rem 0 0.5rem; }
        .md-content p { margin: 0 0 1.25rem; }
        .md-content a { color: #1c1917; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #d6d3d1; }
        .md-content a:hover { text-decoration-color: #57534e; }
        .md-content strong { color: #292524; font-weight: 600; }
        .md-content ul { list-style: disc; padding-left: 1.4rem; margin: 0 0 1.25rem; }
        .md-content ol { list-style: decimal; padding-left: 1.4rem; margin: 0 0 1.25rem; }
        .md-content li { margin-bottom: 0.35rem; }
        .md-content blockquote { border-left: 3px solid #d6d3d1; padding: 0.5rem 0 0.5rem 1.25rem; margin: 1.5rem 0; color: #78716c; font-style: italic; }
        .md-content blockquote p { margin: 0; }
        .md-content code { font-family: 'DM Mono', monospace; font-size: 0.85em; background: #f5f5f4; border: 1px solid #e7e5e4; border-radius: 5px; padding: 0.15em 0.4em; color: #292524; }
        .md-content pre { background: #1c1917; border-radius: 12px; padding: 1.25rem 1.5rem; overflow-x: auto; margin: 1.5rem 0; }
        .md-content pre code { background: none; border: none; padding: 0; color: #d6d3d1; font-size: 0.875rem; }
        .md-content hr { border: none; border-top: 1px solid #e7e5e4; margin: 2.5rem 0; }
        .md-content img { width: 100%; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #e7e5e4; }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center">
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Activities
          </Link>
        </div>
      </nav>

      <FadeIn direction="up">
        <main className="max-w-5xl mx-auto px-5 md:px-8 pt-16">
          {/* Header */}
          <section className="pt-20 pb-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-stone-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">Activity</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-600">
                {dateStr}
              </span>
              <span className="inline-flex px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase bg-[#1e3a5f] text-white">
                {activity.type}
              </span>
            </div>

            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-stone-900 mb-6">
              {activity.title}
            </h1>

            <p className="text-[16px] md:text-[17px] text-stone-500 leading-relaxed" style={{ textAlign: 'justify' }}>
              {activity.description}
            </p>
          </section>

          {/* Image */}
          {activity.image && (
            <section className="py-6">
              <div className="rounded-2xl overflow-hidden border border-stone-200/80">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </section>
          )}

          {/* Markdown Content */}
          {activity.content && (
            <section className="py-8 max-w-3xl">
              <div className="md-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activity.content}
                </ReactMarkdown>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="py-16 mt-8 border-t border-stone-200">
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 hover:bg-white transition-all"
            >
              <ArrowLeft size={14} /> Browse more activities
            </Link>
          </footer>
        </main>
      </FadeIn>
    </div>
  );
}
