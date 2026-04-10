import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import FadeIn from '@/components/FadeIn';
import { ArrowLeft, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Activities - Portfolio',
};

export default async function ActivitiesPage() {
  await connectToDatabase();
  const activities = await Activity.find().sort({ date: -1, order: 1 }).lean();
  const activitiesList = activities.map(doc => ({ ...doc, _id: doc._id.toString() }));

  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center">
          <Link
            href="/#activities"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </nav>

      <FadeIn direction="up">
        <main className="max-w-6xl mx-auto px-5 md:px-8 pt-16">
          <section className="pt-20 pb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-stone-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-500">Activities</span>
            </div>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-stone-900 mb-4">
              All Activities
            </h1>
            <p className="text-[15px] md:text-[17px] text-stone-500 leading-relaxed max-w-2xl">
              A collection of events, workshops, achievements, and certifications.
            </p>
          </section>

          {activitiesList.length === 0 ? (
            <p className="text-stone-400 text-center py-16">No activities yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pb-16">
              {activitiesList.map((act) => {
                const dateStr = new Date(act.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                return (
                  <Link
                    key={act._id}
                    href={`/activities/${act._id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-stone-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col"
                  >
                    <div className="relative overflow-hidden bg-stone-100">
                      {act.image ? (
                        <img
                          src={act.image}
                          alt={act.title}
                          className="w-full aspect-[16/10] object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full aspect-[16/10] bg-gradient-to-br from-stone-100 to-stone-200" />
                      )}
                      {act.featured && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-500/90 flex items-center justify-center shadow-md">
                          <Star size={14} fill="white" color="white" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase bg-[#1e3a5f] text-white">
                          {act.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 md:p-6 flex flex-col flex-grow">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-600 mb-2">
                        {dateStr}
                      </span>
                      <h3 className="text-base md:text-lg font-semibold text-stone-900 leading-snug tracking-[-0.02em] mb-2">
                        {act.title}
                      </h3>
                      <p className="text-stone-500 text-sm leading-relaxed flex-grow line-clamp-3">
                        {act.description}
                      </p>
                      <div className="mt-4 pt-3 border-t border-stone-100">
                        <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 group-hover:text-stone-700 transition-colors">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </FadeIn>
    </div>
  );
}
