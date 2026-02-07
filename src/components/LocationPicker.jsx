import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Navigation, RefreshCw, Check } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

// Fix for Leaflet marker icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to handle map clicks and updates
function LocationMarker({ position, setPosition, onLocationSelect }) {
    const map = useMap();

    // Update map view when position changes externally
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);

    useMapEvents({
        click(e) {
            const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
            setPosition(newPos);
            onLocationSelect(newPos);
        },
    });

    return position === null ? null : (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    onLocationSelect(newPos);
                }
            }}
        />
    );
}

const LocationPicker = ({ onLocationChange, initialLocation }) => {
    const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
    const [position, setPosition] = useState(initialLocation || { lat: 11.2588, lng: 75.7804 }); // Default Kozhikode
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial GPS fetch
    useEffect(() => {
        if (mode === 'auto' && !initialLocation) {
            getCurrentLocation();
        }
    }, [mode]);

    const getCurrentLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                setPosition(newPos);
                fetchAddress(newPos.lat, newPos.lng);
                onLocationChange({ ...newPos, address: 'Fetching address...' });
            },
            (err) => {
                setError('Unable to retrieve your location');
                setLoading(false);
                // Fallback to manual mode if auto fails
                setMode('manual');
            }
        );
    };

    const fetchAddress = async (lat, lng) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            const newAddress = data.display_name;
            setAddress(newAddress);
            onLocationChange({ lat, lng, address: newAddress });
        } catch (error) {
            console.error('Error fetching address:', error);
            setAddress('Address lookup failed');
            onLocationChange({ lat, lng, address: 'Unknown location' });
        } finally {
            setLoading(false);
        }
    };

    const handleManualSelect = (newPos) => {
        setPosition(newPos);
        fetchAddress(newPos.lat, newPos.lng);
    };

    return (
        <div className="location-picker">
            <div className="picker-tabs">
                <button
                    className={`tab ${mode === 'auto' ? 'active' : ''}`}
                    onClick={() => setMode('auto')}
                >
                    <Navigation size={16} />
                    Auto Detect
                </button>
                <button
                    className={`tab ${mode === 'manual' ? 'active' : ''}`}
                    onClick={() => setMode('manual')}
                >
                    <MapPin size={16} />
                    Select on Map
                </button>
            </div>

            <div className="picker-content">
                {mode === 'auto' ? (
                    <div className="auto-mode">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Detecting accurate location...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <p>{error}</p>
                                <button onClick={getCurrentLocation} className="retry-btn">Retry</button>
                                <button onClick={() => setMode('manual')} className="switch-btn">Switch to Manual</button>
                            </div>
                        ) : (
                            <div className="location-details">
                                <div className="info-row">
                                    <label>Latitude:</label>
                                    <span>{position.lat.toFixed(6)}</span>
                                </div>
                                <div className="info-row">
                                    <label>Longitude:</label>
                                    <span>{position.lng.toFixed(6)}</span>
                                </div>
                                <div className="info-row address">
                                    <label>Address:</label>
                                    <p>{address || 'Fetching address...'}</p>
                                </div>
                                <button onClick={getCurrentLocation} className="refresh-btn">
                                    <RefreshCw size={14} /> Refresh Location
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="manual-mode">
                        <MapContainer
                            center={position}
                            zoom={15}
                            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <LocationMarker
                                position={position}
                                setPosition={setPosition}
                                onLocationSelect={handleManualSelect}
                            />
                        </MapContainer>
                        <div className="manual-helper">
                            <p>Drag marker or click map to pinpoint location</p>
                            <div className="current-selection">
                                <span>{address ? address.substring(0, 40) + '...' : 'Select location...'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationPicker;
