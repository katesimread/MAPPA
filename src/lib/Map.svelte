<script>
  import { onMount, onDestroy } from 'svelte';
  import maplibregl from 'maplibre-gl';
  const { AttributionControl, Map, NavigationControl, Popup } = maplibregl;
  import 'maplibre-gl/dist/maplibre-gl.css';
  const style = 'https://tiles.openfreemap.org/styles/liberty';
  import addMarkerImage from '$lib/assets/add-marker.png';
  import housingPinImage from '$lib/assets/pin-housing.png';
  import englishLessonsPinImage from '$lib/assets/pin-english-lessons.png';
  import skillsPinImage from '$lib/assets/pin-skills.png';
  import suppliesPinImage from '$lib/assets/pin-supplies.png';
  import legalSupportPinImage from '$lib/assets/pin-legal-support.png';
  import otherPinImage from '$lib/assets/pin-other.png';
  import {
    activeMarkerCoords,
    addOverlayVisible,
    searchLocation,
    categoryFilter
  } from '../stores';

  let map;
  let mapContainer;
  let isMomentLayerClicked = false;

  const UK_CENTER = [-3.4, 55.4];
  const INITIAL_ZOOM = 4.75;

  // Keep in sync with BRITISH_ISLES_BOUNDS in src/routes/moments/+server.js
  const BRITISH_ISLES_BOUNDS = {
    minLng: -10.6,
    maxLng: 1.8,
    minLat: 49.9,
    maxLat: 60.9
  };

  function isWithinBritishIsles(lng, lat) {
    return (
      lng >= BRITISH_ISLES_BOUNDS.minLng &&
      lng <= BRITISH_ISLES_BOUNDS.maxLng &&
      lat >= BRITISH_ISLES_BOUNDS.minLat &&
      lat <= BRITISH_ISLES_BOUNDS.maxLat
    );
  }

  // Native pixel height of the pin PNGs (the drawn teardrop touches both the
  // top and bottom edges of the image, so this is also its rendered height
  // at icon-size 1) and the scale passed to iconSizeByZoom for the moments
  // layer. A pin's actual on-screen height at a given zoom is
  // PIN_IMAGE_HEIGHT * MOMENT_PIN_SCALE * interpolateIconScale(zoom) — used
  // to keep popups pinned to the top of the marker at any zoom level.
  const PIN_IMAGE_HEIGHT = 218;
  const MOMENT_PIN_SCALE = 0.28;

  const ICON_SCALE_STOPS = [
    [4.75, 0.66],
    [10, 0.825],
    [14, 1.32],
    [18, 2.904]
  ];

  function interpolateIconScale(zoom) {
    const stops = ICON_SCALE_STOPS;
    if (zoom <= stops[0][0]) return stops[0][1];
    if (zoom >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
    for (let i = 0; i < stops.length - 1; i++) {
      const [z0, v0] = stops[i];
      const [z1, v1] = stops[i + 1];
      if (zoom <= z1) {
        const t = (zoom - z0) / (z1 - z0);
        return v0 + (v1 - v0) * t;
      }
    }
    return stops[stops.length - 1][1];
  }

  function markerHeightAtZoom(zoom) {
    return PIN_IMAGE_HEIGHT * MOMENT_PIN_SCALE * interpolateIconScale(zoom);
  }
  const markerId = 'moments';
  const markerLayerId = 'moments-layer';
  const hoverMarkerSourceId = 'hover-marker-source';
  const hoverMarkerLayerId = 'hover-marker-layer';
  const activeMarkerSourceId = 'active-marker-source';
  const activeMarkerLayerId = 'active-marker-layer';
  const searchMarkerSourceId = 'search-marker-source';
  const searchMarkerDotLayerId = 'search-marker-dot-layer';
  const searchMarkerLabelLayerId = 'search-marker-label-layer';

  const activeMarkerGeoJSON = {
    type: 'FeatureCollection',
    features: []
  };

  const hoverMarkerGeoJSON = {
    type: 'FeatureCollection',
    features: []
  };

  const searchMarkerGeoJSON = {
    type: 'FeatureCollection',
    features: []
  };

  async function getMoment(id) {
    try {
      const response = await fetch(`/moment/${id}`);
      const moment = await response.json();
      return moment;
    } catch (error) {
      console.error('Error fetching moment:', error);
      return {};
    }
  }

  async function loadImageAndAddToMap(map, imageUrl, imageId) {
    try {
      const image = await map.loadImage(imageUrl);
      map.addImage(imageId, image.data);
    } catch (error) {
      console.error(`Error loading image (${imageUrl}):`, error);
    }
  }

  function iconSizeByZoom(scale = 1) {
    return [
      'interpolate',
      ['linear'],
      ['zoom'],
      ...ICON_SCALE_STOPS.flatMap(([zoom, value]) => [
        zoom,
        ['*', value, scale]
      ])
    ];
  }

  const HOVER_SCALE = 1.08;
  const HOVER_DURATION_MS = 600;

  // MapLibre only supports feature-state expressions in paint properties, not
  // layout ones (icon-size is layout), so a single hovered pin is instead
  // rendered on a dedicated top layer whose icon-size is animated imperatively
  // via requestAnimationFrame, while the real pin underneath is filtered out.
  function makeHoverController(
    map,
    { baseLayerId, hoverLayerId, hoverSourceId, hoverGeoJSON, baseScale }
  ) {
    let animFrame = null;
    let currentScale = 1;

    function animateTo(targetScale, onComplete) {
      if (animFrame) cancelAnimationFrame(animFrame);
      const startScale = currentScale;
      const startTime = performance.now();

      function step(now) {
        const t = Math.min((now - startTime) / HOVER_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        currentScale = startScale + (targetScale - startScale) * eased;
        map.setLayoutProperty(
          hoverLayerId,
          'icon-size',
          iconSizeByZoom(baseScale * currentScale)
        );
        if (t < 1) {
          animFrame = requestAnimationFrame(step);
        } else {
          animFrame = null;
          onComplete?.();
        }
      }
      animFrame = requestAnimationFrame(step);
    }

    return {
      setHovered(feature) {
        hoverGeoJSON.features = [
          {
            type: 'Feature',
            id: feature.id,
            geometry: feature.geometry,
            properties: feature.properties
          }
        ];
        map.getSource(hoverSourceId)?.setData(hoverGeoJSON);
        map.setFilter(baseLayerId, ['!=', ['id'], feature.id]);
        animateTo(HOVER_SCALE);
      },
      clearHovered() {
        animateTo(1, () => {
          hoverGeoJSON.features = [];
          map.getSource(hoverSourceId)?.setData(hoverGeoJSON);
          map.setFilter(baseLayerId, null);
        });
      }
    };
  }

  function addPinLayer(
    map,
    layerId,
    sourceId,
    iconImage,
    paint = {},
    iconSize = iconSizeByZoom(),
    iconOffset = [0, 0]
  ) {
    map.addLayer({
      id: layerId,
      type: 'symbol',
      source: sourceId,
      layout: {
        'icon-allow-overlap': true,
        'icon-image': iconImage,
        'icon-size': iconSize,
        'icon-anchor': 'bottom',
        'icon-offset': iconOffset
      },
      paint: paint
    });
  }

  const BACKGROUND_COLOR = '#d4c4b2';
  const WATER_COLOR = '#a9b6c6';
  const ROAD_COLOR = '#a9755d';
  const ROAD_CASING_COLOR = '#805d4e';
  const FIELDS_COLOR = '#9a9580';
  const BUILDING_COLOR = '#caa5a2';
  const BUILDING_OUTLINE_COLOR = '#775f5b';
  const RESIDENTIAL_COLOR = '#bda69e';
  const RAILWAY_COLOR = '#987a6d';
  const BOUNDARY_COLOR = '#ddcfcd';
  const SAND_COLOR = '#ebe0ae';
  const POI_TEXT_COLOR = BUILDING_OUTLINE_COLOR;
  const POI_HALO_COLOR = BACKGROUND_COLOR;

  function recolorBoundaries(map) {
    for (const layerId of ['boundary_2', 'boundary_3', 'boundary_disputed']) {
      if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, 'line-color', BOUNDARY_COLOR);
      }
    }
  }

  function recolorBuildings(map) {
    if (map.getLayer('building')) {
      map.setPaintProperty('building', 'fill-color', BUILDING_COLOR);
      map.setPaintProperty(
        'building',
        'fill-outline-color',
        BUILDING_OUTLINE_COLOR
      );
    }
  }

  function recolorResidential(map) {
    if (map.getLayer('landuse_residential')) {
      map.setPaintProperty(
        'landuse_residential',
        'fill-color',
        RESIDENTIAL_COLOR
      );
    }
    if (map.getLayer('landuse_school')) {
      map.setPaintProperty('landuse_school', 'fill-color', RESIDENTIAL_COLOR);
    }
    if (map.getLayer('landuse_hospital')) {
      map.setPaintProperty('landuse_hospital', 'fill-color', RESIDENTIAL_COLOR);
    }
  }

  function addFieldsLayer(map) {
    if (map.getLayer('landuse_farmland')) {
      return;
    }
    map.addLayer(
      {
        id: 'landuse_farmland',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['==', ['get', 'class'], 'farmland'],
        paint: { 'fill-color': FIELDS_COLOR }
      },
      'landuse_residential'
    );
  }

  function recolorBackground(map) {
    if (map.getLayer('background')) {
      map.setPaintProperty('background', 'background-color', BACKGROUND_COLOR);
    }
  }

  function recolorWoodland(map) {
    if (map.getLayer('landcover_wood')) {
      map.setPaintProperty('landcover_wood', 'fill-color', FIELDS_COLOR);
    }
    if (map.getLayer('park')) {
      map.setPaintProperty('park', 'fill-color', FIELDS_COLOR);
      map.setPaintProperty('park', 'fill-outline-color', FIELDS_COLOR);
    }
    if (map.getLayer('park_outline')) {
      map.setLayoutProperty('park_outline', 'visibility', 'none');
    }
    if (map.getLayer('landcover_grass')) {
      map.setPaintProperty('landcover_grass', 'fill-color', FIELDS_COLOR);
    }
    if (map.getLayer('landcover_wetland')) {
      map.setPaintProperty('landcover_wetland', 'fill-pattern', undefined);
      map.setPaintProperty('landcover_wetland', 'fill-color', FIELDS_COLOR);
    }
    if (map.getLayer('landuse_cemetery')) {
      map.setPaintProperty('landuse_cemetery', 'fill-color', FIELDS_COLOR);
    }
  }

  function recolorSand(map) {
    if (map.getLayer('landcover_sand')) {
      map.setPaintProperty('landcover_sand', 'fill-color', SAND_COLOR);
    }
  }

  function recolorWater(map) {
    if (map.getLayer('water')) {
      map.setPaintProperty('water', 'fill-color', WATER_COLOR);
    }
    if (map.getLayer('waterway')) {
      map.setPaintProperty('waterway', 'line-color', WATER_COLOR);
    }
  }

  function recolorRoads(map) {
    for (const layer of map.getStyle().layers) {
      if (layer.type !== 'line' || layer['source-layer'] !== 'transportation') {
        continue;
      }
      if (layer.id.includes('railway') || layer.id === 'road_pier') {
        continue;
      }
      const color = layer.id.includes('casing')
        ? ROAD_CASING_COLOR
        : ROAD_COLOR;
      map.setPaintProperty(layer.id, 'line-color', color);
    }
  }

  function recolorRailways(map) {
    for (const layer of map.getStyle().layers) {
      if (
        layer.type === 'line' &&
        layer['source-layer'] === 'transportation' &&
        layer.id.includes('railway')
      ) {
        map.setPaintProperty(layer.id, 'line-color', RAILWAY_COLOR);
      }
    }
  }

  function recolorPOIs(map) {
    for (const layer of map.getStyle().layers) {
      if (layer.type !== 'symbol' || layer['source-layer'] !== 'poi') {
        continue;
      }
      map.setPaintProperty(layer.id, 'text-color', POI_TEXT_COLOR);
      map.setPaintProperty(layer.id, 'text-halo-color', POI_HALO_COLOR);
    }
  }

  onMount(() => {
    map = new Map({
      container: mapContainer,
      style: style,
      center: UK_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: INITIAL_ZOOM,
      maxZoom: 18,
      attributionControl: false
    });
    map.addControl(
      new AttributionControl({
        compact: true
      })
    );
    map.addControl(
      new NavigationControl({ showCompass: false }),
      'bottom-right'
    );

    map.keyboard.enable();

    map.on('load', async () => {
      recolorBackground(map);
      recolorRoads(map);
      recolorRailways(map);
      recolorWater(map);
      recolorWoodland(map);
      recolorSand(map);
      recolorBoundaries(map);
      recolorBuildings(map);
      recolorResidential(map);
      recolorPOIs(map);
      addFieldsLayer(map);

      map.addSource(markerId, {
        type: 'geojson',
        data: 'data/moments.json'
      });

      try {
        await loadImageAndAddToMap(map, addMarkerImage, 'add-marker');
        await loadImageAndAddToMap(
          map,
          housingPinImage,
          'moment-marker-housing'
        );
        await loadImageAndAddToMap(
          map,
          englishLessonsPinImage,
          'moment-marker-english-lessons'
        );
        await loadImageAndAddToMap(map, skillsPinImage, 'moment-marker-skills');
        await loadImageAndAddToMap(
          map,
          suppliesPinImage,
          'moment-marker-supplies'
        );
        await loadImageAndAddToMap(
          map,
          legalSupportPinImage,
          'moment-marker-legal-support'
        );
        await loadImageAndAddToMap(map, otherPinImage, 'moment-marker-other');
      } catch (error) {
        console.error('Error loading marker images:', error);
      }

      try {
        // Mask disabled: relying on the OS style's own land/sea rendering instead.
      } catch (error) {
        console.error('Error loading GB mask:', error);
      }

      const categoryMarkerImage = [
        'match',
        ['get', 'category'],
        'housing',
        'moment-marker-housing',
        'english-lessons',
        'moment-marker-english-lessons',
        'skills',
        'moment-marker-skills',
        'supplies',
        'moment-marker-supplies',
        'legal-support',
        'moment-marker-legal-support',
        'moment-marker-other'
      ];
      addPinLayer(
        map,
        markerLayerId,
        markerId,
        categoryMarkerImage,
        {},
        iconSizeByZoom(MOMENT_PIN_SCALE)
      );

      map.addSource(hoverMarkerSourceId, {
        type: 'geojson',
        data: hoverMarkerGeoJSON
      });
      addPinLayer(
        map,
        hoverMarkerLayerId,
        hoverMarkerSourceId,
        categoryMarkerImage,
        {},
        iconSizeByZoom(MOMENT_PIN_SCALE)
      );

      const hoverController = makeHoverController(map, {
        baseLayerId: markerLayerId,
        hoverLayerId: hoverMarkerLayerId,
        hoverSourceId: hoverMarkerSourceId,
        hoverGeoJSON: hoverMarkerGeoJSON,
        baseScale: MOMENT_PIN_SCALE
      });

      map.addSource(activeMarkerSourceId, {
        type: 'geojson',
        data: activeMarkerGeoJSON
      });
      addPinLayer(
        map,
        activeMarkerLayerId,
        activeMarkerSourceId,
        'add-marker',
        {},
        iconSizeByZoom(0.28),
        [-9, 0]
      );

      map.addSource(searchMarkerSourceId, {
        type: 'geojson',
        data: searchMarkerGeoJSON
      });
      map.addLayer({
        id: searchMarkerDotLayerId,
        type: 'circle',
        source: searchMarkerSourceId,
        paint: {
          'circle-radius': 6,
          'circle-color': '#422232',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
      map.addLayer({
        id: searchMarkerLabelLayerId,
        type: 'symbol',
        source: searchMarkerSourceId,
        layout: {
          'text-field': ['get', 'label'],
          'text-font': ['Noto Sans Bold'],
          'text-size': 14,
          'text-anchor': 'top',
          'text-offset': [0, 0.7],
          'text-allow-overlap': true,
          'text-optional': true
        },
        paint: {
          'text-color': '#422232',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5
        }
      });

      const momentClickHandler = function (e) {
        isMomentLayerClicked = true;
        if (!e.features || e.features.length === 0) {
          return;
        }

        const feature = e.features[0];
        if (feature.geometry.type !== 'Point') {
          return;
        }

        const coordinates = feature.geometry.coordinates;
        if (typeof feature.id !== 'number') {
          console.error('Invalid feature id:', feature.id);
          return;
        }

        getMoment(feature.id)
          .then((moment) => {
            const titleHtml = moment.title
              ? `<strong class="popup-title">${moment.title}</strong><br>`
              : '';
            const html = moment.link
              ? `${titleHtml}${moment.description}<br><a class="popup-link" href="${moment.link}" target="_blank" rel="noopener">Website</a>`
              : `${titleHtml}${moment.description}`;
            if (coordinates.length === 2) {
              const popup = new Popup({
                offset: [0, -markerHeightAtZoom(map.getZoom())],
                anchor: 'bottom',
                maxWidth: 'none'
              })
                .setLngLat(coordinates)
                .setHTML(html)
                .addTo(map);

              const syncOffsetToZoom = () => {
                popup.setOffset([0, -markerHeightAtZoom(map.getZoom())]);
              };
              map.on('zoom', syncOffsetToZoom);
              popup.on('close', () => map.off('zoom', syncOffsetToZoom));
            } else {
              console.error('Invalid coordinates format');
            }
          })
          .catch((error) => {
            console.error('Error fetching moment:', error);
          });
      };
      map.on('click', markerLayerId, momentClickHandler);
      map.on('click', hoverMarkerLayerId, momentClickHandler);

      let hoveredFeatureId = null;

      // Queries both layers (rather than binding per-layer enter/move/leave)
      // because the currently-hovered pin is filtered out of markerLayerId
      // and rendered on hoverMarkerLayerId instead - a single combined query
      // avoids losing hover tracking the moment that swap happens.
      map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [markerLayerId, hoverMarkerLayerId]
        });
        if (features.length > 0) {
          map.getCanvas().style.cursor = 'pointer';
          const feature = features[0];
          if (hoveredFeatureId !== feature.id) {
            hoveredFeatureId = feature.id;
            hoverController.setHovered(feature);
          }
        } else if (hoveredFeatureId !== null) {
          map.getCanvas().style.cursor = '';
          hoveredFeatureId = null;
          hoverController.clearHovered();
        }
      });

      map.on('click', (e) => {
        if (isMomentLayerClicked) {
          isMomentLayerClicked = false;
          return;
        }

        const { lng, lat } = e.lngLat;
        if (!isWithinBritishIsles(lng, lat)) {
          alert('Pins can only be added within the UK.');
          return;
        }
        activeMarkerCoords.set({ lng, lat });
        addOverlayVisible.set(true);
      });
    });
  });

  $: {
    if ($searchLocation && map) {
      const zoom =
        $searchLocation.type === 'Postcode'
          ? 16
          : $searchLocation.source === 'osm'
            ? 17
            : 12;
      map.flyTo({
        center: [$searchLocation.lng, $searchLocation.lat],
        zoom
      });

      searchMarkerGeoJSON.features = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [$searchLocation.lng, $searchLocation.lat]
          },
          properties: { label: $searchLocation.label ?? '' }
        }
      ];
      map.getSource(searchMarkerSourceId)?.setData(searchMarkerGeoJSON);
    }
  }

  $: {
    if (map && map.getLayer(markerLayerId)) {
      const filter = $categoryFilter.length
        ? ['in', ['get', 'category'], ['literal', $categoryFilter]]
        : null;
      map.setFilter(markerLayerId, filter);
    }
  }

  $: {
    if ($activeMarkerCoords) {
      activeMarkerGeoJSON.features = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [$activeMarkerCoords.lng, $activeMarkerCoords.lat]
          },
          properties: {}
        }
      ];

      const source = map?.getSource(activeMarkerSourceId);
      if (source) {
        source.setData(activeMarkerGeoJSON);
      }
    }
  }

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
</script>

<div id="map" bind:this={mapContainer}></div>

<style>
  #map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
