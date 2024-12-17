import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import polyline from '@mapbox/polyline';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaRoute, FaClock } from 'react-icons/fa';

mapboxgl.accessToken = 'pk.eyJ1Ijoibmlsb3kxMzE1IiwiYSI6ImNtMm11NzNxZzByNG8yanNna25tMnEzeHcifQ.ZziuaEr21WcrTMfjQf58Ww';

const Map = (props) => {
  const { lat1, long1, lat2, long2 } = props;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const mapContainerRef = useRef(null);  
  const mapRef = useRef(null);           

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        const routeResponse = await axios.get(`http://localhost:5001/api/place`, {
          params: {
            sourceLat: lat1,
            sourceLng: long1,
            destLat: lat2,
            destLng: long2,
          },
        });

        const routeData = routeResponse.data;
        setPlaces(routeData);
      } catch (err) {
        setError('Failed to fetch places');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [lat1, long1, lat2, long2]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Calculate the midpoint
      const midLat = (lat1 + lat2) / 2;
      const midLng = (long1 + long2) / 2;

      // Initialize the map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current, 
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [midLng, midLat], // Set the center to the midpoint
        zoom: 7,  // Set a reasonable zoom level
      });
    
      const loadRoute = async () => {
        const routeResponse = await fetch(`http://localhost:5001/api/route?sourceLat=${lat1}&sourceLng=${long1}&destLat=${lat2}&destLng=${long2}`);
        const routeData = await routeResponse.json();
        // Update distance and duration
        setDistance(routeData.distance);
        setDuration(routeData.duration);
        const decodedCoordinates = polyline.decode(routeData.geometry);

        mapRef.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: decodedCoordinates.map(coord => [coord[1], coord[0]]) 
            }
          }
        });
        mapRef.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#FF0000',
            'line-width': 5
          }
        });
      };

      loadRoute();
    }

    if (places.length > 0 && mapRef.current) {
      places.forEach((place) => {
        const { center, text, place_name, properties } = place;

        const el = document.createElement('div');
        el.className = 'marker';  
        el.style.backgroundImage = 'url(https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png)';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundSize = '100%';

        // Create the popup with place info
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h3>${text}</h3>
          <p><strong>Place Name:</strong> ${place_name}</p>
          <p><strong>Category:</strong> ${properties?.category}</p>
        `);

        new mapboxgl.Marker(el)
          .setLngLat([center[0], center[1]])  
          .setPopup(popup) 
          .addTo(mapRef.current);  

        el.addEventListener('mouseenter', () => popup.addTo(mapRef.current));
        el.addEventListener('mouseleave', () => popup.remove());
      });
    }
  }, [places]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div ref={mapContainerRef} style={{
        position: 'absolute',
        top: 190,
        right: 80,
        width: '60%', 
        height: '50%',
        overflow: 'hidden'  
      }}  />  
      <div className="mt-[38%] text-center">
          <p className="relative text-lg  text-yellow-800 font-bold mb-4">
            <span className="mr-4 inline-flex items-center">
              <FaRoute className="text-blue-500" title={`Distance: ${distance ? (distance / 1000).toFixed(2) + ' km' : 'Loading...'}`} />
              <span className="ml-2">
                {distance ? `${(distance / 1000).toFixed(2)} km` : 'Loading...'}
              </span>
            </span>

            <span className="inline-flex items-center">
              <FaClock className="text-green-500" title={`Duration: ${duration ? (duration / 60).toFixed(2) + ' min' : 'Loading...'}`} />
              <span className="ml-2">
                {duration ? `${(duration / 60).toFixed(2)} min` : 'Loading...'}
              </span>
            </span>
          </p>
        </div>
    </div>
  );
};

export default Map;
