import { writable } from 'svelte/store';

export const infoOverlayVisible = writable(false);
export const addOverlayVisible = writable(false);
export const infoPanelVisible = writable(true);
export const sidePanelVisible = writable(false);
export const locale = writable('en');

export const infoOverlayActiveTab = (active_tab) => {
  if (typeof active_tab === 'number') {
    localStorage.setItem('active_tab', active_tab.toString());
    const root = document;
    root.querySelectorAll('.info__tabs button')[active_tab - 1].click();
  }
};

export const activeMarkerCoords = writable(null);
export const searchLocation = writable(null);
export const categoryFilter = writable([]);
