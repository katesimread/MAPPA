import { writable } from 'svelte/store';

// Which single bottom sheet is currently open. Only one can ever be open at
// once, which is what guarantees panels can't overlap on a small screen.
/** @type {import('svelte/store').Writable<'filter' | 'add' | 'moment' | 'info' | null>} */
export const activeSheet = writable(null);

// The moment (pin) most recently tapped on the map, shown in the "moment"
// sheet. Cleared when that sheet closes.
/** @type {import('svelte/store').Writable<{ title?: string, description?: string, link?: string } | null>} */
export const activeMoment = writable(null);
