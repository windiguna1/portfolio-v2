import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import FadeIn from '@/components/FadeIn';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Projects',
  description: 'Browse all projects and case studies.',
};

async function getProjects() {
  await connectToDatabase();
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(projects));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </nav>

      <FadeIn direction="up">
        <main className="max-w-6xl mx-auto px-5 md:px-8 pt-12 pb-20">
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-stone-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">All Projects</span>
            </div>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-stone-900">
              Selected Projects
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {projects.map((proj) => (
              <Link
                key={proj._id}
                href={`/projects/${proj._id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-stone-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col"
              >
                <div className="overflow-hidden bg-stone-100">
                  {proj.images && proj.images.length > 0 ? (
                    <img
                      src={proj.images[0]}
                      alt={proj.title}
                      className="w-full aspect-[16/10] object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full aspect-[16/10] bg-gradient-to-br from-stone-100 to-stone-200" />
                  )}
                </div>

                <div className="p-5 md:p-7 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-2.5 md:mb-3">
                    <h3 className="text-base md:text-lg font-semibold text-stone-900 leading-snug tracking-[-0.02em]">{proj.title}</h3>
                    <span className="flex-shrink-0 ml-3 mt-0.5 text-stone-300 group-hover:text-stone-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-lg">↗</span>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed flex-grow">{proj.description}</p>
                  {proj.proprietary && (
                    <div className="mt-3">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">Proprietary</span>
                    </div>
                  )}
                  <div className="mt-5 md:mt-6 pt-4 md:pt-5 border-t border-stone-100">
                    <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 group-hover:text-stone-700 transition-colors">Read case study</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="text-stone-500 text-center py-16">No projects found.</p>
          )}
        </main>
      </FadeIn>
    </div>
  );
}
