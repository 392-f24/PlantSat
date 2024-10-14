// MapComponent.js
import React, { useEffect, useRef } from 'react';

const MapComponent = ({ plants }) => {
    const mapRef = useRef(null);

    useEffect(() => {
    
    const handleLocation = (position) => {
        const { latitude, longitude } = position.coords;
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: 12,
        });
        plants.forEach(plant => {
            const marker = new window.google.maps.Marker({
                position: { lat: plant.location.lat, lng: plant.location.lng },
                map: map,
                title: plant.name,
                icon: 'path/to/icon.png',
            });
            const infowindow = new window.google.maps.InfoWindow({
                content: `<h3>${plant.name}</h3><p>${plant.care}</p>`,
            });
            marker.addListener('click', () => {
            infowindow.open(map, marker);
            });
        });
    };

    const handleError = (error) => {
        console.error("Error getting location: ", error);
        const defaultLocation = { lat: -37.816279, lng: 144.953736 };
        const map = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 12,
        });
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocation, handleError);
    } else {
        handleError(new Error("Geolocation not supported"));
    }

    }, [plants]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
