// Plugin: Simple Layout
// Photos rendered at their natural dimensions, wrapped freely.
const simpleLayout = {
  name: 'Simple',
  compute(photos) {
    return [
      {
        wrap: true,
        photos: photos.map((p) => ({
          ...p,
          renderedWidth: p.width,
          renderedHeight: p.height,
        })),
      },
    ];
  },
};

export default simpleLayout;
