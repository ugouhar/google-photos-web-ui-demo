import { useRef, useState, useEffect } from 'react';
import photos from './photos';
import { layouts, ACTIVE_LAYOUT } from './layouts';

const GAP = 4;

export default function PhotoGrid({ layoutKey = ACTIVE_LAYOUT }) {
  const layout = layouts[layoutKey];
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const rows = containerWidth > 0 ? layout.compute(photos, containerWidth) : [];

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ marginBottom: '16px', color: '#333' }}>
        {layout.name}
      </h2>

      <div ref={containerRef}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'flex',
              flexWrap: row.wrap ? 'wrap' : 'nowrap',
              gap: GAP,
              marginBottom: GAP,
            }}
          >
            {row.photos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  ...(row.useFlexGrow === false
                    ? { width: photo.renderedWidth, flexGrow: 0 }
                    : { flexGrow: photo.width / photo.height, flexBasis: 0 }
                  ),
                  flexShrink: 0,
                  height: photo.renderedHeight,
                  minWidth: 0,
                  backgroundColor: photo.color,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.35)',
                }}
              >
                {photo.id}

                {/* Width label — top edge */}
                <span style={{
                  position: 'absolute',
                  top: 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '10px',
                  fontWeight: 'normal',
                  color: 'rgba(0,0,0,0.55)',
                  background: 'rgba(255,255,255,0.55)',
                  padding: '0 3px',
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                }}>
                  {Math.round(photo.renderedWidth)}px
                </span>

                {/* Height label — right edge */}
                <span style={{
                  position: 'absolute',
                  right: 4,
                  top: '50%',
                  transform: 'translateY(-50%) rotate(90deg)',
                  transformOrigin: 'center center',
                  fontSize: '10px',
                  fontWeight: 'normal',
                  color: 'rgba(0,0,0,0.55)',
                  background: 'rgba(255,255,255,0.55)',
                  padding: '0 3px',
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                }}>
                  {Math.round(photo.renderedHeight)}px
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
