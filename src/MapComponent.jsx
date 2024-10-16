import React, { useEffect, useRef } from "react";

const MapComponent = ({ plants, userLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!userLocation) {
      console.error("User location is not available.");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 12,
    });

    // Add marker for user's location
    new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: "Your Location",
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });

    plants.forEach((plant) => {
      if (plant.location && plant.location.lat !== undefined && plant.location.lng !== undefined) {
        const marker = new window.google.maps.Marker({
          position: { lat: plant.location.lat, lng: plant.location.lng },
          map: map,
          title: plant.name,
          icon: "path/to/icon.png", // replace
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `<h3>${plant.name}</h3><p>${plant.care}</p>`,
        });

        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });
      } else {
        console.warn(`Invalid location for plant: ${plant.name}`);
      }
    });
  }, [plants, userLocation]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
