'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getCleanUrl = (url) => {
  if (!url) return '';
  if (url.includes('google.com/imgres')) {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('imgurl') || url;
    } catch {
      return url;
    }
  }
  return url;
};

export default function ProjectsCarousel({ projects }) {
  const total = projects.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const trackRef = useRef(null);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setPerView(window.innerWidth >= 768 ? 2 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build extended slides: [...lastN, ...original, ...firstN]
  const cloneCount = perView;
  const extendedProjects = [
    ...projects.slice(-cloneCount),
    ...projects,
    ...projects.slice(0, cloneCount),
  ];

  const slideWidth = perView === 2 ? 50 : 100;

  const getTranslateX = (idx) => {
    return -((idx + cloneCount) * slideWidth);
  };

  const truncateDesc = (text) => {
    if (!text) return '';
    const maxLength = 110;
    if (text.length > maxLength) {
      return text.substring(0, maxLength).trim() + ' ...';
    }
    return text;
  };

  const next = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const resetAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (total > 1) {
      intervalRef.current = setInterval(next, 5000);
    }
  }, [next, total]);

  const handleNext = useCallback(() => {
    next();
    resetAutoScroll();
  }, [next, resetAutoScroll]);

  const handlePrev = useCallback(() => {
    prev();
    resetAutoScroll();
  }, [prev, resetAutoScroll]);

  const handleDot = useCallback((i) => {
    setIsTransitioning(true);
    setCurrentIndex(i);
    resetAutoScroll();
  }, [resetAutoScroll]);

  // Handle infinite loop snap-back
  useEffect(() => {
    if (currentIndex >= total) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (currentIndex < 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(total - 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, total]);

  // Re-enable transition after snap-back
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Auto-scroll every 5s
  useEffect(() => {
    if (isPaused || total <= 1) return;
    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, next, total]);

  // Dot index (normalized)
  const dotIndex = ((currentIndex % total) + total) % total;

  if (total === 0) return null;

  return (
    <>
      <style>{`
        /* Outer wrapper: handles hover padding trick */
        .proj-carousel {
          position: relative;
          padding: 40px 20px;
          margin: -40px -20px;
        }

        /* Inner wrapper: clips the sliding track only */
        .proj-carousel-inner {
          overflow: hidden;
          border-radius: 20px;
        }

        .proj-track {
          display: flex;
        }
        .proj-track.animating {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .proj-slide {
          flex: 0 0 100%;
          width: 100%;
          padding: 0 6px;
          box-sizing: border-box;
        }
        .proj-slide:hover {
          position: relative;
          z-index: 10;
        }
        @media (min-width: 768px) {
          .proj-slide {
            flex: 0 0 50%;
            width: 50%;
            padding: 0 8px;
          }
        }
        .proj-card {
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid #e7e5e4;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
        }
        .proj-card:hover {
          border-color: #d6d3d1;
          box-shadow: 0 8px 40px rgba(0,0,0,0.08);
        }
        .proj-card-img {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: #f5f5f4;
          /* Isolate stacking context so hover shadow doesn't bleed outside card */
          isolation: isolate;
        }
        @media (min-width: 768px) {
          .proj-card-img {
            height: 260px;
          }
        }
        .proj-card-img img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        .proj-card-img .proj-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f4, #e7e5e4);
        }
        .proj-card:hover .proj-card-img img {
          transform: scale(1.03);
        }
        .proj-nav-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e7e5e4;
          color: #44403c;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .proj-nav-btn:hover {
          background: #f5f5f4;
          border-color: #d6d3d1;
          color: #1c1917;
        }
        .proj-dot {
          width: 6px; height: 6px;
          border-radius: 9999px;
          background: #d6d3d1;
          transition: all 0.25s ease;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .proj-dot.active {
          width: 22px;
          background: #292524;
        }
      `}</style>

      <div
        className="proj-carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ↓ Clip hanya di sini, bukan di .proj-carousel */}
        <div className="proj-carousel-inner">
          <div
            ref={trackRef}
            className={`proj-track${isTransitioning ? ' animating' : ''}`}
            style={{
              transform: `translateX(${getTranslateX(currentIndex)}%)`,
            }}
          >
            {extendedProjects.map((proj, idx) => (
              <div key={`slide-${idx}`} className="proj-slide">
                <Link href={`/projects/${proj._id}`} className="block h-full">
                  <div className="proj-card">
                    <div className="proj-card-img">
                      {proj.images && proj.images.length > 0 ? (
                        <img src={proj.images[0]} alt={proj.title} />
                      ) : (
                        <div className="proj-placeholder" />
                      )}
                    </div>
                    <div className="p-5 md:p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-stone-900 leading-snug tracking-[-0.02em]">{proj.title}</h3>
                        <span className="flex-shrink-0 ml-3 mt-0.5 text-stone-300 text-lg">↗</span>
                      </div>
                      <p className="text-stone-500 text-sm leading-relaxed flex-grow mb-3">{truncateDesc(proj.description)}</p>
                      {proj.proprietary && (
                        <div className="mb-3 mt-auto">
                          <span className="inline-flex items-center text-[10px] font-semibold tracking-wider uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Proprietary
                          </span>
                        </div>
                      )}
                      <div className={proj.proprietary ? "pt-4 border-t border-stone-100" : "mt-auto pt-4 border-t border-stone-100"}>
                        {proj.techStack && proj.techStack.length > 0 ? (
                          <div className="flex items-center gap-2 overflow-hidden flex-wrap">
                            {proj.techStack.slice(0, 3).map((tech, tIdx) => (
                              <div key={tIdx} className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-[6px] text-stone-600 text-[10px] font-medium">
                                {tech.logo && (
                                  <img src={getCleanUrl(tech.logo)} alt={tech.name} className="w-3.5 h-3.5 object-contain" />
                                )}
                                <span>{tech.name}</span>
                              </div>
                            ))}
                            {proj.techStack.length > 3 && (
                              <div className="flex items-center justify-center px-2 py-1 text-[10px] font-semibold text-stone-500 bg-stone-100 border border-stone-200 rounded-[6px]">
                                +{proj.techStack.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400">Read case study</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="proj-nav-btn" onClick={handlePrev} aria-label="Previous project">
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                className={`proj-dot${i === dotIndex ? ' active' : ''}`}
                onClick={() => handleDot(i)}
                aria-label={`Project ${i + 1}`}
              />
            ))}
          </div>

          <button className="proj-nav-btn" onClick={handleNext} aria-label="Next project">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </>
  );
}