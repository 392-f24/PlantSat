import React, { useEffect, useRef, useState } from "react";
import { database } from "./utilities/firebase"; 
import { ref, get } from "firebase/database"; 

const MapComponent = ({ userLocation, plants, onMarkerClick }) => {
    const [userPin, setUserPin] = useState(null);
    const [ownerPins, setOwnerPins] = useState({});
    const mapRef = useRef(null);
    const defaultLocation = { lat: 42.0451, lng: -87.6877 };

    // get Geocode of address to add marker
    const geocodeAddress = (address) => {
        return new Promise((resolve) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const { lat, lng } = results[0].geometry.location;
                    resolve({ lat: lat(), lng: lng() });
                } else {
                    console.warn("Geocoding failed for:", address);
                    resolve(defaultLocation);
                }
            });
        });
    };

    useEffect(() => {
        if (!userLocation) {
            console.error("User location is not available.");
            return;
        } else {
            geocodeAddress(userLocation)
                .then(location => setUserPin(location));
        }

        // Gather all locations of plant owners and geocode addresses
        const fetchOwnerLocations = async () => {
            const locations = await Promise.all(plants.map(async (plant) => {
                const ownerRef = ref(database, `users/${plant.owner}`);
                const snapshot = await get(ownerRef);
                if (snapshot.exists()) {
                    const ownerData = snapshot.val();
                    const address = ownerData?.address; 
                    return geocodeAddress(address);
                }
                return defaultLocation; 
            }));

            // Gather unique locations and counts of plants in locations
            const locationCounts = locations.reduce((acc, loc, index) => {
                const key = `${loc.lat},${loc.lng}`;
                if (!acc[key]) {
                    acc[key] = { count: 0, position: loc, plants: [] };
                }
                acc[key].count++;
                acc[key].plants.push(plants[index]); // Store the plant information
                return acc;
            }, {});

            setOwnerPins(locationCounts);
        };
        
        fetchOwnerLocations();
    }, [userLocation, plants]);

    useEffect(() => {
        if (!userPin) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: userPin,
            zoom: 12,
            mapId: 'ae95546a5be3631',
            disableDefaultUI:true
        });

        // User Marker
        new window.google.maps.marker.AdvancedMarkerElement({
            position: userPin,
            map: map,
            title: "Your Location",
            content: createMarkerContent("blue"),
        });

        // Owner Markers
        Object.values(ownerPins).forEach(({ count, position, plants }) => {
            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                position: position,
                map: map,
                title: `${count} owners`,
                content: createMarkerContent("green", count),
            });

            // Add click event listener
            marker.addListener("click", () => {
                if (count === 1) {
                    onMarkerClick(plants[0]);
                } else {
                    onMarkerClick(plants);
                }
            });
        });
    }, [userPin, ownerPins]);

    const createMarkerContent = (color, count) => {
        const markerContent = document.createElement('div');
        markerContent.style.width = "15px"; 
        markerContent.style.height = "15px"; 
        markerContent.style.borderRadius = "50%";
        markerContent.style.backgroundColor = color;
        markerContent.style.border = "2px solid white";
        markerContent.style.display = "flex";
        markerContent.style.alignItems = "center";
        markerContent.style.justifyContent = "center";
        markerContent.style.color = "white";
        markerContent.style.fontSize = "12px";
        markerContent.textContent = count ? count : ''; 
        return markerContent;
    };

    return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
