import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Bell,
  Camera,
  MapPin,
  Upload,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  User,
  Home,
  ChevronRight,
  Video,
  Copy,
  Check,
  StopCircle,
  Navigation,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { useIssues } from "../context/IssueContext";
import {
  analyzeIssueImage,
  detectWardFromPlace,
} from "../services/geminiService";
import LocationPicker from "../components/LocationPicker";
import "./CitizenDashboard.css";

const CitizenDashboard = ({
  onLogout,
  userName = "Arun Kumar",
  ward = "Ward 14",
}) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStep, setReportStep] = useState(1);
  const [reportMode, setReportMode] = useState("manual"); // 'manual' or 'ai'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadType, setUploadType] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedTokenId, setGeneratedTokenId] = useState("");
  const [copiedToken, setCopiedToken] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllImpact, setShowAllImpact] = useState(false);

  // Video recording
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  const videoRecorderRef = useRef(null);

  // Context & AI State
  const { addIssue, wardPlaces } = useIssues();
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isDetectingWard, setIsDetectingWard] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // Load available places for autocomplete
  useEffect(() => {
    const allPlaces = [];
    if (wardPlaces) {
      Object.entries(wardPlaces).forEach(([wardNum, places]) => {
        places.forEach((place) => {
          allPlaces.push({
            ...place,
            ward: `Ward ${wardNum}`,
          });
        });
      });
      setAvailablePlaces(allPlaces);
    }
  }, [wardPlaces]);

  const [reportData, setReportData] = useState({
    location: "",
    latitude: null,
    longitude: null,
    landmark: "",
    category: "",
    urgency: "Normal",
    description: "",
    detectedDepartment: "",
    detectedCategory: "",
    severity_level: "",
    location_details: "",
    action_required: "",
    confidence: 0,
    what_happened: "",
    observations: "",
  });

  const stats = {
    issuesRaised: 12,
    newThisMonth: 2,
    problemsSolved: 8,
    resolutionRate: 66,
    pendingIssues: 4,
    status: "In Progress",
  };

  const recentTokens = [
    {
      id: "#TK-4992",
      title: "Street Light Flicker",
      location: "South junction post #42 malfunctioning",
      date: "Oct 24",
      status: "In Progress",
      department: "KSEB",
    },
    {
      id: "#TK-3941",
      title: "Water Pipe Leakage",
      location: "Major leak near Govt School entrance",
      date: "Oct 12",
      status: "Solved",
      department: "Water Authority",
    },
    {
      id: "#TK-3822",
      title: "Pothole Repair",
      location: "Main market road, dangerous for bikes",
      date: "Sep 30",
      status: "Solved",
      department: "PWD",
    },
    {
      id: "#TK-4168",
      title: "Drainage Block",
      location: "Over flowing drain near bakery",
      date: "Yesterday",
      status: "Pending",
      department: "Sanitation",
    },
  ];

  const communityImpact = [
    {
      title: "Street Light Fixed",
      description:
        "The flickering light at 4th Cross Road has been repaired by KSEB",
      icon: "💡",
      color: "#FFA500",
    },
    {
      title: "Waste cleared",
      description:
        "Illegal dumping site near the park has been cleared and fenced.",
      icon: "🗑️",
      color: "#10B981",
    },
  ];

  // Get current location using Geolocation API
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocoding using OpenStreetMap Nominatim API (free alternative to Google Maps)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          const address =
            data.display_name ||
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          setReportData({
            ...reportData,
            location: address,
            latitude: latitude,
            longitude: longitude,
          });
        } catch (error) {
          console.error("Error getting address:", error);
          setReportData({
            ...reportData,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            latitude: latitude,
            longitude: longitude,
          });
        }

        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enter manually.");
        setIsLoadingLocation(false);
      },
    );
  };

  // Video recording functions
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });

      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      videoRecorderRef.current = mediaRecorder;

      const videoChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        videoChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(videoBlob);
        setUploadedFile(videoBlob);
        setUploadPreview(videoUrl);
        setUploadType("video");
        stream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
        setIsRecordingVideo(false);
      };

      mediaRecorder.start();
      setIsRecordingVideo(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorderRef.current && isRecordingVideo) {
      videoRecorderRef.current.stop();
    }
  };

  const handleModeChange = async (mode) => {
    setReportMode(mode);

    // If switching to AI mode and an image is already uploaded
    if (
      mode === "ai" &&
      uploadedFile &&
      uploadedFile.type.startsWith("image")
    ) {
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeIssueImage(uploadedFile);
        setReportData((prev) => ({
          ...prev,
          category: analysis.category,
          description: analysis.description,
          urgency: analysis.urgency,
          detectedDepartment: analysis.department,
          detectedCategory: analysis.category,
          severity_level: analysis.severity_level,
          location_details: analysis.location_details,
          action_required: analysis.action_required,
          confidence: analysis.confidence,
          what_happened: analysis.what_happened || "",
          observations: analysis.observations || "",
        }));
      } catch (error) {
        console.error("AI Analysis failed:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setUploadPreview(reader.result);
        setUploadType(file.type.startsWith("video") ? "video" : "image");

        // If AI mode is active, analyze the image
        if (reportMode === "ai" && file.type.startsWith("image")) {
          setIsAnalyzing(true);
          try {
            const analysis = await analyzeIssueImage(file);

            // Auto-fill form with AI results
            setReportData((prev) => ({
              ...prev,
              category: analysis.category,
              description: analysis.description,
              urgency: analysis.urgency,
              detectedDepartment: analysis.department,
              detectedCategory: analysis.category,
              severity_level: analysis.severity_level,
              location_details: analysis.location_details,
              action_required: analysis.action_required,
              confidence: analysis.confidence,
              what_happened: analysis.what_happened || "",
              observations: analysis.observations || "",
            }));
          } catch (error) {
            console.error("AI Analysis failed:", error);
            // Fallback or error message could be added here
          } finally {
            setIsAnalyzing(false);
          }
        }
      };
      reader.readAsDataURL(file);
      setUploadedFile(file);
    }
  };

  const handleLocationSelect = (locationInfo) => {
    setReportData((prev) => ({
      ...prev,
      latitude: locationInfo.lat,
      longitude: locationInfo.lng,
      location: locationInfo.address,
    }));

    // If address is specific, we could use it for place name too
    if (locationInfo.address && !placeName) {
      const firstPart = locationInfo.address.split(",")[0];
      setPlaceName(firstPart);
      handlePlaceNameChange(firstPart);
    }
  };

  const handlePlaceNameChange = async (value) => {
    setPlaceName(value);
    if (value.length > 3) {
      setIsDetectingWard(true);
      try {
        const detection = await detectWardFromPlace(value, wardPlaces);
        if (detection.wardNumber) {
          setReportData((prev) => ({
            ...prev,
            ward: `Ward ${detection.wardNumber}`,
            matchedPlace: detection.matchedPlace,
          }));
        }
      } catch (error) {
        console.error("Ward detection failed:", error);
      } finally {
        setIsDetectingWard(false);
      }
    }
  };

  // Handle report submission
  const handleSubmitReport = async () => {
    // Generate Token
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const tokenId = `TK-${ward.replace("Ward ", "")}-${timestamp.toString().slice(-6)}-${random.toString().padStart(3, "0")}`;

    const newIssue = {
      tokenId,
      title: `${reportData.category || "Civic"} Issue`,
      description: reportData.description,
      category: reportData.category,
      urgency: reportData.urgency,
      location: reportData.location,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      landmark: reportData.landmark,
      placeName: placeName,
      ward: ward,
      status: "Pending",
      department: reportData.detectedDepartment || "Pending Assignment",
      userName: userName,
      imageUrl: uploadPreview,
      imageType: uploadType,
      createdAt: new Date().toISOString(),
    };

    // Add to shared context
    addIssue(newIssue);

    setGeneratedTokenId(tokenId);
    setCopiedToken(false);
    setShowReportModal(false);
    setShowSuccessModal(true);

    // Reset form
    setTimeout(() => {
      setReportStep(1);
      setUploadedFile(null);
      setUploadPreview(null);
      setUploadType(null);
      setPlaceName("");
      setReportData({
        location: "",
        latitude: null,
        longitude: null,
        landmark: "",
        category: "",
        urgency: "Normal",
        description: "",
        detectedDepartment: "",
        detectedCategory: "",
      });
    }, 500);
  };

  // Copy token ID to clipboard
  const copyTokenId = () => {
    navigator.clipboard.writeText(generatedTokenId);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const renderDashboard = () => (
    <div className="citizen-dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1>My Overview</h1>
        </div>
        <div className="header-actions">
          <span className="online-badge">
            <span className="online-dot"></span>
            ONLINE
          </span>
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="citizen-stats-grid">
        <div className="citizen-stat-card blue">
          <div className="stat-header">
            <div>
              <div className="stat-label">ISSUES RAISED</div>
              <div className="stat-value">{stats.issuesRaised}</div>
              <div className="stat-change">
                +{stats.newThisMonth} New{" "}
                <span className="muted">THIS MONTH</span>
              </div>
            </div>
            <div className="stat-icon-badge blue">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="citizen-stat-card green">
          <div className="stat-header">
            <div>
              <div className="stat-label">PROBLEMS SOLVED</div>
              <div className="stat-value">{stats.problemsSolved}</div>
              <div className="stat-change">
                {stats.resolutionRate}% Rate{" "}
                <span className="muted">RESOLUTION SUCCESS</span>
              </div>
            </div>
            <div className="stat-icon-badge green">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="citizen-stat-card orange">
          <div className="stat-header">
            <div>
              <div className="stat-label">PENDING ISSUES</div>
              <div className="stat-value">{stats.pendingIssues}</div>
              <div className="stat-change">
                {stats.status} <span className="muted">AWAITING ACTION</span>
              </div>
            </div>
            <div className="stat-icon-badge orange">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="citizen-main-grid">
        {/* Report Section */}
        <div className="report-section">
          <div className="report-card">
            <div className="report-icon">
              <Camera size={48} />
            </div>
            <h3>Report a New Issue</h3>
            <p>
              Spot a problem in your neighborhood? Take a photo and report it
              instantly to your ward member.
            </p>
            <button
              className="btn-start-reporting"
              onClick={() => setShowReportModal(true)}
            >
              <Camera size={20} />
              Start Reporting
            </button>
          </div>

          {/* Community Impact */}
          <div className="community-impact">
            <div className="section-header-row">
              <h3>Community Impact</h3>
              <button
                className="view-all-link"
                onClick={() => setShowAllImpact(true)}
              >
                View All
              </button>
            </div>
            <p className="section-subtitle">
              Recent resolved issues in your ward
            </p>

            <div className="impact-list">
              {communityImpact.map((item, index) => (
                <div key={index} className="impact-item">
                  <div
                    className="impact-icon"
                    style={{ background: `${item.color}20` }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                  </div>
                  <div className="impact-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tokens */}
        <div className="recent-tokens-section">
          <div className="section-header-row">
            <div>
              <h3>
                <Clock size={20} />
                My Recent Tokens
              </h3>
              <p className="section-subtitle">Track status of your reports</p>
            </div>
          </div>

          <div className="tokens-list">
            {recentTokens.map((token, index) => (
              <div key={index} className="token-item">
                <div className="token-header">
                  <span className="token-id">{token.id}</span>
                  <span className="token-date">{token.date}</span>
                </div>
                <h4 className="token-title">{token.title}</h4>
                <p className="token-location">{token.location}</p>
                <div className="token-footer">
                  <span
                    className={`status-badge ${token.status.toLowerCase().replace(" ", "-")}`}
                  >
                    {token.status === "Solved" && "● "}
                    {token.status === "In Progress" && "◐ "}
                    {token.status === "Pending" && "○ "}
                    {token.status}
                  </span>
                  <ChevronRight size={16} className="token-arrow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyReports = () => (
    <div className="my-reports-content">
      <div className="dashboard-header">
        <h1>My Reports</h1>
      </div>
      <div className="reports-list">
        {recentTokens.map((token, index) => (
          <div key={index} className="report-card-item">
            <div className="report-card-header">
              <span className="token-id-large">{token.id}</span>
              <span
                className={`status-badge ${token.status.toLowerCase().replace(" ", "-")}`}
              >
                {token.status}
              </span>
            </div>
            <h3>{token.title}</h3>
            <p className="report-location">
              <MapPin size={14} />
              {token.location}
            </p>
            <div className="report-meta">
              <span>Department: {token.department}</span>
              <span>Submitted: {token.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="citizen-dashboard">
      {/* Sidebar */}
      <div className="citizen-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon citizen">
              <Megaphone size={24} />
            </div>
            <div className="logo-text">
              <div className="logo-title" style={{ color: "#F9FAFB" }}>
                JanaShabdha
              </div>
              <div className="logo-subtitle" style={{ color: "#F9FAFB" }}>
                CITIZEN PORTAL
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeSection === "reports" ? "active" : ""}`}
            onClick={() => setActiveSection("reports")}
          >
            <FileText size={20} />
            <span>My Reports</span>
          </button>
          <button className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile citizen">
            <div className="user-avatar citizen">
              <User size={20} />
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">Resident, {ward}</div>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="citizen-main">
        {activeSection === "dashboard" && renderDashboard()}
        {activeSection === "reports" && renderMyReports()}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="modal-content report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Report a New Issue</h2>
              <button
                className="close-btn"
                onClick={() => setShowReportModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="report-steps">
              <div className={`step ${reportStep >= 1 ? "active" : ""}`}>
                <div className="step-number">1</div>
                <span>Details</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${reportStep >= 2 ? "active" : ""}`}>
                <div className="step-number">2</div>
                <span>Review</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${reportStep >= 3 ? "active" : ""}`}>
                <div className="step-number">3</div>
                <span>Submit</span>
              </div>
            </div>

            <div className="modal-body report-body">
              {reportStep === 1 && (
                <div className="report-step-content">
                  <div className="upload-section">
                    <h3>EVIDENCE UPLOAD</h3>

                    {/* Reporting Mode Toggle */}
                    <div
                      className="mode-toggle"
                      style={{
                        display: "flex",
                        background: "#F3F4F6",
                        padding: "4px",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                        width: "fit-content",
                      }}
                    >
                      <button
                        onClick={() => handleModeChange("manual")}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: "none",
                          background:
                            reportMode === "manual" ? "white" : "transparent",
                          color:
                            reportMode === "manual" ? "#111827" : "#6B7280",
                          fontWeight: reportMode === "manual" ? "600" : "500",
                          boxShadow:
                            reportMode === "manual"
                              ? "0 1px 2px rgba(0,0,0,0.1)"
                              : "none",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        Manual Entry
                      </button>
                      <button
                        onClick={() => handleModeChange("ai")}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: "none",
                          background:
                            reportMode === "ai" ? "#10B981" : "transparent",
                          color: reportMode === "ai" ? "white" : "#6B7280",
                          fontWeight: reportMode === "ai" ? "600" : "500",
                          boxShadow:
                            reportMode === "ai"
                              ? "0 1px 2px rgba(0,0,0,0.1)"
                              : "none",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Sparkles size={16} />
                        AI Detection
                      </button>
                    </div>

                    <p className="upload-subtitle">
                      {reportMode === "ai"
                        ? "Upload a photo and our AI will automatically detect the issue, category, and urgency."
                        : "Upload photos or video of the issue."}
                    </p>

                    {!uploadPreview && !isRecordingVideo ? (
                      <div className="upload-area large">
                        <label className="upload-label">
                          <Camera size={48} />
                          <p>Drag & Drop or Click to Upload</p>
                          <span>Supports JPG, PNG, MP4 (Max 25MB)</span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            hidden
                          />
                          <div className="upload-buttons">
                            <button type="button" className="upload-btn">
                              <Upload size={16} />
                              Gallery
                            </button>
                            <button
                              type="button"
                              className="upload-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                startVideoRecording();
                              }}
                            >
                              <Video size={16} />
                              Record Video
                            </button>
                          </div>
                        </label>
                      </div>
                    ) : isRecordingVideo ? (
                      <div className="video-recording-container">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          className="video-preview"
                        ></video>
                        <button
                          className="stop-recording-btn"
                          onClick={stopVideoRecording}
                        >
                          <StopCircle size={20} />
                          Stop Recording
                        </button>
                      </div>
                    ) : (
                      <div className="upload-preview">
                        {uploadType === "video" ? (
                          <video
                            src={uploadPreview}
                            controls
                            className="preview-video"
                          />
                        ) : (
                          <div style={{ position: "relative" }}>
                            <img src={uploadPreview} alt="Upload preview" />
                            {isAnalyzing && (
                              <div
                                className="ai-overlay"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: "rgba(0,0,0,0.6)",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  gap: "15px",
                                  backdropFilter: "blur(2px)",
                                }}
                              >
                                <div
                                  className="ai-spinner"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    border: "4px solid rgba(255,255,255,0.3)",
                                    borderTopColor: "white",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                  }}
                                ></div>
                                <div style={{ textAlign: "center" }}>
                                  <p
                                    style={{
                                      margin: "0 0 5px 0",
                                      fontWeight: "600",
                                    }}
                                  >
                                    🔍 Analyzing Image...
                                  </p>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "12px",
                                      opacity: 0.8,
                                    }}
                                  >
                                    Using OpenAI Vision to detect issue type
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          className="remove-upload"
                          disabled={isAnalyzing}
                          onClick={() => {
                            setUploadedFile(null);
                            setUploadPreview(null);
                            setUploadType(null);
                            // Reset AI filled data if removing image in AI mode
                            if (reportMode === "ai") {
                              setReportData((prev) => ({
                                ...prev,
                                category: "",
                                description: "",
                                urgency: "Normal",
                                detectedDepartment: "",
                                detectedCategory: "",
                              }));
                            }
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    <div className="tip-box">
                      <span className="tip-icon">💡</span>
                      <span>
                        Tip: Ensure the location is clearly visible in the
                        background for faster verification.
                      </span>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Exact Location</h3>
                    <div
                      className="location-picker-container"
                      style={{ marginBottom: "1.5rem" }}
                    >
                      <LocationPicker
                        onLocationChange={handleLocationSelect}
                        initialLocation={
                          reportData.latitude
                            ? {
                                lat: reportData.latitude,
                                lng: reportData.longitude,
                              }
                            : null
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Place Name (for Ward Detection)</label>
                      <div
                        className="place-input-wrapper"
                        style={{ position: "relative" }}
                      >
                        <input
                          type="text"
                          placeholder="Enter place name (e.g., Mananchira Square)"
                          value={placeName}
                          onChange={(e) =>
                            handlePlaceNameChange(e.target.value)
                          }
                          className="input-field"
                          list="place-suggestions"
                        />
                        {isDetectingWard && (
                          <div
                            className="ai-spinner-small"
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "16px",
                              height: "16px",
                              border: "2px solid #E5E7EB",
                              borderTopColor: "#10B981",
                              borderRadius: "50%",
                              animation: "spin 1s linear infinite",
                            }}
                          ></div>
                        )}
                      </div>
                      <datalist id="place-suggestions">
                        {availablePlaces.map((place, index) => (
                          <option key={index} value={place.name} />
                        ))}
                      </datalist>

                      {reportData.ward && (
                        <p
                          className="detected-ward-info"
                          style={{
                            color: "#10B981",
                            fontSize: "0.875rem",
                            marginTop: "0.25rem",
                          }}
                        >
                          <Check
                            size={14}
                            style={{
                              display: "inline",
                              verticalAlign: "middle",
                              marginRight: "4px",
                            }}
                          />
                          Detected: {reportData.ward}
                        </p>
                      )}

                      {reportData.detectedDepartment && (
                        <p
                          className="detected-ward-info"
                          style={{
                            color: "#10B981",
                            fontSize: "0.875rem",
                            marginTop: "0.25rem",
                          }}
                        >
                          <Sparkles
                            size={14}
                            style={{
                              display: "inline",
                              verticalAlign: "middle",
                              marginRight: "4px",
                            }}
                          />
                          Detected Department: {reportData.detectedDepartment}
                        </p>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Add landmarks or building name (optional)"
                      value={reportData.landmark}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          landmark: e.target.value,
                        })
                      }
                      className="input-field"
                    />

                    <div className="form-row">
                      <div className="form-group">
                        <label>Issue Category</label>
                        <select
                          value={reportData.category}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              category: e.target.value,
                            })
                          }
                          className="select-field"
                          style={{
                            borderColor:
                              reportData.category &&
                              reportData.detectedCategory ===
                                reportData.category
                                ? "#10b981"
                                : undefined,
                            backgroundColor:
                              reportData.category &&
                              reportData.detectedCategory ===
                                reportData.category
                                ? "#f0fdf4"
                                : undefined,
                          }}
                        >
                          <option value="">Select a category...</option>
                          <option value="Roads & Infrastructure">
                            Roads & Infrastructure
                          </option>
                          <option value="Electricity & Street Lights">
                            Electricity & Street Lights
                          </option>
                          <option value="Water Supply & Drainage">
                            Water Supply & Drainage
                          </option>
                          <option value="Sanitation & Waste">
                            Sanitation & Waste
                          </option>
                          <option value="Public Health & Hygiene">
                            Public Health & Hygiene
                          </option>
                          <option value="Traffic & Safety">
                            Traffic & Safety
                          </option>
                          <option value="Building & Structures">
                            Building & Structures
                          </option>
                          <option value="Trees & Environment">
                            Trees & Environment
                          </option>
                          <option value="Other Civic Issues">Other</option>
                        </select>
                        {reportData.detectedCategory &&
                          reportData.detectedCategory ===
                            reportData.category && (
                            <span
                              className="detail-text"
                              style={{
                                display: "block",
                                marginTop: "4px",
                                color: "#10b981",
                                fontSize: "0.75rem",
                              }}
                            >
                              ✅ Auto-selected by AI
                            </span>
                          )}
                      </div>

                      <div className="form-group">
                        <label>Urgency Level</label>
                        <div className="urgency-buttons">
                          {["Normal", "High", "Critical"].map((level) => (
                            <button
                              key={level}
                              type="button"
                              className={`urgency-btn ${reportData.urgency === level ? "active" : ""}`}
                              onClick={() =>
                                setReportData({ ...reportData, urgency: level })
                              }
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Detailed Description</label>
                      <textarea
                        placeholder="Please describe the issue in detail. Eg: The street light has been flickering for 3 days..."
                        value={reportData.description}
                        onChange={(e) =>
                          setReportData({
                            ...reportData,
                            description: e.target.value,
                          })
                        }
                        className="textarea-field"
                        rows="4"
                      ></textarea>
                      <div className="char-count">
                        {reportData.description.length}/500 characters
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportStep === 2 && (
                <div className="review-step government-form">
                  <div className="form-header">
                    <h3>Government of Kerala</h3>
                    <p className="form-subtitle" style={{ color: "white" }}>
                      Civic Issue Report Form
                    </p>
                    <p className="form-number" style={{ color: "white" }}>
                      Form No: CIR-2026
                    </p>
                  </div>

                  <div className="form-body">
                    <div className="form-section">
                      <h4>Applicant Details</h4>
                      <div className="form-field-row">
                        <div className="form-field">
                          <label>Name:</label>
                          <span>{userName}</span>
                        </div>
                        <div className="form-field">
                          <label>Ward:</label>
                          <span>{ward}</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Issue Details</h4>
                      <div className="form-field">
                        <label>Location:</label>
                        <span>{reportData.location}</span>
                      </div>
                      {reportData.landmark && (
                        <div className="form-field">
                          <label>Landmark:</label>
                          <span>{reportData.landmark}</span>
                        </div>
                      )}
                      <div className="form-field-row">
                        <div className="form-field">
                          <label>Category:</label>
                          <span>{reportData.category || "Not specified"}</span>
                        </div>
                        <div className="form-field">
                          <label>Urgency:</label>
                          <span
                            className={`urgency-tag ${reportData.urgency.toLowerCase()}`}
                          >
                            {reportData.urgency}
                          </span>
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Description:</label>
                        <p className="description-text">
                          {reportData.description}
                        </p>
                      </div>

                      {reportData.what_happened && (
                        <div className="form-field">
                          <label className="what-happened-label">
                            🔍 What Happened (AI Analysis):
                          </label>
                          <div className="what-happened-box">
                            {reportData.what_happened}
                          </div>
                        </div>
                      )}

                      {reportData.observations && (
                        <div className="form-field">
                          <label className="observations-label">
                            📌 Additional Observations:
                          </label>
                          <div className="observations-box">
                            {reportData.observations}
                          </div>
                        </div>
                      )}

                      {reportData.severity_level && (
                        <>
                          <div className="form-field-row">
                            <div className="form-field">
                              <label>Severity Level:</label>
                              <span
                                className={`severity-tag ${reportData.severity_level.toLowerCase()}`}
                              >
                                {reportData.severity_level}
                              </span>
                            </div>
                            <div className="form-field">
                              <label>AI Confidence:</label>
                              <span className="confidence-score">
                                {(reportData.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          {reportData.location_details && (
                            <div className="form-field">
                              <label>Location Details (AI):</label>
                              <p className="detail-text">
                                {reportData.location_details}
                              </p>
                            </div>
                          )}

                          {reportData.action_required && (
                            <div className="form-field">
                              <label>Recommended Action:</label>
                              <p className="detail-text">
                                {reportData.action_required}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="form-section">
                      <h4>Evidence Attached</h4>
                      <div className="form-field">
                        <label>Media Type:</label>
                        <span>
                          {uploadType === "video"
                            ? "Video Recording"
                            : "Photograph"}
                        </span>
                      </div>
                      {uploadPreview && (
                        <div className="evidence-preview">
                          {uploadType === "video" ? (
                            <video
                              src={uploadPreview}
                              controls
                              className="review-media"
                            />
                          ) : (
                            <img
                              src={uploadPreview}
                              alt="Evidence"
                              className="review-media"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="form-section">
                      <h4>Coordinates</h4>
                      <div className="form-field-row">
                        <div className="form-field">
                          <label>Latitude:</label>
                          <span>
                            {reportData.latitude?.toFixed(6) || "N/A"}
                          </span>
                        </div>
                        <div className="form-field">
                          <label>Longitude:</label>
                          <span>
                            {reportData.longitude?.toFixed(6) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-declaration">
                      <p>
                        I hereby declare that the information provided above is
                        true and accurate to the best of my knowledge.
                      </p>
                      <div className="signature-section">
                        <div>
                          <label>Date:</label>
                          <span>{new Date().toLocaleDateString("en-IN")}</span>
                        </div>
                        <div>
                          <label>Applicant:</label>
                          <span>{userName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {reportStep > 1 && (
                <button
                  className="btn-secondary"
                  onClick={() => setReportStep(reportStep - 1)}
                >
                  Back
                </button>
              )}
              <button
                className="btn-save-draft"
                onClick={() => setShowReportModal(false)}
              >
                Save Draft
              </button>
              {reportStep < 2 ? (
                <button
                  className="btn-primary"
                  onClick={() => setReportStep(reportStep + 1)}
                  disabled={
                    !uploadedFile ||
                    !reportData.description ||
                    !reportData.location
                  }
                >
                  Next
                </button>
              ) : (
                <button className="btn-submit" onClick={handleSubmitReport}>
                  Submit Report →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay success-overlay">
          <div className="success-modal">
            <div className="success-animation-container">
              <div className="success-checkmark-circle">
                <CheckCircle2 size={80} className="success-checkmark" />
              </div>
              <h2>Report Submitted Successfully!</h2>
              <p>
                Your civic issue has been registered and will be reviewed by the
                concerned department.
              </p>

              <div className="token-id-container">
                <label>Your Unique Token ID:</label>
                <div className="token-id-box">
                  <span className="token-id-display">#{generatedTokenId}</span>
                  <button className="copy-token-btn" onClick={copyTokenId}>
                    {copiedToken ? (
                      <>
                        <Check size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="token-note">
                  Save this ID to track your report status
                </p>
              </div>

              <div className="department-info">
                <p>
                  <strong>Assigned Department:</strong>{" "}
                  {reportData.detectedDepartment || "Processing..."}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {reportData.detectedCategory || "Processing..."}
                </p>
              </div>

              <button
                className="btn-close-success"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div
          className="modal-overlay"
          onClick={() => setShowNotifications(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Notifications</h3>
              <button
                className="modal-close"
                onClick={() => setShowNotifications(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="notification-item">
                <div className="notification-dot"></div>
                <div className="notification-text">
                  <p className="notification-title">
                    Issue #2024-001 Acknowledged
                  </p>
                  <p className="notification-time">2 hours ago</p>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-dot"></div>
                <div className="notification-text">
                  <p className="notification-title">
                    Your report has been assigned
                  </p>
                  <p className="notification-time">1 day ago</p>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-dot"></div>
                <div className="notification-text">
                  <p className="notification-title">
                    Issue resolved successfully
                  </p>
                  <p className="notification-time">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Community Impact Modal */}
      {showAllImpact && (
        <div className="modal-overlay" onClick={() => setShowAllImpact(false)}>
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Community Impact</h3>
              <button
                className="modal-close"
                onClick={() => setShowAllImpact(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="impact-grid">
                <div className="impact-card">
                  <span className="impact-icon">🛣️</span>
                  <p className="impact-title">Roads Repaired</p>
                  <p className="impact-count">234+</p>
                  <p className="impact-time">Last 30 days</p>
                </div>
                <div className="impact-card">
                  <span className="impact-icon">💡</span>
                  <p className="impact-title">Lights Installed</p>
                  <p className="impact-count">156+</p>
                  <p className="impact-time">Last 30 days</p>
                </div>
                <div className="impact-card">
                  <span className="impact-icon">💧</span>
                  <p className="impact-title">Water Issues Fixed</p>
                  <p className="impact-count">89+</p>
                  <p className="impact-time">Last 30 days</p>
                </div>
                <div className="impact-card">
                  <span className="impact-icon">🎯</span>
                  <p className="impact-title">Active Issues</p>
                  <p className="impact-count">45+</p>
                  <p className="impact-time">Currently tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
