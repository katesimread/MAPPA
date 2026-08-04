<script>
  import { onMount, onDestroy } from 'svelte';
  import maplibregl from 'maplibre-gl';
  const { AttributionControl, Map, NavigationControl, Popup } = maplibregl;
  import 'maplibre-gl/dist/maplibre-gl.css';
  const style = 'https://tiles.openfreemap.org/styles/positron';
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

  const markerHeight = 39;
  const markerId = 'moments';
  const markerLayerId = 'moments-layer';
  const activeMarkerSourceId = 'active-marker-source';
  const activeMarkerLayerId = 'active-marker-layer';
  const searchMarkerSourceId = 'search-marker-source';
  const searchMarkerDotLayerId = 'search-marker-dot-layer';
  const searchMarkerLabelLayerId = 'search-marker-label-layer';

  const activeMarkerGeoJSON = {
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
      4.75,
      ['*', 0.66, scale],
      10,
      ['*', 0.825, scale],
      14,
      ['*', 1.32, scale],
      18,
      ['*', 2.904, scale]
    ];
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

  const BACKGROUND_COLOR = '#c9b59f';
  const WATER_COLOR = '#94a4b8';
  const ROAD_COLOR = '#945234';
  const ROAD_CASING_COLOR = '#603522';
  const FIELDS_COLOR = '#817b60';
  const BUILDING_COLOR = '#bd8f8b';
  const BUILDING_OUTLINE_COLOR = '#553732';
  const RESIDENTIAL_COLOR = '#ac9086';
  const RAILWAY_COLOR = '#7e5949';
  const BOUNDARY_COLOR = '#d5c3c0';

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
      recolorBoundaries(map);
      recolorBuildings(map);
      recolorResidential(map);
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
        iconSizeByZoom(0.28)
      );

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

      map.on('click', markerLayerId, function (e) {
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
            const html = moment.link
              ? `${moment.description}<br><br><a href="${moment.link}" target="_blank" rel="noopener">Website</a>`
              : moment.description;
            if (coordinates.length === 2) {
              new Popup({
                offset: [0, -markerHeight],
                anchor: 'bottom',
                maxWidth: 'none'
              })
                .setLngLat(coordinates)
                .setHTML(html)
                .addTo(map);
            } else {
              console.error('Invalid coordinates format');
            }
          })
          .catch((error) => {
            console.error('Error fetching moment:', error);
          });
      });

      let hoveredFeatureId = null;

      const pointerHoverHandler = (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features.length > 0) {
          const newHoveredFeatureId = e.features[0].id;
          if (
            hoveredFeatureId !== null &&
            hoveredFeatureId !== newHoveredFeatureId
          ) {
            map.setFeatureState(
              { source: markerId, id: hoveredFeatureId },
              { hover: false }
            );
          }
          hoveredFeatureId = newHoveredFeatureId;
          map.setFeatureState(
            { source: markerId, id: hoveredFeatureId },
            { hover: true }
          );
        }
      };
      map.on('mouseenter', markerLayerId, pointerHoverHandler);
      map.on('mousemove', markerLayerId, pointerHoverHandler);

      map.on('mouseleave', markerLayerId, function () {
        map.getCanvas().style.cursor = '';
        if (hoveredFeatureId !== null) {
          map.setFeatureState(
            { source: markerId, id: hoveredFeatureId },
            { hover: false }
          );
          hoveredFeatureId = null;
        }
      });

      map.on('click', (e) => {
        if (isMomentLayerClicked) {
          isMomentLayerClicked = false;
          return;
        }

        const { lng, lat } = e.lngLat;
        if (!isWithinBritishIsles(lng, lat)) {
          alert('Pins can only be added within the British Isles.');
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
