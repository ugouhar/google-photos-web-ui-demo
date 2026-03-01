// Plugin: Simple Layout
// Photos rendered at their natural dimensions, wrapped freely.
const simpleLayout = {
  name: 'Simple',
  compute(photos) {
    return [
      {
        wrap: true,
        useFlexGrow: false, // render at natural pixel dimensions, not scaled
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
