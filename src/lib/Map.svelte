<script>
  import { onMount, onDestroy } from 'svelte';
  import maplibregl from 'maplibre-gl';
  const { AttributionControl, Map, NavigationControl, Popup } = maplibregl;
  import 'maplibre-gl/dist/maplibre-gl.css';
  import markerImage from '$lib/assets/marker.png';
  import markerHoveredImage from '$lib/assets/marker-hovered.png';
  const style = 'https://tiles.openfreemap.org/styles/positron';
  import addMarkerImage from '$lib/assets/add-marker.png';
  import {
    activeMarkerCoords,
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
  const markerHoveredLayerId = 'moments-hovered-layer';
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

  function addPinLayer(map, layerId, sourceId, iconImage, paint = {}) {
    map.addLayer({
      id: layerId,
      type: 'symbol',
      source: sourceId,
      layout: {
        'icon-allow-overlap': true,
        'icon-image': iconImage,
        'icon-size': 0.45,
        'icon-anchor': 'bottom'
      },
      paint: paint
    });
  }

  const ROAD_COLORS = {
    Motorway: { casing: '#99004d', fill: '#ff00ff' },
    'Guided Busway': { casing: '#99004d', fill: '#ff00ff' },
    Primary: { casing: '#b30058', fill: '#e8629c' },
    'A Road': { casing: '#c71f6b', fill: '#f4b9d6' },
    'B Road': { casing: '#d1487f', fill: '#f7cbdd' },
    Restricted: { casing: '#d1487f', fill: '#f7cbdd' },
    Minor: { casing: '#db6f96', fill: '#fbdce9' },
    Local: { casing: '#e494ac', fill: '#fdeef4' }
  };
  const ROAD_AREA_FILL = '#fdeef4';
  const ROAD_LABEL_COLOR = '#422232';

  function recolorRoads(map) {
    for (const layer of map.getStyle().layers) {
      if (layer.type === 'line' && layer['source-layer'] === 'Roads') {
        const [, roadClass, variant] =
          layer.id.match(/^OS\/Roads\/([^,]+),.*[/_](\d)$/) ?? [];
        const colors = ROAD_COLORS[roadClass];
        if (colors) {
          map.setPaintProperty(
            layer.id,
            'line-color',
            variant === '1' ? colors.casing : colors.fill
          );
        }
      } else if (
        layer.type === 'symbol' &&
        (layer['source-layer'] === 'Roads/label' ||
          (layer['source-layer'] === 'CartographicText' &&
            layer.id.includes('Roads')))
      ) {
        map.setPaintProperty(layer.id, 'text-color', ROAD_LABEL_COLOR);
      } else if (
        layer.type === 'fill' &&
        (layer.id.includes('Road') || layer.id.includes('Roadside'))
      ) {
        map.setPaintProperty(layer.id, 'fill-color', ROAD_AREA_FILL);
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
      recolorRoads(map);

      map.addSource(markerId, {
        type: 'geojson',
        data: 'data/moments.json'
      });

      try {
        await loadImageAndAddToMap(map, markerImage, 'moment-marker');
        await loadImageAndAddToMap(map, markerHoveredImage, 'marker-hovered');
        await loadImageAndAddToMap(map, addMarkerImage, 'add-marker');
      } catch (error) {
        console.error('Error loading marker images:', error);
      }

      try {
        // Mask disabled: relying on the OS style's own land/sea rendering instead.
      } catch (error) {
        console.error('Error loading GB mask:', error);
      }

      addPinLayer(map, markerLayerId, markerId, 'moment-marker');
      addPinLayer(map, markerHoveredLayerId, markerId, 'marker-hovered', {
        'icon-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0
        ]
      });

      map.addSource(activeMarkerSourceId, {
        type: 'geojson',
        data: activeMarkerGeoJSON
      });
      addPinLayer(map, activeMarkerLayerId, activeMarkerSourceId, 'add-marker');

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
      const filter = $categoryFilter
        ? ['==', ['get', 'category'], $categoryFilter]
        : null;
      map.setFilter(markerLayerId, filter);
      map.setFilter(markerHoveredLayerId, filter);
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
