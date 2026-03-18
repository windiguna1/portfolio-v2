import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';

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
  const project = await Project.findById(id).lean();

  if (!project) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Project Not Found</h2>
        <Link href="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <FadeIn direction="up">
        <nav className="portfolio-header">
          <Link href="/#projects" className="btn btn-secondary" style={{ border: 'none', padding: '0.5rem 0', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Projects
          </Link>
        </nav>

        <article className="project-detail-hero">
          <h1>{project.title}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px' }}>
            {project.description}
          </p>

          <div className="project-links">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <ExternalLink size={16} style={{ marginRight: '0.5rem' }} /> Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                <Github size={16} style={{ marginRight: '0.5rem' }} /> Source Code
              </a>
            )}
          </div>
        </article>

        {project.images && project.images.length > 0 && (
          <section className="project-gallery">
            {project.images.map((img, i) => (
              <img key={i} src={img} alt={`${project.title} screenshot ${i + 1}`} className="gallery-img" />
            ))}
          </section>
        )}

        {project.content && (
          <section className="section" style={{ paddingTop: 0, maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.8 }}>
              {project.content}
            </div>
          </section>
        )}

        <footer className="footer" style={{ borderTop: 'none', margin: '2rem 0', textAlign: 'center' }}>
          <Link href="/#projects" className="btn btn-secondary">Browse more projects</Link>
        </footer>
      </FadeIn>
    </div>
  );
}
