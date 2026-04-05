import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { ArrowLeft, ExternalLink, Github, Lock } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ImageGallery from './ImageGallery';
import TechStackMarquee from '@/components/TechStackMarquee';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const project = await Project.findById(id).lean();
  return {
    title: project ? `${project.title} - Portfolio` : 'Project Not Found',
  };
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const projectDoc = await Project.findById(id).lean();
  const project = projectDoc ? JSON.parse(JSON.stringify(projectDoc)) : null;

  if (!project) {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8] flex items-center justify-center"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-400 mb-4">404</p>
          <h2 className="text-2xl font-semibold text-stone-900 tracking-[-0.02em] mb-6">Project Not Found</h2>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 transition-all">
            <ArrowLeft size={14} /> Return Home
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images ?? [];
  const techStack = project.techStack ?? [];

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        /* ── Markdown prose ── */
        .md-content { color: #57534e; font-size: 16px; line-height: 1.85; }
        .md-content h1 { font-size: 1.75rem; font-weight: 600; color: #1c1917; letter-spacing: -0.03em; margin: 2.5rem 0 1rem; }
        .md-content h2 { font-size: 1.35rem; font-weight: 600; color: #1c1917; letter-spacing: -0.02em; margin: 2rem 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e7e5e4; }
        .md-content h3 { font-size: 1.05rem; font-weight: 600; color: #292524; letter-spacing: -0.01em; margin: 1.5rem 0 0.5rem; }
        .md-content h4 { font-size: 0.95rem; font-weight: 600; color: #44403c; margin: 1.25rem 0 0.4rem; }
        .md-content p { margin: 0 0 1.25rem; }
        .md-content a { color: #1c1917; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #d6d3d1; transition: text-decoration-color 0.2s; }
        .md-content a:hover { text-decoration-color: #57534e; }
        .md-content strong { color: #292524; font-weight: 600; }
        .md-content em { font-style: italic; }
        .md-content ul { list-style: disc; padding-left: 1.4rem; margin: 0 0 1.25rem; }
        .md-content ol { list-style: decimal; padding-left: 1.4rem; margin: 0 0 1.25rem; }
        .md-content li { margin-bottom: 0.35rem; }
        .md-content li > ul, .md-content li > ol { margin-top: 0.35rem; margin-bottom: 0; }
        .md-content blockquote {
          border-left: 3px solid #d6d3d1;
          padding: 0.5rem 0 0.5rem 1.25rem;
          margin: 1.5rem 0;
          color: #78716c;
          font-style: italic;
        }
        .md-content blockquote p { margin: 0; }
        .md-content code {
          font-family: 'DM Mono', 'Fira Code', monospace;
          font-size: 0.85em;
          background: #f5f5f4;
          border: 1px solid #e7e5e4;
          border-radius: 5px;
          padding: 0.15em 0.4em;
          color: #292524;
        }
        .md-content pre {
          background: #1c1917;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .md-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: #d6d3d1;
          font-size: 0.875rem;
          line-height: 1.7;
        }
        .md-content hr { border: none; border-top: 1px solid #e7e5e4; margin: 2.5rem 0; }
        .md-content img { width: 100%; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #e7e5e4; }
        .md-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
        .md-content th { text-align: left; font-weight: 600; color: #292524; padding: 0.6rem 0.875rem; border-bottom: 2px solid #e7e5e4; }
        .md-content td { padding: 0.6rem 0.875rem; border-bottom: 1px solid #f5f5f4; }
        .md-content tr:last-child td { border-bottom: none; }
        .md-content tr:hover td { background: #fafaf8; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Projects
          </Link>
        </div>
      </nav>

      <FadeIn direction="up">
        <main className="max-w-5xl mx-auto px-8 pt-16">

          {/* ── Header ── */}
          <section className="pt-20 pb-12 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-stone-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">Case Study</span>
            </div>

            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-stone-900 mb-6">
              {project.title}
            </h1>

            <p className="text-[17px] text-stone-500 leading-relaxed" style={{ textAlign: 'justify' }}>
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-all hover:-translate-y-0.5"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 hover:bg-white transition-all hover:-translate-y-0.5"
                >
                  <Github size={14} /> Source Code
                </a>
              )}
              {project.proprietary && (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold">
                  <Lock size={13} /> Proprietary Project
                </span>
              )}
            </div>
          </section>

          {/* ── Video Player ── */}
          {(project.youtubeUrl || project.videoUrl) && (
            <section className="py-8">
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-sm aspect-video flex items-center justify-center relative z-10">
                {project.youtubeUrl ? (
                  <iframe
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(project.youtubeUrl)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={project.videoUrl} controls controlsList="nodownload" className="w-full h-full outline-none" />
                )}
              </div>
            </section>
          )}

          {/* ── Gallery ── */}
          {images.length > 0 && (
            <ImageGallery images={images} title={project.title} />
          )}

          {/* ── Tech Stack ── */}
          {techStack.length > 0 && (
            <TechStackMarquee techStack={techStack} />
          )}

          {/* ── Markdown Content ── */}
          {project.content && (
            <section className="py-12 max-w-3xl">
              <div className="md-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.content}
                </ReactMarkdown>
              </div>
            </section>
          )}

          {/* ── Footer ── */}
          <footer className="py-16 mt-8 border-t border-stone-200">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-700 hover:bg-white transition-all"
            >
              <ArrowLeft size={14} /> Browse more projects
            </Link>
          </footer>
        </main>
      </FadeIn>
    </div>
  );
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : url; // fallback
}