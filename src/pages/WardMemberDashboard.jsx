import { useState, useEffect } from "react";
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
  Megaphone,
} from "lucide-react";
import { useIssues } from "../context/IssueContext";
import "./WardMemberDashboard.css";
import "./WardPlacesStyles.css";

const WardMemberDashboard = ({
  onLogout,
  userName = "Suresh Menon",
  wardNumber = "14",
}) => {
  const {
    issues,
    updateIssueStatus,
    wardPlaces,
    addWardPlace,
    updateWardPlace,
    deleteWardPlace,
    getIssueByToken,
  } = useIssues();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [tokenSearchId, setTokenSearchId] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [aiCheckResult, setAiCheckResult] = useState(null);
  const [searchedTokenIssue, setSearchedTokenIssue] = useState(null);
  const [showTokenDetailsModal, setShowTokenDetailsModal] = useState(false);

  // Ward Places State
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [newPlace, setNewPlace] = useState({
    name: "",
    type: "Landmark",
    latitude: "",
    longitude: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter issues for this ward
  const wardIssues = issues.filter(
    (issue) => issue.ward === `Ward ${wardNumber}`,
  );
  const myPlaces = wardPlaces[wardNumber] || [];

  const stats = {
    ticketsRaised: wardIssues.length,
    solvedTickets: wardIssues.filter((i) => i.status === "Solved").length,
    pendingTickets: wardIssues.filter((i) => i.status === "Pending").length,
  };

  const handleTokenSearch = () => {
    if (!tokenSearchId) return;

    const issue = getIssueByToken(tokenSearchId);
    if (issue) {
      setSearchedTokenIssue(issue);
      setShowTokenDetailsModal(true);
      setTokenSearchId(""); // Clear search
    } else {
      alert("Token ID not found!");
    }
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
            message: "Image verified as authentic",
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSolution = () => {
    if (selectedTicket) {
      updateIssueStatus(selectedTicket.tokenId, "Solved");
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
      setNewPlace({ name: "", type: "Landmark", latitude: "", longitude: "" });
      setEditingPlace(null);
    }
  };

  const openEditPlace = (place) => {
    setEditingPlace(place);
    setNewPlace(place);
    setShowPlaceModal(true);
  };

  const handleDeletePlace = (id) => {
    if (window.confirm("Delete this place?")) {
      deleteWardPlace(wardNumber, id);
    }
  };

  const renderWardPlaces = () => {
    // Pagination logic moved to top level state to respect Rules of Hooks
    const ITEMS_PER_PAGE = 9;

    const totalPages = Math.ceil(myPlaces.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPlaces = myPlaces.slice(startIndex, endIndex);

    return (
      <div className="ward-places-content">
        <div className="places-header-main">
          <div>
            <h1>Ward Places Management</h1>
            <p className="subtitle">
              Manage landmarks and locations in Ward {wardNumber}
            </p>
          </div>
          <button
            className="add-place-btn-primary"
            onClick={() => {
              setEditingPlace(null);
              setNewPlace({
                name: "",
                type: "Landmark",
                latitude: "",
                longitude: "",
                description: "",
              });
              setShowPlaceModal(true);
            }}
          >
            <Plus size={18} />
            Add New Ward Place
          </button>
        </div>

        {myPlaces.length === 0 ? (
          <div className="empty-places-state">
            <MapPin size={64} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <h3>No places added yet</h3>
            <p>
              Start by adding landmarks, schools, hospitals, and other important
              locations.
            </p>
            <button
              className="add-place-btn-empty"
              onClick={() => {
                setEditingPlace(null);
                setNewPlace({
                  name: "",
                  type: "Landmark",
                  latitude: "",
                  longitude: "",
                  description: "",
                });
                setShowPlaceModal(true);
              }}
            >
              <Plus size={18} />
              Add Your First Place
            </button>
          </div>
        ) : (
          <>
            <div className="places-grid-large">
              {currentPlaces.map((place) => (
                <div key={place.id} className="place-card-large">
                  <div className="place-card-image">
                    <div
                      className={`place-gradient ${(place.type || "Landmark").toLowerCase()}`}
                    >
                      <div className="place-type-tag">
                        {(place.type || "LANDMARK").toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="place-card-content">
                    <h3 className="place-title">{place.name}</h3>
                    <div className="place-location-info">
                      <MapPin size={14} />
                      <span>
                        Ward {wardNumber}, {place.type || "General Area"}
                      </span>
                    </div>
                    <p className="place-description">
                      {place.description ||
                        `Located at coordinates ${place.latitude}, ${place.longitude}. This ${(place.type || "landmark").toLowerCase()} serves as an important reference point for citizens.`}
                    </p>
                    <div className="place-card-actions">
                      <button
                        className="btn-edit-place"
                        onClick={() => openEditPlace(place)}
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        className="btn-delete-place"
                        onClick={() => handleDeletePlace(place.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="place-card-large add-new-card"
                onClick={() => {
                  setEditingPlace(null);
                  setNewPlace({
                    name: "",
                    type: "Landmark",
                    latitude: "",
                    longitude: "",
                    description: "",
                  });
                  setShowPlaceModal(true);
                }}
              >
                <div className="add-new-content">
                  <MapPin size={48} style={{ opacity: 0.3 }} />
                  <h4>Add New Place</h4>
                  <p>Create a new location card</p>
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="places-pagination">
                <div className="pagination-info">
                  Showing <strong>{startIndex + 1}</strong> to{" "}
                  <strong>{Math.min(endIndex, myPlaces.length)}</strong> of{" "}
                  <strong>{myPlaces.length}</strong> places
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1>Ward {wardNumber} Overview</h1>
        </div>
        <div className="header-actions">
          <button className="notification-btn">
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="main-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">TICKETS RAISED</span>
                <div className="stat-icon blue">
                  <BarChart3 size={24} />
                </div>
              </div>
              <div className="stat-value">{stats.ticketsRaised}</div>
              <div className="stat-footer">
                <span className="stat-change positive">↑0%</span>
                <span className="stat-subtext">NEW COMPLAINTS THIS WEEK</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">SOLVED TICKETS</span>
                <div className="stat-icon green">
                  <CheckCircle2 size={24} />
                </div>
              </div>
              <div className="stat-value">{stats.solvedTickets}</div>
              <div className="stat-footer">
                <span className="stat-change positive">↑45%</span>
                <span className="stat-subtext">RESOLUTION RATE</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">PENDING TICKETS</span>
                <div className="stat-icon orange">
                  <AlertCircle size={24} />
                </div>
              </div>
              <div className="stat-value">{stats.pendingTickets}</div>
              <div className="stat-footer">
                <span className="stat-change warning">⚠ Action Required</span>
                <span className="stat-subtext">BACKLOG</span>
              </div>
            </div>
          </div>

          {/* Token Queue Section */}
          <div className="token-queue-section">
            <div className="section-header">
              <div className="section-title-group">
                <h3>Token Queue</h3>
                <p>Manage incoming citizen requests in order</p>
              </div>
              <div className="search-bar-container">
                <input
                  type="text"
                  placeholder="Enter Token ID"
                  value={tokenSearchId}
                  onChange={(e) => setTokenSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTokenSearch()}
                />
                <button onClick={handleTokenSearch} className="search-btn">
                  <Search size={18} />
                </button>
              </div>
            </div>
            <div className="token-table">
              <div className="table-header">
                <div className="th">TOKEN ID</div>
                <div className="th">ISSUE DESCRIPTION</div>
                <div className="th">DATE</div>
                <div className="th">STATUS</div>
                <div className="th">ACTION</div>
              </div>
              <div className="table-body">
                {wardIssues.length === 0 ? (
                  <div className="empty-state">No issues reported yet.</div>
                ) : (
                  wardIssues.slice(0, 5).map((ticket) => (
                    <div key={ticket.tokenId} className="table-row">
                      <div className="td">
                        <strong>{ticket.tokenId}</strong>
                      </div>
                      <div className="td">{ticket.title}</div>
                      <div className="td">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                      <div className="td">
                        <span
                          className={`status-badge ${ticket.status.toLowerCase()}`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <div className="td">
                        <button
                          className="btn-review"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setUploadModalOpen(true);
                          }}
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          {/* Queue Status Card */}
          <div className="queue-status-card">
            <div className="queue-status-header">
              <h4>QUEUE STATUS</h4>
            </div>
            <div className="queue-count">{stats.pendingTickets}</div>
            <div className="queue-subtitle">
              Balance tokens to be solved today
            </div>

            <div className="queue-stat">
              <div className="queue-stat-label">Daily Goal</div>
              <div className="queue-stat-bar">
                <div className="queue-stat-fill" style={{ width: "75%" }}></div>
              </div>
              <div className="queue-stat-percent">75%</div>
            </div>

            <button className="btn-process-token">Process Next Token</button>
          </div>

          {/* Department Updates */}
          <div className="department-updates">
            <h4>Department Updates</h4>
            <div className="updates-list">
              <div className="update-item">
                <div className="update-icon water">💧</div>
                <div className="update-content">
                  <div className="update-title">Water Authority</div>
                  <div className="update-desc">
                    Scheduled maintenance in Ward 14 postponed to tomorrow.
                  </div>
                  <div className="update-time">10 mins ago</div>
                </div>
              </div>
              <div className="update-item">
                <div className="update-icon engineer">🔧</div>
                <div className="update-content">
                  <div className="update-title">PWD Engineer</div>
                  <div className="update-desc">
                    Road patch-work for Token #TK-4922 completed.
                  </div>
                  <div className="update-time">29 ago</div>
                </div>
              </div>
              <div className="update-item">
                <div className="update-icon health">🏥</div>
                <div className="update-content">
                  <div className="update-title">Health Dept</div>
                  <div className="update-desc">
                    Mosquito fogging schedule updated for evening.
                  </div>
                  <div className="update-time">4h ago</div>
                </div>
              </div>
            </div>
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
            <div className="logo-icon">
              <Megaphone size={24} />
            </div>
            <div className="logo-text">
              <div className="logo-title" style={{ color: "#F9FAFB" }}>
                JanaShabdha
              </div>
              <div className="logo-subtitle" style={{ color: "#F9FAFB" }}>
                WARD MEMBER
              </div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeSection === "places" ? "active" : ""}`}
            onClick={() => setActiveSection("places")}
          >
            <MapPin size={20} /> <span>Ward Places</span>
          </button>
          <button className="nav-item">
            <Settings size={20} /> <span>Settings</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">Ward {wardNumber}</div>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        {activeSection === "dashboard" && renderDashboard()}
        {activeSection === "places" && renderWardPlaces()}
      </div>

      {/* Upload Solution Modal */}
      {uploadModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setUploadModalOpen(false)}
        >
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
              <div
                className={`ai-result ${aiCheckResult.isAI ? "warning" : "success"}`}
              >
                {aiCheckResult.checking
                  ? "Verifying..."
                  : aiCheckResult.message}
              </div>
            )}
            <div className="modal-footer">
              <button onClick={() => setUploadModalOpen(false)}>Cancel</button>
              <button
                className="btn-submit"
                onClick={handleSubmitSolution}
                disabled={!uploadedImage}
              >
                Mark Solved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Token Details Modal */}
      {showTokenDetailsModal && searchedTokenIssue && (
        <div
          className="modal-overlay"
          onClick={() => setShowTokenDetailsModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px" }}
          >
            <div className="modal-header">
              <h2>Issue Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowTokenDetailsModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: "2rem" }}>
              <div className="searched-issue-details">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    className={`status-badge ${searchedTokenIssue.status.toLowerCase()}`}
                  >
                    {searchedTokenIssue.status}
                  </span>
                  <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                    {new Date(searchedTokenIssue.createdAt).toLocaleString()}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  {searchedTokenIssue.title}
                </h3>
                <p style={{ color: "#6B7280", marginBottom: "1.5rem" }}>
                  Token ID:{" "}
                  <strong style={{ color: "#111827" }}>
                    {searchedTokenIssue.tokenId}
                  </strong>
                </p>

                {searchedTokenIssue.imageUrl && (
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={searchedTokenIssue.imageUrl}
                      alt="Issue"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Location
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {searchedTokenIssue.location ||
                        searchedTokenIssue.placeName}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                      {searchedTokenIssue.ward}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Department
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {searchedTokenIssue.department}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Category
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {searchedTokenIssue.category || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Urgency
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        color:
                          searchedTokenIssue.urgency === "High"
                            ? "#EF4444"
                            : "#10B981",
                      }}
                    >
                      {searchedTokenIssue.urgency}
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Description
                  </div>
                  <p style={{ lineHeight: "1.5", color: "#374151" }}>
                    {searchedTokenIssue.description}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="modal-footer"
              style={{
                borderTop: "1px solid #E5E7EB",
                padding: "1rem 2rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button
                className="btn-cancel"
                onClick={() => setShowTokenDetailsModal(false)}
              >
                Close
              </button>
              <button
                className="btn-submit"
                onClick={() => {
                  setShowTokenDetailsModal(false);
                  setSelectedTicket(searchedTokenIssue);
                  setUploadModalOpen(true);
                }}
              >
                Take Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Place Modal */}
      {showPlaceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingPlace ? "Edit Place" : "Add New Place"}</h2>
            <div className="form-group">
              <label>Place Name</label>
              <input
                value={newPlace.name}
                onChange={(e) =>
                  setNewPlace({ ...newPlace, name: e.target.value })
                }
                placeholder="e.g. Mananchira Square"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={newPlace.type}
                onChange={(e) =>
                  setNewPlace({ ...newPlace, type: e.target.value })
                }
                className="select-field"
              >
                <option>Landmark</option>
                <option>School</option>
                <option>Hospital</option>
                <option>Office</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                value={newPlace.description || ""}
                onChange={(e) =>
                  setNewPlace({ ...newPlace, description: e.target.value })
                }
                placeholder="Brief description of this location..."
                className="textarea-field"
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Lat</label>
                <input
                  value={newPlace.latitude}
                  onChange={(e) =>
                    setNewPlace({ ...newPlace, latitude: e.target.value })
                  }
                  placeholder="11.25..."
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Lng</label>
                <input
                  value={newPlace.longitude}
                  onChange={(e) =>
                    setNewPlace({ ...newPlace, longitude: e.target.value })
                  }
                  placeholder="75.78..."
                  className="input-field"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowPlaceModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleSavePlace}>
                Save Place
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardMemberDashboard;
