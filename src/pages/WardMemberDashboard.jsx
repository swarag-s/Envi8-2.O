import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    BarChart3,
    ClipboardList,
    Settings,
    Bell,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle,
    Upload,
    X,
    LogOut,
    User,
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Megaphone
} from 'lucide-react';
import { useIssues } from '../context/IssueContext';
import './WardMemberDashboard.css';

const WardMemberDashboard = ({ onLogout, userName = "Suresh Menon", wardNumber = "14" }) => {
    const { issues, updateIssueStatus, wardPlaces, addWardPlace, updateWardPlace, deleteWardPlace } = useIssues();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [tokenSearchId, setTokenSearchId] = useState('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [aiCheckResult, setAiCheckResult] = useState(null);

    // Ward Places State
    const [showPlaceModal, setShowPlaceModal] = useState(false);
    const [editingPlace, setEditingPlace] = useState(null);
    const [newPlace, setNewPlace] = useState({ name: '', type: 'Landmark', latitude: '', longitude: '' });

    // Filter issues for this ward
    const wardIssues = issues.filter(issue => issue.ward === `Ward ${wardNumber}`);
    const myPlaces = wardPlaces[wardNumber] || [];

    // Stats
    const stats = {
        ticketsRaised: wardIssues.length,
        solvedTickets: wardIssues.filter(i => i.status === 'Solved').length,
        pendingTickets: wardIssues.filter(i => i.status === 'Pending').length,
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                // Simulate AI detection
                setAiCheckResult({ checking: true });
                setTimeout(() => {
                    setAiCheckResult({
                        checking: false,
                        isAI: false,
                        confidence: 98,
                        message: 'Image verified as authentic'
                    });
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitSolution = () => {
        if (selectedTicket) {
            updateIssueStatus(selectedTicket.tokenId, 'Solved');
            setUploadModalOpen(false);
            setUploadedImage(null);
            setAiCheckResult(null);
            setSelectedTicket(null);
        }
    };

    // Place Management
    const handleSavePlace = () => {
        if (newPlace.name) {
            if (editingPlace) {
                updateWardPlace(wardNumber, editingPlace.id, newPlace);
            } else {
                addWardPlace(wardNumber, newPlace);
            }
            setShowPlaceModal(false);
            setNewPlace({ name: '', type: 'Landmark', latitude: '', longitude: '' });
            setEditingPlace(null);
        }
    };

    const openEditPlace = (place) => {
        setEditingPlace(place);
        setNewPlace(place);
        setShowPlaceModal(true);
    };

    const handleDeletePlace = (id) => {
        if (window.confirm('Delete this place?')) {
            deleteWardPlace(wardNumber, id);
        }
    };

    const renderWardPlaces = () => (
        <div className="ward-places-content">
            <div className="section-header-row">
                <h1>Ward Places Management</h1>
                <button className="add-btn" onClick={() => {
                    setEditingPlace(null);
                    setNewPlace({ name: '', type: 'Landmark', latitude: '', longitude: '' });
                    setShowPlaceModal(true);
                }}>
                    <Plus size={18} /> Add Place
                </button>
            </div>

            <div className="places-grid">
                {myPlaces.length === 0 ? (
                    <div className="empty-state">No places added yet. Add landmarks to help citizens.</div>
                ) : (
                    myPlaces.map(place => (
                        <div key={place.id} className="place-card">
                            <div className="place-icon">
                                <MapPin size={24} />
                            </div>
                            <div className="place-info">
                                <h3>{place.name}</h3>
                                <p>{place.type}</p>
                                <span className="coords">{place.latitude}, {place.longitude}</span>
                            </div>
                            <div className="place-actions">
                                <button className="icon-btn-small" onClick={() => openEditPlace(place)}>
                                    <Edit2 size={16} />
                                </button>
                                <button className="icon-btn-small delete" onClick={() => handleDeletePlace(place.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1>Ward {wardNumber} Overview</h1>
                </div>
                <div className="header-actions">
                    <button className="queue-status-badge">
                        <span className="status-dot"></span>
                        LIVE UPDATES
                    </button>
                    <button className="icon-btn">
                        <Bell size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">TOTAL TICKETS</span>
                        <div className="stat-icon blue"><CheckCircle2 size={24} /></div>
                    </div>
                    <div className="stat-value">{stats.ticketsRaised}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">SOLVED</span>
                        <div className="stat-icon green"><CheckCircle2 size={24} /></div>
                    </div>
                    <div className="stat-value">{stats.solvedTickets}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">PENDING</span>
                        <div className="stat-icon orange"><Clock size={24} /></div>
                    </div>
                    <div className="stat-value">{stats.pendingTickets}</div>
                </div>
            </div>

            {/* Issue List */}
            <div className="token-queue-section">
                <div className="section-header">
                    <h3>Recent Issues</h3>
                </div>
                <div className="token-table">
                    <div className="table-header">
                        <div className="th">TOKEN</div>
                        <div className="th">ISSUE</div>
                        <div className="th">LOCATION</div>
                        <div className="th">STATUS</div>
                        <div className="th">ACTION</div>
                    </div>
                    <div className="table-body">
                        {wardIssues.length === 0 ? (
                            <div className="empty-state">No issues reported yet.</div>
                        ) : (
                            wardIssues.map(ticket => (
                                <div key={ticket.tokenId} className="table-row">
                                    <div className="td"><strong>{ticket.tokenId}</strong></div>
                                    <div className="td">{ticket.title}</div>
                                    <div className="td">{ticket.placeName || ticket.location}</div>
                                    <div className="td">
                                        <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="td">
                                        <button className="btn-review" onClick={() => {
                                            setSelectedTicket(ticket);
                                            setUploadModalOpen(true);
                                        }}>Review</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="ward-dashboard">
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon"><Megaphone size={24} /></div>
                        <div className="logo-text">
                            <div className="logo-title" style={{ color: '#F9FAFB' }}>JannaShabdha</div>
                            <div className="logo-subtitle" style={{ color: '#F9FAFB' }}>WARD MEMBER</div>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>
                        <LayoutDashboard size={20} /> <span>Dashboard</span>
                    </button>
                    <button className={`nav-item ${activeSection === 'places' ? 'active' : ''}`} onClick={() => setActiveSection('places')}>
                        <MapPin size={20} /> <span>Ward Places</span>
                    </button>
                    <button className="nav-item">
                        <Settings size={20} /> <span>Settings</span>
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar"><User size={20} /></div>
                        <div className="user-info">
                            <div className="user-name">{userName}</div>
                            <div className="user-role">Ward {wardNumber}</div>
                        </div>
                        <button className="logout-btn" onClick={onLogout}><LogOut size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="dashboard-main">
                {activeSection === 'dashboard' && renderDashboard()}
                {activeSection === 'places' && renderWardPlaces()}
            </div>

            {/* Upload Solution Modal */}
            {uploadModalOpen && (
                <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
                    <div className="modal-content">
                        <h2>Resolve Issue: {selectedTicket?.tokenId}</h2>
                        <div className="upload-area">
                            {!uploadedImage ? (
                                <label className="upload-label">
                                    <Upload size={48} />
                                    <p>Upload Solution Photo</p>
                                    <input type="file" onChange={handleImageUpload} hidden />
                                </label>
                            ) : (
                                <img src={uploadedImage} className="preview-img" alt="Proof" />
                            )}
                        </div>
                        {aiCheckResult && (
                            <div className={`ai-result ${aiCheckResult.isAI ? 'warning' : 'success'}`}>
                                {aiCheckResult.checking ? 'Verifying...' : aiCheckResult.message}
                            </div>
                        )}
                        <div className="modal-footer">
                            <button onClick={() => setUploadModalOpen(false)}>Cancel</button>
                            <button className="btn-submit" onClick={handleSubmitSolution} disabled={!uploadedImage}>Mark Solved</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Place Modal */}
            {showPlaceModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingPlace ? 'Edit Place' : 'Add New Place'}</h2>
                        <div className="form-group">
                            <label>Place Name</label>
                            <input
                                value={newPlace.name}
                                onChange={e => setNewPlace({ ...newPlace, name: e.target.value })}
                                placeholder="e.g. Mananchira Square"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                value={newPlace.type}
                                onChange={e => setNewPlace({ ...newPlace, type: e.target.value })}
                                className="select-field"
                            >
                                <option>Landmark</option>
                                <option>School</option>
                                <option>Hospital</option>
                                <option>Office</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Lat</label>
                                <input
                                    value={newPlace.latitude}
                                    onChange={e => setNewPlace({ ...newPlace, latitude: e.target.value })}
                                    placeholder="11.25..."
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label>Lng</label>
                                <input
                                    value={newPlace.longitude}
                                    onChange={e => setNewPlace({ ...newPlace, longitude: e.target.value })}
                                    placeholder="75.78..."
                                    className="input-field"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowPlaceModal(false)}>Cancel</button>
                            <button className="btn-submit" onClick={handleSavePlace}>Save Place</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardMemberDashboard;
