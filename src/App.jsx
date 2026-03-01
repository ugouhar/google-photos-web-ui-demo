import PhotoGrid from './PhotoGrid';

export default function App() {
  return (
    <div>
      <PhotoGrid layoutKey="simple" />
      <hr style={{ border: 'none', borderTop: '2px dashed #ccc', margin: '8px 16px' }} />
      <PhotoGrid layoutKey="justified" />
      <hr style={{ border: 'none', borderTop: '2px dashed #ccc', margin: '8px 16px' }} />
      <PhotoGrid layoutKey="flex" />
    </div>
  );
}
