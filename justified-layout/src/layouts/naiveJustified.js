// Plugin: Naive Justified Layout
// Rows are filled greedily left-to-right at a target maxHeight,
// then each full row is scaled down to exactly fill the container width.
const MAX_HEIGHT = 150;
const GAP = 4;

const naiveJustifiedLayout = {
  name: 'Naive Justified',
  compute(photos, containerWidth) {
    // --- Step 1: group photos into rows ---
    const rows = [];
    let currentRow = [];
    let currentWidth = 0;

    photos.forEach((photo) => {
      const scaledWidth = Math.round((MAX_HEIGHT / photo.height) * photo.width);
      const gapOffset = currentRow.length > 0 ? GAP : 0;

      currentRow.push(photo);
      currentWidth += scaledWidth + gapOffset;

      if (currentWidth >= containerWidth) {
        rows.push(currentRow);
        currentRow = [];
        currentWidth = 0;
      }
    });

    // Last row — may not fill full width, leave at natural scaled size
    if (currentRow.length > 0) rows.push(currentRow);

    // --- Step 2: compute rendered pixel dimensions for each row ---
    return rows.map((row, i) => {
      const isLastRow = i === rows.length - 1;
      const totalGapWidth = GAP * (row.length - 1);
      const sumAspectRatios = row.reduce((sum, p) => sum + p.width / p.height, 0);

      // For the last (incomplete) row keep maxHeight instead of stretching
      const rowHeight = isLastRow
        ? MAX_HEIGHT
        : (containerWidth - totalGapWidth) / sumAspectRatios;

      return {
        wrap: false,
        photos: row.map((photo) => ({
          ...photo,
          renderedWidth: rowHeight * (photo.width / photo.height),
          renderedHeight: rowHeight,
        })),
      };
    });
  },
};

export default naiveJustifiedLayout;
