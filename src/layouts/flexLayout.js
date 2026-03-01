/**
 * FlexLayout — Knuth & Plass line-breaking adapted for photo layout
 *
 * Instead of deciding one row at a time (naive/greedy), this considers
 * ALL possible row combinations across the entire section and picks the
 * globally best one using dynamic programming on a Directed Acyclic Graph.
 *
 * Three tuning parameters:
 *   IDEAL_HEIGHT  — target row height (badness = 0 at this height)
 *   MIN_HEIGHT    — shortest a row is allowed to be (max shrink)
 *   MAX_HEIGHT    — tallest a row is allowed to be (max stretch)
 *
 * Each row is scored by a "demerit" — the further the actual row height
 * is from IDEAL_HEIGHT, the higher the demerit. The algorithm finds the
 * set of row breaks whose total demerit is lowest.
 */

const IDEAL_HEIGHT = 150;
const MIN_HEIGHT   = 80;   // rows shorter than this are not permissible
const MAX_HEIGHT   = 240;  // rows taller than this are not permissible
const GAP          = 4;
const DEMERIT_POW  = 3;    // higher = more aggressively penalise extremes

// Height a row of photos[start..end) would have when scaled to fill containerWidth
function rowHeight(photos, start, end, containerWidth) {
  const totalGaps  = GAP * (end - start - 1);
  const sumRatios  = photos
    .slice(start, end)
    .reduce((s, p) => s + p.width / p.height, 0);
  return (containerWidth - totalGaps) / sumRatios;
}

// Demerit score for a row at height h (0 = perfect, Infinity = not allowed)
function demerit(h) {
  if (h < MIN_HEIGHT || h > MAX_HEIGHT) return Infinity;
  const ratio = h < IDEAL_HEIGHT
    ? (IDEAL_HEIGHT - h) / (IDEAL_HEIGHT - MIN_HEIGHT)  // shrink side
    : (h - IDEAL_HEIGHT) / (MAX_HEIGHT - IDEAL_HEIGHT); // stretch side
  return Math.pow(ratio, DEMERIT_POW);
}

const flexLayout = {
  name: 'FlexLayout (Knuth & Plass)',

  compute(photos, containerWidth) {
    const n = photos.length;

    // DP arrays
    // cost[i] = minimum total demerit to optimally place photos[0..i-1]
    // prev[i] = the start index of the row that ends at i on the best path
    const cost = Array(n + 1).fill(Infinity);
    const prev = Array(n + 1).fill(-1);
    cost[0] = 0;

    for (let i = 0; i < n; i++) {
      if (cost[i] === Infinity) continue;

      for (let j = i + 1; j <= n; j++) {
        const h = rowHeight(photos, i, j, containerWidth);

        // As j grows, h decreases (more photos → shorter rows).
        // Once h drops below MIN_HEIGHT every further j is also invalid.
        if (h < MIN_HEIGHT && j > i + 1) break;

        // Special case: last row never needs to fill the full width,
        // so always allow it with zero extra cost.
        const d = (j === n) ? 0 : demerit(h);
        if (d === Infinity) continue;

        const newCost = cost[i] + d;
        if (newCost < cost[j]) {
          cost[j] = newCost;
          prev[j] = i;
        }
      }
    }

    // --- Reconstruct break points by walking prev[] back from n ---
    const breakPoints = [];
    let cursor = n;
    while (cursor > 0 && prev[cursor] !== -1) {
      breakPoints.unshift(cursor);
      cursor = prev[cursor];
    }
    breakPoints.unshift(0);

    // --- Build rows from break points ---
    return breakPoints.slice(0, -1).map((start, k) => {
      const end        = breakPoints[k + 1];
      const isLastRow  = k === breakPoints.length - 2;
      const rowPhotos  = photos.slice(start, end);
      const totalGaps  = GAP * (rowPhotos.length - 1);
      const sumRatios  = rowPhotos.reduce((s, p) => s + p.width / p.height, 0);

      // Last row: render at IDEAL_HEIGHT (doesn't need to stretch to fill width)
      const h = isLastRow
        ? IDEAL_HEIGHT
        : (containerWidth - totalGaps) / sumRatios;

      return {
        wrap: false,
        photos: rowPhotos.map((photo) => ({
          ...photo,
          renderedWidth:  h * (photo.width / photo.height),
          renderedHeight: h,
        })),
      };
    });
  },
};

export default flexLayout;
