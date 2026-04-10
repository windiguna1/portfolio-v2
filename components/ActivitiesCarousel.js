'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

export default function ActivitiesCarousel({ activities }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const total = activities.length;

  const goTo = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Auto-scroll every 5s
  useEffect(() => {
    if (isPaused || total <= 1) return;
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, next, total]);

  if (total === 0) return null;

  const current = activities[activeIndex];
  const dateStr = new Date(current.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <style>{`
        .act-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .act-container {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
        }

        /* ── Image Card ── */
        .act-image-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: #1c1917;
          aspect-ratio: 4/3;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        }
        @media (min-width: 768px) {
          .act-image-card {
            aspect-ratio: auto;
            min-height: 340px;
          }
        }
        .act-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .act-image-card img.active {
          opacity: 1;
        }
        .act-image-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(transparent, rgba(0,0,0,0.75));
          z-index: 1;
          pointer-events: none;
        }
        .act-img-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 24px;
          z-index: 2;
        }
        .act-img-title {
          color: white;
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 3px;
          line-height: 1.3;
        }
        .act-img-date {
          color: rgba(255,255,255,0.6);
          font-size: 12px;
        }
        .act-star {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(245,158,11,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(245,158,11,0.4);
        }

        /* ── Detail Card ── */
        .act-detail-card {
          border-radius: 16px;
          border: 1px solid #e7e5e4;
          padding: 28px 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #f8f8f6;
        }
        @media (min-width: 768px) {
          .act-detail-card {
            padding: 36px 40px 32px;
          }
        }

        .act-type-badge {
          display: inline-flex;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #1e3a5f;
          color: white;
        }
        .act-dots-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
        }
        .act-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d6d3d1;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .act-dot.active {
          background: #1e3a5f;
          width: 24px;
          border-radius: 12px;
        }
      `}</style>

      <div
        className="act-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Image Card */}
        <div className="act-image-card">
          {activities.map((act, i) => (
            <img
              key={act._id}
              src={act.image || '/placeholder.jpg'}
              alt={act.title}
              className={i === activeIndex ? 'active' : ''}
            />
          ))}
          <div className="act-img-info">
            <div className="act-img-title">{current.title}</div>
            <div className="act-img-date">{dateStr}</div>
          </div>
          {current.featured && (
            <div className="act-star">
              <Star size={13} fill="white" color="white" />
            </div>
          )}
        </div>

        {/* Detail Card */}
        <div className="act-detail-card">
          <div className="flex items-center gap-3 mb-5" style={{ position: 'relative', zIndex: 1 }}>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-600">
              {dateStr.toUpperCase()}
            </span>
            <span className="act-type-badge">{current.type}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-stone-900 tracking-[-0.02em] mb-4 leading-snug" style={{ position: 'relative', zIndex: 1 }}>
            {current.title}
          </h3>

          <p className="text-stone-500 text-[14px] md:text-[15px] leading-relaxed mb-6 flex-grow" style={{ textAlign: 'justify', position: 'relative', zIndex: 1 }}>
            {current.description}
          </p>

          <div className="flex items-center justify-between mt-auto" style={{ position: 'relative', zIndex: 1 }}>
            <span className="text-[13px] text-stone-400">
              Post {activeIndex + 1} of {total}
            </span>
            <Link
              href={`/activities/${current._id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-stone-800 hover:text-stone-900 transition-colors"
            >
              Read Full Post <ArrowRight size={14} />
            </Link>
          </div>

          {/* Dots */}
          {total > 1 && (
            <div className="act-dots-row" style={{ position: 'relative', zIndex: 1 }}>
              {activities.map((_, i) => (
                <button
                  key={i}
                  className={`act-dot${i === activeIndex ? ' active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to activity ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}