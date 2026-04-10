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

export default function HomeTechMarquee({ techs }) {
  if (!techs || techs.length === 0) return null;

  // Both rows use ALL techs — row 2 is reversed for visual variety
  const row1 = techs;
  const row2 = [...techs].reverse();

  return (
    <>
      <style>{`
        .htm-marquee-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 10px 0;
        }
        .htm-tech {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 20px 8px 8px;
          margin: 0 12px;
          background: white;
          border: 1px solid #e7e5e4;
          border-radius: 15px;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: all 0.25s ease;
          cursor: default;
        }
        .htm-tech:hover {
          border-color: #d6d3d1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }
        .htm-icon {
          width: 38px;
          height: 38px;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .htm-icon img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }
        .htm-label {
          font-size: 13px;
          font-weight: 500;
          color: #44403c;
          white-space: nowrap;
        }
      `}</style>

      <div className="htm-marquee-container">
        {/* Row 1 → scrolls left */}
        <Marquee speed={40} gradient={true} gradientColor="#FAFAF8" gradientWidth={80} pauseOnHover={true}>
          {row1.map((tech, i) => (
            <div key={`r1-${i}`} className="htm-tech">
              <div className="htm-icon">
                {tech.logo ? (
                  <img src={getCleanUrl(tech.logo)} alt={tech.name} />
                ) : (
                  <span style={{ color: '#a8a29e', fontSize: 16, fontWeight: 700 }}>
                    {tech.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="htm-label">{tech.name}</span>
            </div>
          ))}
        </Marquee>

        {/* Row 2 → scrolls right (opposite direction) */}
        <Marquee speed={35} gradient={true} gradientColor="#FAFAF8" gradientWidth={80} pauseOnHover={true} direction="right">
          {row2.map((tech, i) => (
            <div key={`r2-${i}`} className="htm-tech">
              <div className="htm-icon">
                {tech.logo ? (
                  <img src={getCleanUrl(tech.logo)} alt={tech.name} />
                ) : (
                  <span style={{ color: '#a8a29e', fontSize: 16, fontWeight: 700 }}>
                    {tech.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="htm-label">{tech.name}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </>
  );
}
