import { writable } from 'svelte/store';

export const infoOverlayVisible = writable(false);
export const addOverlayVisible = writable(false);

export const infoOverlayActiveTab = (active_tab) => {
  if (typeof active_tab === 'number') {
    localStorage.setItem('active_tab', active_tab.toString());
    const root = document;
    root.querySelectorAll('.info__tabs button')[active_tab - 1].click();
  }
};

export const activeMarkerCoords = writable(null);
