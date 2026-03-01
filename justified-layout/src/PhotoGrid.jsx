import photos from './photos';

export default function PhotoGrid() {
  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontFamily: 'sans-serif', marginBottom: '16px' }}>
        Simple Layout (unstyled)
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              width: photo.width,
              height: photo.height,
              backgroundColor: photo.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'sans-serif',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'rgba(0,0,0,0.4)',
            }}
          >
            {photo.id}
          </div>
        ))}
      </div>
    </div>
  );
}
