import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Experience from '@/models/Experience';
import Project from '@/models/Project';
import FadeIn from '@/components/FadeIn';

export const dynamic = 'force-dynamic';

async function getData() {
  await connectToDatabase();
  
  const [profile, experiences, projects] = await Promise.all([
    Profile.findOne().lean(),
    Experience.find().sort({ startDate: -1 }).lean(),
    Project.find().sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  return {
    profile: profile || {
      name: 'Your Name',
      title: 'Your Job Title',
      bio: 'Your biography goes here. Tell the world what you do.',
    },
    experiences: experiences.map(doc => ({...doc, _id: doc._id.toString()})),
    projects: projects.map(doc => ({...doc, _id: doc._id.toString()}))
  };
}

export default async function Home() {
  const { profile, experiences, projects } = await getData();

  return (
    <div>
      <nav className="container portfolio-header">
        <div className="logo">{profile.name}</div>
        <div className="nav-links">
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          {profile.resumeLink && (
            <a href={profile.resumeLink} target="_blank" rel="noreferrer">Resume</a>
          )}
        </div>
      </nav>

      <main className="container">
        {/* Hero Section */}
        <FadeIn direction="up" delay={0.2}>
          <section className="hero">
            <h1>{profile.title}</h1>
            <p>{profile.bio}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">View Work</a>
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="btn btn-secondary">Get in Touch</a>
              )}
            </div>
          </section>
        </FadeIn>

        {/* Experience Section */}
        {experiences.length > 0 && (
          <FadeIn direction="up" delay={0.3}>
            <section id="experience" className="section">
              <h2 className="section-title">Work Experience</h2>
              <div className="timeline">
                {experiences.map((exp) => (
                  <div key={exp._id} className="timeline-item">
                    <div className="timeline-date">
                      {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                    </div>
                    <div className="timeline-content">
                      <h3>{exp.role}</h3>
                      <h4>{exp.company}</h4>
                      <p>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <FadeIn direction="up" delay={0.4}>
            <section id="projects" className="section">
              <h2 className="section-title">Selected Projects</h2>
              <div className="projects-grid">
                {projects.map((proj) => (
                  <Link key={proj._id} href={`/projects/${proj._id}`} className="project-card">
                    {proj.images && proj.images.length > 0 ? (
                      <img src={proj.images[0]} alt={proj.title} className="project-img" />
                    ) : (
                      <div className="project-img" /> // Placeholder
                    )}
                    <div className="project-info">
                      <h3>{proj.title}</h3>
                      <p>{proj.description}</p>
                      <span style={{ color: 'var(--accent)', fontWeight: 500, fontSize: '0.9rem' }}>Read case study →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </main>

      <footer className="footer container">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>
          {profile.github && <a href={profile.github} style={{margin:'0 0.5rem'}}>GitHub</a>}
          {profile.linkedin && <a href={profile.linkedin} style={{margin:'0 0.5rem'}}>LinkedIn</a>}
        </p>
      </footer>
    </div>
  );
}
