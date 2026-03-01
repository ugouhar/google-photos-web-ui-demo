import simpleLayout        from './simple';
import naiveJustifiedLayout from './naiveJustified';
import flexLayout           from './flexLayout';

// Registry of all available layout plugins
export const layouts = {
  simple:    simpleLayout,
  justified: naiveJustifiedLayout,
  flex:      flexLayout,
};

// ✏️ Change this flag to switch layouts: 'simple' | 'justified' | 'flex'
export const ACTIVE_LAYOUT = 'flex';
