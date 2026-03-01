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
                  // Justified layouts: flex-grow fills the row without float overflow.
                  // Simple layout: explicit pixel size so natural dimensions are preserved.
                  ...(row.useFlexGrow === false
                    ? { width: photo.renderedWidth, flexGrow: 0 }
                    : { flexGrow: photo.width / photo.height, flexBasis: 0 }
                  ),
                  flexShrink: 0,
                  height: photo.renderedHeight,
                  minWidth: 0,
                  backgroundColor: photo.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.35)',
                }}
              >
                {photo.id}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
