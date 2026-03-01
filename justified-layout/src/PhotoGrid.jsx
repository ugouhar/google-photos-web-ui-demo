import { useRef, useState, useEffect } from 'react';
import photos from './photos';
import { layouts, ACTIVE_LAYOUT } from './layouts';

const GAP = 4;
const layout = layouts[ACTIVE_LAYOUT];

export default function PhotoGrid() {
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
                  // Use flex-grow proportional to aspect ratio instead of
                  // explicit pixel width — lets the browser distribute the
                  // exact available space with no floating-point overflow.
                  flexGrow: photo.width / photo.height,
                  flexShrink: 0,
                  flexBasis: 0,
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
