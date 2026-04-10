'use client';

import Marquee from 'react-fast-marquee';

const getCleanUrl = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('google.com') && urlObj.searchParams.has('imgurl')) {
      return urlObj.searchParams.get('imgurl');
    }
  } catch (e) {
    // Ignore invalid urls
  }
  return url;
};

export default function TechStackMarquee({ techStack }) {
  if (!techStack || techStack.length === 0) return null;

  return (
    <>
      <style>{`
        .ts-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          margin: 0 8px;
          background: white;
          border: 1px solid #e7e5e4;
          border-radius: 12px;
          white-space: nowrap;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .ts-item:hover {
          border-color: #d6d3d1;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }
        .ts-item img {
          width: 24px;
          height: 24px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .ts-item span {
          font-size: 13px;
          font-weight: 500;
          color: #44403c;
        }
      `}</style>

      <section className="py-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-px bg-stone-300" />
          <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-stone-400">Tech Stack</h3>
        </div>
        <Marquee speed={30} gradient={true} gradientColor="#FAFAF8" gradientWidth={40} pauseOnHover={true}>
          {techStack.map((tech, i) => (
            <div key={`${tech.name}-${i}`} className="ts-item">
              {tech.logo && <img src={getCleanUrl(tech.logo)} alt={tech.name} />}
              <span>{tech.name}</span>
            </div>
          ))}
        </Marquee>
      </section>
    </>
  );
}
