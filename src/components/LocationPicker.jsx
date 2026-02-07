import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} /> : null;
}

const LocationPicker = ({ onLocationSelect, initialLocation, onClose }) => {
    const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
    const [position, setPosition] = useState(initialLocation || [11.2588, 75.7804]); // Default: Kozhikode
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const mapRef = useRef(null);

    // Auto-detect location
    const handleAutoDetect = () => {
        setIsLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setPosition([lat, lon]);

                // Reverse geocode to get address
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );
                    const data = await response.json();
                    setAddress(data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`);
                } catch (err) {
                    setAddress(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
                }

                setIsLoading(false);
            },
            (err) => {
                setError('Unable to retrieve your location. Please use manual selection.');
                setIsLoading(false);
                setMode('manual');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Get address when position changes in manual mode
    useEffect(() => {
        if (mode === 'manual' && position) {
            const getAddress = async () => {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
                    );
                    const data = await response.json();
                    setAddress(data.display_name || `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`);
                } catch (err) {
                    setAddress(`${position[0].toFixed(6)}, ${position[1].toFixed(6)}`);
                }
            };
            getAddress();
        }
    }, [position, mode]);

    // Auto-detect on mount if mode is auto
    useEffect(() => {
        if (mode === 'auto') {
            handleAutoDetect();
        }
    }, [mode]);

    const handleConfirm = () => {
        if (position) {
            onLocationSelect({
                latitude: position[0],
                longitude: position[1],
                address: address,
                mode: mode
            });
        }
    };

    return (
        <div className="location-picker-overlay">
            <div className="location-picker-modal">
                <div className="location-picker-header">
                    <h2>Select Location</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Mode Selection */}
                <div className="location-mode-tabs">
                    <button
                        className={`mode-tab ${mode === 'auto' ? 'active' : ''}`}
                        onClick={() => setMode('auto')}
                    >
                        <Navigation size={18} />
                        Auto-Detect
                    </button>
                    <button
                        className={`mode-tab ${mode === 'manual' ? 'active' : ''}`}
                        onClick={() => setMode('manual')}
                    >
                        <MapPin size={18} />
                        Manual Selection
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="location-error">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                {/* Auto Mode */}
                {mode === 'auto' && (
                    <div className="auto-mode-content">
                        {isLoading ? (
                            <div className="location-loading">
                                <div className="spinner-large"></div>
                                <p>Detecting your location...</p>
                                <p className="help-text">Please allow location access when prompted</p>
                            </div>
                        ) : position ? (
                            <div className="location-detected">
                                <div className="location-icon-success">
                                    <Check size={48} />
                                </div>
                                <h3>Location Detected!</h3>
                                <div className="location-details">
                                    <p className="location-address">{address}</p>
                                    <p className="location-coords">
                                        📍 {position[0].toFixed(6)}, {position[1].toFixed(6)}
                                    </p>
                                </div>
                                <button className="btn-retry" onClick={handleAutoDetect}>
                                    <Navigation size={18} />
                                    Detect Again
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Manual Mode */}
                {mode === 'manual' && (
                    <div className="manual-mode-content">
                        <div className="map-instructions">
                            <MapPin size={16} />
                            <span>Click anywhere on the map to select your exact location</span>
                        </div>

                        <div className="map-container">
                            <MapContainer
                                center={position}
                                zoom={13}
                                style={{ height: '400px', width: '100%', borderRadius: '8px' }}
                                ref={mapRef}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker position={position} setPosition={setPosition} />
                            </MapContainer>
                        </div>

                        {address && (
                            <div className="selected-location-info">
                                <p className="location-label">Selected Location:</p>
                                <p className="location-address">{address}</p>
                                <p className="location-coords">
                                    📍 Lat: {position[0].toFixed(6)}, Lon: {position[1].toFixed(6)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="location-picker-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleConfirm}
                        disabled={!position || isLoading}
                    >
                        <Check size={18} />
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
