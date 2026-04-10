'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images = [], title, youtubeUrl, videoUrl }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const media = [];
    if (youtubeUrl || videoUrl) {
        if (youtubeUrl) {
            const ytId = getYouTubeId(youtubeUrl);
            media.push({ 
                type: 'youtube', 
                src: ytId ? `https://www.youtube.com/embed/${ytId}` : youtubeUrl, 
                thumb: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '' 
            });
        } else {
            const thumb = videoUrl.replace(/\.[^/.]+$/, ".jpg");
            media.push({ type: 'video', src: videoUrl, thumb });
        }
    }

    images.forEach(img => {
        media.push({ type: 'image', src: img, thumb: img });
    });

    const MAX_THUMBS = 6;
    const visibleThumbs = media.slice(0, MAX_THUMBS);
    const extraCount = media.length - MAX_THUMBS;

    // Keyboard for lightbox
    const handleKeyDown = useCallback(
        (e) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowLeft') setLightboxIndex((p) => (p - 1 + media.length) % media.length);
            if (e.key === 'ArrowRight') setLightboxIndex((p) => (p + 1) % media.length);
        },
        [lightboxOpen, media.length]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const prev = () => setActiveIndex((p) => (p - 1 + media.length) % media.length);
    const next = () => setActiveIndex((p) => (p + 1) % media.length);

    if (media.length === 0) return null;

    return (
        <>
            <style>{galleryStyles}</style>
            <section className="py-8">
                {/* Main Media - 16:9 */}
                <div className="ig-main" onClick={() => media[activeIndex].type === 'image' && openLightbox(activeIndex)}>
                    {media[activeIndex].type === 'image' ? (
                        <img src={media[activeIndex].src} alt={`${title} view ${activeIndex + 1}`} />
                    ) : media[activeIndex].type === 'youtube' ? (
                        <iframe
                            className="w-full h-full"
                            style={{ aspectRatio: '16/9' }}
                            src={media[activeIndex].src}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video src={media[activeIndex].src} controls className="w-full h-full outline-none" style={{ aspectRatio: '16/9' }} />
                    )}
                </div>

                {/* Controls */}
                {media.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button className="ig-arrow" onClick={prev} aria-label="Previous media">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-[12px] text-stone-400 font-medium tabular-nums">
                            {activeIndex + 1} / {media.length}
                        </span>
                        <button className="ig-arrow" onClick={next} aria-label="Next media">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Thumbnails - single row, max 6 */}
                {media.length > 1 && (
                    <div className="ig-thumbs">
                        {visibleThumbs.map((item, i) => {
                            const isLast = i === MAX_THUMBS - 1 && extraCount > 0;
                            return (
                                <div
                                    key={i}
                                    className={`ig-thumb${i === activeIndex ? ' active' : ''}`}
                                    onClick={() => isLast ? openLightbox(MAX_THUMBS - 1) : setActiveIndex(i)}
                                >
                                    <img src={item.thumb} alt={`${title} thumb ${i + 1}`} />
                                    {item.type !== 'image' && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white backdrop-blur-sm">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>
                                            </div>
                                        </div>
                                    )}
                                    {isLast && (
                                        <div className="ig-thumb-extra">
                                            <span>+{extraCount}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="lightbox-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
                >
                    <button className="lb-btn" style={{ top: 20, right: 20 }} onClick={() => setLightboxOpen(false)} aria-label="Close">
                        <X size={18} />
                    </button>

                    {media.length > 1 && (
                        <button
                            className="lb-btn"
                            style={{ left: 16, top: '50%', transform: 'translateY(-50%)' }}
                            onClick={() => setLightboxIndex((p) => (p - 1 + media.length) % media.length)}
                            aria-label="Previous"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {media[lightboxIndex].type === 'image' ? (
                        <img src={media[lightboxIndex].src} alt={`${title} preview ${lightboxIndex + 1}`} className="lightbox-img" />
                    ) : media[lightboxIndex].type === 'youtube' ? (
                        <iframe
                            className="lightbox-vid"
                            src={media[lightboxIndex].src}
                            title="YouTube video player"
                            frameBorder="0"
                            allowFullScreen
                        />
                    ) : (
                        <video src={media[lightboxIndex].src} controls className="lightbox-vid" />
                    )}

                    {media.length > 1 && (
                        <button
                            className="lb-btn"
                            style={{ right: 16, top: '50%', transform: 'translateY(-50%)' }}
                            onClick={() => setLightboxIndex((p) => (p + 1) % media.length)}
                            aria-label="Next"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    {media.length > 1 && (
                        <span style={{
                            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                            fontSize: 13, color: 'rgba(255,255,255,0.45)',
                            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em',
                        }}>
                            {lightboxIndex + 1} / {media.length}
                        </span>
                    )}
                </div>
            )}
        </>
    );
}

const galleryStyles = `
  .ig-main {
    border-radius: 16px;
    overflow: hidden;
    cursor: zoom-in;
    background: #e7e5e4;
  }
  .ig-main img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .ig-main:hover img { transform: scale(1.02); }

  .ig-thumbs {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ig-thumbs::-webkit-scrollbar { display: none; }

  .ig-thumb {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    background: #e7e5e4;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    opacity: 0.6;
    flex-shrink: 0;
    width: calc((100% - 40px) / 6);
    min-width: 80px;
  }
  .ig-thumb:hover {
    opacity: 0.9;
  }
  .ig-thumb.active {
    border-color: #292524;
    opacity: 1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .ig-thumb img {
    width: 100%;
    aspect-ratio: 16/10;
    object-fit: cover;
    display: block;
  }
  .ig-thumb-extra {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }
  .ig-thumb-extra span {
    color: white;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .ig-arrow {
    width: 38px; height: 38px;
    border-radius: 9999px;
    background: white;
    border: 1px solid #e7e5e4;
    color: #44403c;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  .ig-arrow:hover { background: #f5f5f4; border-color: #d6d3d1; color: #1c1917; }
  .lightbox-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(12,12,10,0.93);
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(8px);
    animation: lbFadeIn 0.2s ease;
  }
  @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
  .lightbox-img, .lightbox-vid {
    width: 100%;
    max-width: min(90vw, 1100px);
    max-height: 85vh;
    border-radius: 12px;
    object-fit: contain;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6);
  }
  .lightbox-vid {
    aspect-ratio: 16/9;
    background: #000;
  }
  .lb-btn {
    position: absolute;
    width: 44px; height: 44px;
    border-radius: 9999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    color: white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
    backdrop-filter: blur(4px);
  }
  .lb-btn:hover { background: rgba(255,255,255,0.18); }
`;