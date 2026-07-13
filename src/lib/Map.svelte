<script>
  import { onMount, onDestroy } from 'svelte';
  import maplibregl from 'maplibre-gl';
  const { AttributionControl, Map, NavigationControl, Popup } = maplibregl;
  import 'maplibre-gl/dist/maplibre-gl.css';
  import markerImage from '$lib/assets/marker.png';
  import markerHoveredImage from '$lib/assets/marker-hovered.png';
  import { PUBLIC_OS_API_KEY } from '$env/static/public';
  const style = `https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${PUBLIC_OS_API_KEY}`;
  import addMarkerImage from '$lib/assets/add-marker.png';
  import {
    activeMarkerCoords,
    searchLocation,
    categoryFilter
  } from '../stores';

  let map;
  let mapContainer;
  let isMomentLayerClicked = false;

  const UK_BOUNDS = [
    [-8.6, 49.9],
    [1.8, 60.9]
  ];

  const markerHeight = 39;
  const markerId = 'moments';
  const markerLayerId = 'moments-layer';
  const markerHoveredLayerId = 'moments-hovered-layer';
  const activeMarkerSourceId = 'active-marker-source';
  const activeMarkerLayerId = 'active-marker-layer';

  const activeMarkerGeoJSON = {
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

  onMount(() => {
    map = new Map({
      container: mapContainer,
      style: style,
      bounds: UK_BOUNDS,
      fitBoundsOptions: { padding: 20 },
      minZoom: 1,
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
      map.addSource(markerId, {
        type: 'geojson',
        data: 'data/moments.json'
      });

      try {
        await loadImageAndAddToMap(map, markerImage, 'marker');
        await loadImageAndAddToMap(map, markerHoveredImage, 'marker-hovered');
        await loadImageAndAddToMap(map, addMarkerImage, 'add-marker');
      } catch (error) {
        console.error('Error loading marker images:', error);
      }

      try {
        const gbData = await fetch('/data/gb-outline.json').then((r) =>
          r.json()
        );
        const holes = [];
        const geometries =
          gbData.geometries ?? gbData.features?.map((f) => f.geometry) ?? [];
        for (const geom of geometries) {
          if (geom.type === 'Polygon') {
            holes.push(geom.coordinates[0]);
          } else if (geom.type === 'MultiPolygon') {
            for (const poly of geom.coordinates) {
              holes.push(poly[0]);
            }
          }
        }
        map.addSource('mask', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90]
                ],
                ...holes
              ]
            }
          }
        });
        const firstSymbolLayer = map
          .getStyle()
          .layers.find((l) => l.type === 'symbol');
        map.addLayer(
          {
            id: 'mask-layer',
            type: 'fill',
            source: 'mask',
            paint: { 'fill-color': '#c8d8e8', 'fill-opacity': 1 }
          },
          firstSymbolLayer?.id
        );
      } catch (error) {
        console.error('Error loading GB mask:', error);
      }

      addPinLayer(map, markerLayerId, markerId, 'marker');
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
        activeMarkerCoords.set({ lng, lat });
      });
    });
  });

  $: {
    if ($searchLocation && map) {
      map.flyTo({
        center: [$searchLocation.lng, $searchLocation.lat],
        zoom: 12
      });
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
