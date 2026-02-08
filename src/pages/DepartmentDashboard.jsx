import { useState } from "react";
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
  Building,
  Megaphone,
} from "lucide-react";
import { useIssues } from "../context/IssueContext";
import "./DepartmentDashboard.css";

const DepartmentDashboard = ({
  onLogout,
  departmentName = "Water Authority",
  udnNumber = "WA-KZD-001",
}) => {
  // =======================
  // HOOKS
  // =======================
  const { issues = [], getIssueByToken, updateIssue } = useIssues();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [tokenSearchId, setTokenSearchId] = useState("");
  const [searchedTokenIssue, setSearchedTokenIssue] = useState(null);
  const [showTokenDetailsModal, setShowTokenDetailsModal] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [aiCheckResult, setAiCheckResult] = useState(null);

  // =======================
  // SAFE DATA DERIVATION
  // =======================
  const departmentIssues = Array.isArray(issues)
    ? issues.filter(
      (issue) =>
        issue?.department === departmentName ||
        issue?.department === "Pending Assignment" ||
        issue?.department?.includes(departmentName),
    )
    : [];

  const tickets = departmentIssues;

  const stats = {
    ticketsAssigned: tickets.length,
    ticketsAssignedChange: Math.max(0, Math.floor(Math.random() * 5)),
    solvedTickets: tickets.filter((t) => t.status === "Solved").length,
    solvedRate:
      tickets.length > 0
        ? Math.round(
          (tickets.filter((t) => t.status === "Solved").length /
            tickets.length) *
          100,
        )
        : 0,
    pendingTickets: tickets.filter(
      (t) => t.status === "Pending" || t.status === "In Progress",
    ).length,
    backlog: tickets.filter((t) => t.status === "Pending").length,
  };

  // 🔥 FIXED: queueStatus (WAS CAUSING WHITE SCREEN)
  const queueStatus = {
    balanceTokens: tickets.filter(
      (t) => t.status === "Pending" || t.status === "In Progress",
    ).length,
    dailyGoalProgress:
      tickets.length > 0
        ? Math.round(
          (tickets.filter((t) => t.status === "Solved").length /
            tickets.length) *
          100,
        )
        : 0,
  };

  // =======================
  // STATIC UI DATA (UNCHANGED)
  // =======================
  const departmentUpdates = [
    {
      department: "Ward 14 Council",
      message: "New complaint registered for pipeline leak.",
      time: "15 mins ago",
      icon: "🏛️",
    },
    {
      department: "Central Office",
      message: "Monthly performance review scheduled for tomorrow.",
      time: "1h ago",
      icon: "📋",
    },
    {
      department: "Ward 8 Council",
      message: "Urgent: Water supply issue needs immediate attention.",
      time: "3h ago",
      icon: "⚠️",
    },
  ];

  const departmentTasksData = [
    {
      name: "Sanitation",
      description: "Waste Collection & Street Sweeping",
      resolved: 34,
      pending: 8,
      progress: 85,
      target: 90,
      color: "#14B8A6",
      icon: "🗑️",
    },
    {
      name: "Roads & Infrastructure",
      description: "Potholes & Maintenance",
      resolved: 9,
      pending: 11,
      progress: 45,
      target: 75,
      color: "#6B7280",
      icon: "🛣️",
    },
    {
      name: "Electricity (KSEB)",
      description: "Streetlights & Outages",
      resolved: 23,
      pending: 2,
      progress: 92,
      target: 95,
      color: "#FBBF24",
      icon: "💡",
    },
    {
      name: "Water Authority",
      description: "Pipe Leaks & Supply",
      resolved: 12,
      pending: 8,
      progress: 60,
      target: 85,
      color: "#3B82F6",
      icon: "💧",
    },
  ];

  const recentTaskUpdates = [
    {
      id: "#TK-8821",
      title: "Street Light Repair",
      location: "Opp Market St, Ward 14",
      status: "SOLVED",
      time: "2h ago",
      icon: "✅",
      color: "#10B981",
    },
    {
      id: "#TK-8845",
      title: "Drainage Cleaning",
      location: "Near School, Ward 8",
      status: "PENDING",
      time: "5h ago",
      icon: "⏳",
      color: "#F59E0B",
    },
    {
      id: "#TK-8790",
      title: "Water Pipe Leakage",
      location: "Beach Rd Junction",
      status: "IN PROGRESS",
      time: "1d ago",
      icon: "🔧",
      color: "#3B82F6",
    },
    {
      id: "#TK-8855",
      title: "Garbage Pileup Removal",
      location: "Market Area",
      status: "SOLVED",
      time: "2d ago",
      icon: "✅",
      color: "#10B981",
    },
  ];

  const proposalData = {
    total: 12,
    approved: 8,
    underReview: 3,
    draft: 1,
  };

  const topConcerns = [
    {
      title: "Pothole Water Shortage",
      count: 42,
      color: "#EF4444",
      width: "100%",
    },
    { title: "Waste Management", count: 28, color: "#F59E0B", width: "67%" },
    { title: "Stray Dog Nuisance", count: 15, color: "#EC4899", width: "36%" },
  ];

  // =======================
  // HANDLERS (UNCHANGED LOGIC)
  // =======================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
      checkAIGenerated();
    };
    reader.readAsDataURL(file);
  };

  const checkAIGenerated = () => {
    setAiCheckResult({ checking: true });
    setTimeout(() => {
      const isAI = Math.random() > 0.8;
      setAiCheckResult({
        checking: false,
        isAI,
        confidence: isAI ? 87 : 12,
        message: isAI
          ? "Warning: This image appears to be AI-generated"
          : "Image verified as authentic",
      });
    }, 1500);
  };

  const handleTokenSearch = () => {
    if (!tokenSearchId) return;
    const issue = getIssueByToken(tokenSearchId);
    if (!issue) return alert("Token ID not found!");

    setSearchedTokenIssue(issue);
    setShowTokenDetailsModal(true);
    setTokenSearchId("");
  };

  const handleSubmitSolution = () => {
    if (!selectedTicket) return;

    updateIssue(selectedTicket.tokenId, {
      status: "Solved",
      resolutionImage: uploadedImage,
      resolvedAt: new Date().toISOString(),
    });

    alert("Solution submitted successfully!");
    setUploadModalOpen(false);
    setUploadedImage(null);
    setAiCheckResult(null);
    setSelectedTicket(null);
  };

  // =======================
  // RENDER FUNCTIONS
  // =======================

  // Analytics View
  const renderAnalytics = () => (
    <div className="analytics-page">
      {/* Header with Weather & Search */}
      <div className="analytics-header-section">
        <div className="header-title">
          <h1>Ward Performance Analytics</h1>
          <p>Ward 14 • Last updated: Just now</p>
        </div>
        <div className="header-controls">
          <div className="weather-widget">
            <span>☀️ 28°C, Kozhikode</span>
            <span className="humidity">Humidity: 78%</span>
          </div>
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search Token ID..." />
          </div>
          <button className="notification-btn">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Analytics Stats Cards */}
      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div className="stat-icon resolved">✓</div>
          <div className="stat-value">42</div>
          <div className="stat-label">Resolved Tasks</div>
          <div className="stat-trend positive">+5 this week</div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-icon urgent">⚡</div>
          <div className="stat-value">15</div>
          <div className="stat-label">Pending Approvals</div>
          <div className="stat-trend urgent-text">Urgent-3</div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-icon fund">💰</div>
          <div className="stat-value">₹ 2.4L</div>
          <div className="stat-label">Fund Utilization</div>
          <div className="stat-note">FY 2024-25</div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-icon satisfaction">😊</div>
          <div className="stat-value">92%</div>
          <div className="stat-label">Constituent Satisfaction</div>
          <div className="stat-trend positive">Good</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="analytics-main-grid">
        {/* Left: Department Task Progress */}
        <div className="analytics-left-section">
          {/* Department Task Progress */}
          <div className="department-task-progress">
            <div className="section-header">
              <h2>📊 Department Task Progress</h2>
              <div className="view-toggle">
                <button className="toggle-btn">Weekly</button>
                <button className="toggle-btn active">Monthly</button>
              </div>
            </div>

            <div className="task-progress-list">
              {departmentTasksData.map((task, idx) => (
                <div key={idx} className="task-progress-item">
                  <div className="task-header">
                    <div className="task-icon-title">
                      <span className="task-icon">{task.icon}</span>
                      <div className="task-info">
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                      </div>
                    </div>
                    <div className="task-metrics">
                      <span className="progress-percentage">
                        {task.progress}%
                      </span>
                      <span className="target">Target: {task.target}%</span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: task.color,
                      }}
                    ></div>
                  </div>
                  <div className="task-stats">
                    <span className="resolved">{task.resolved} Resolved</span>
                    <span className="pending">{task.pending} Pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proposal Status Overview */}
          <div className="proposal-status">
            <h2>Proposal Status Overview</h2>
            <div className="proposal-pie">
              <div className="pie-number">{proposalData.total}</div>
              <div className="pie-label">Total</div>
            </div>
            <div className="proposal-legend">
              <div className="legend-item">
                <span className="dot approved"></span>
                <span className="label">Approved: {proposalData.approved}</span>
              </div>
              <div className="legend-item">
                <span className="dot review"></span>
                <span className="label">
                  Under Review: {proposalData.underReview}
                </span>
              </div>
              <div className="legend-item">
                <span className="dot draft"></span>
                <span className="label">Draft: {proposalData.draft}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Updates & Concerns */}
        <div className="analytics-right-section">
          {/* Recent Task Updates */}
          <div className="recent-task-updates">
            <div className="section-header">
              <h2>Recent Task Updates</h2>
              <a href="#" className="view-all">
                View All
              </a>
            </div>
            <div className="updates-list">
              {recentTaskUpdates.map((update, idx) => (
                <div key={idx} className="update-item">
                  <div className="update-header">
                    <span className="token-id">{update.id}</span>
                    <span className="time">{update.time}</span>
                  </div>
                  <h4 className="update-title">{update.title}</h4>
                  <p className="update-location">{update.location}</p>
                  <div className="update-status">
                    <span
                      className={`status-badge ${update.status.toLowerCase()}`}
                    >
                      {update.status}
                    </span>
                    <span className="icon" style={{ color: update.color }}>
                      {update.icon}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Citizen Concerns */}
          <div className="top-citizen-concerns">
            <h2>Top Citizen Concerns</h2>
            <div className="concerns-list">
              {topConcerns.map((concern, idx) => (
                <div key={idx} className="concern-item">
                  <div className="concern-header">
                    <span className="concern-title">{concern.title}</span>
                    <span className="concern-count">
                      {concern.count} Reports
                    </span>
                  </div>
                  <div className="concern-bar-container">
                    <div
                      className="concern-bar"
                      style={{
                        width: concern.width,
                        backgroundColor: concern.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // =======================
  // RENDER
  // =======================
  return (
    <div className="ward-dashboard department">
      {/* SIDEBAR */}
      <div className="dashboard-sidebar dept">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon dept">
              <Megaphone size={24} />
            </div>
            <div className="logo-text">
              <div className="logo-title">JanaShabdha</div>
              <div className="logo-subtitle">DEPARTMENT PORTAL</div>
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
            className={`nav-item ${activeSection === "analytics" ? "active" : ""}`}
            onClick={() => setActiveSection("analytics")}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
          <button
            className={`nav-item ${activeSection === "tasks" ? "active" : ""}`}
            onClick={() => setActiveSection("tasks")}
          >
            <ClipboardList size={20} />
            <span>Department Tasks</span>
          </button>
          <button className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile dept">
            <div className="user-avatar dept">
              <Building size={20} />
            </div>
            <div className="user-info">
              <div className="user-name">{departmentName}</div>
              <div className="user-role">{udnNumber}</div>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-main">
        {activeSection === "dashboard" && (
          <div className="dashboard-section">
            {/* Header */}
            <div className="section-header-top">
              <div>
                <h1 className="dept-title">{departmentName} Dashboard</h1>
                <p className="dept-subtitle">
                  Monitor and manage department tickets
                </p>
              </div>
              <div className="header-actions">
                <div className="date-badge">
                  📅 {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Main Ticket Stats */}
            <div className="ticket-stats-grid">
              <div className="ticket-stat-card received">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon-circle">📥</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.ticketsAssigned}</div>
                  <div className="stat-label">Tickets Received</div>
                  <div className="stat-change positive">
                    +{stats.ticketsAssignedChange} today
                  </div>
                </div>
                <div className="stat-progress">
                  <div
                    className="stat-progress-bar"
                    style={{ width: "75%", background: "#3b82f6" }}
                  ></div>
                </div>
              </div>

              <div className="ticket-stat-card solved">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon-circle">✅</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.solvedTickets}</div>
                  <div className="stat-label">Solved Tickets</div>
                  <div className="stat-change positive">
                    {stats.solvedRate}% completion
                  </div>
                </div>
                <div className="stat-progress">
                  <div
                    className="stat-progress-bar"
                    style={{ width: `${stats.solvedRate}%`, background: "#10b981" }}
                  ></div>
                </div>
              </div>

              <div className="ticket-stat-card pending">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon-circle">⏳</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.pendingTickets}</div>
                  <div className="stat-label">Pending Tickets</div>
                  <div className="stat-change warning">
                    {stats.backlog} in backlog
                  </div>
                </div>
                <div className="stat-progress">
                  <div
                    className="stat-progress-bar"
                    style={{
                      width: `${(stats.pendingTickets / stats.ticketsAssigned) * 100}%`,
                      background: "#f59e0b",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Token Queue and Search Section */}
            <div className="queue-search-section">
              {/* Token Queue Card */}
              <div className="token-queue-card">
                <div className="queue-header">
                  <h3>
                    <span className="queue-icon">🎫</span> Token Queue
                  </h3>
                  <div className="queue-badge live">
                    <span className="pulse-dot"></span> Live
                  </div>
                </div>

                <div className="queue-stats">
                  <div className="queue-stat-item balance">
                    <div className="queue-stat-label">Balance Tokens</div>
                    <div className="queue-stat-value">
                      {queueStatus.balanceTokens}
                    </div>
                    <div className="queue-stat-sublabel">
                      Tokens to be solved
                    </div>
                  </div>

                  <div className="queue-divider"></div>

                  <div className="queue-stat-item goal">
                    <div className="queue-stat-label">Daily Goal Progress</div>
                    <div className="queue-progress-circle">
                      <svg viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeDasharray={`${queueStatus.dailyGoalProgress * 2.827} 282.7`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="progress-text">
                        {queueStatus.dailyGoalProgress}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unique Token ID Search */}
              <div className="token-search-card">
                <div className="search-header">
                  <h3>
                    <span className="search-icon">🔍</span> Search Token
                  </h3>
                </div>

                <div className="search-body">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="token-input"
                      placeholder="Enter Unique Token ID (e.g., TK-8821)"
                      value={tokenSearchId}
                      onChange={(e) => setTokenSearchId(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleTokenSearch();
                      }}
                    />
                    <button
                      className="search-btn"
                      onClick={handleTokenSearch}
                      disabled={!tokenSearchId}
                    >
                      Search
                    </button>
                  </div>

                  <div className="search-hints">
                    <span className="hint-item">💡 Tip: Use format TK-XXXX</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Tickets Table */}
            <div className="recent-tickets-section">
              <div className="section-header-inline">
                <h3>📋 Recent Tickets</h3>
                <button className="view-all-btn">
                  View All <span>→</span>
                </button>
              </div>

              <div className="tickets-table">
                <div className="table-header">
                  <div className="th token-col">Token ID</div>
                  <div className="th title-col">Title</div>
                  <div className="th location-col">Location</div>
                  <div className="th status-col">Status</div>
                  <div className="th time-col">Time</div>
                  <div className="th action-col">Action</div>
                </div>

                <div className="table-body">
                  {tickets.slice(0, 5).map((ticket, idx) => (
                    <div key={idx} className="table-row">
                      <div className="td token-col">
                        <span className="token-badge">{ticket.tokenId}</span>
                      </div>
                      <div className="td title-col">
                        <div className="ticket-title">{ticket.title}</div>
                      </div>
                      <div className="td location-col">
                        <div className="location-text">
                          {ticket.location || "N/A"}
                        </div>
                      </div>
                      <div className="td status-col">
                        <span className={`status-badge ${ticket.status.toLowerCase().replace(" ", "-")}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="td time-col">
                        <span className="time-text">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="td action-col">
                        <button
                          className="action-btn-small"
                          onClick={() => {
                            setSearchedTokenIssue(ticket);
                            setShowTokenDetailsModal(true);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "analytics" && renderAnalytics()}

        {activeSection === "tasks" && (
          <div className="department-tasks-section">
            <div className="section-header-top">
              <div>
                <h1 className="dept-title">Department Tasks</h1>
                <p className="dept-subtitle">
                  Track and manage all department tasks
                </p>
              </div>
              <div className="header-actions">
                <select className="filter-dropdown">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Solved</option>
                </select>
              </div>
            </div>

            {/* Task Categories Grid */}
            <div className="task-categories-grid">
              {departmentTasksData.map((taskCat, idx) => (
                <div key={idx} className="task-category-card">
                  <div className="category-header">
                    <div className="category-icon" style={{ background: taskCat.color }}>
                      {taskCat.icon}
                    </div>
                    <div className="category-info">
                      <h4>{taskCat.name}</h4>
                      <p>{taskCat.description}</p>
                    </div>
                  </div>

                  <div className="category-stats">
                    <div className="cat-stat">
                      <span className="cat-stat-value">{taskCat.resolved}</span>
                      <span className="cat-stat-label">Resolved</span>
                    </div>
                    <div className="cat-stat">
                      <span className="cat-stat-value">{taskCat.pending}</span>
                      <span className="cat-stat-label">Pending</span>
                    </div>
                  </div>

                  <div className="category-progress">
                    <div className="progress-info">
                      <span className="progress-label">Progress</span>
                      <span className="progress-percentage">
                        {taskCat.progress}%
                      </span>
                    </div>
                    <div className="progress-bar-wrapper">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${taskCat.progress}%`,
                          background: taskCat.color,
                        }}
                      ></div>
                    </div>
                    <div className="target-label">
                      Target: {taskCat.target}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* All Tasks List */}
            <div className="all-tasks-list">
              <div className="section-header-inline">
                <h3>📝 All Department Tasks</h3>
                <div className="filter-group">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Solved</button>
                  <button className="filter-btn">Pending</button>
                </div>
              </div>

              <div className="tasks-grid">
                {tickets.map((task, idx) => (
                  <div key={idx} className="task-card">
                    <div className="task-card-header">
                      <span className="task-token">{task.tokenId}</span>
                      <span
                        className={`task-status-dot ${task.status.toLowerCase().replace(" ", "-")}`}
                      ></span>
                    </div>

                    <h4 className="task-card-title">{task.title}</h4>
                    <p className="task-card-location">
                      📍 {task.location || "Location not specified"}
                    </p>

                    <div className="task-card-meta">
                      <span className="meta-item">
                        🏢 {task.department || departmentName}
                      </span>
                      <span className="meta-item">
                        🕐 {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="task-card-footer">
                      <span
                        className={`task-status-badge ${task.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {task.status}
                      </span>
                      <button
                        className="task-action-btn"
                        onClick={() => {
                          setSearchedTokenIssue(task);
                          setShowTokenDetailsModal(true);
                        }}
                      >
                        Check Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Token Details Modal */}
      {showTokenDetailsModal && searchedTokenIssue && (
        <div className="modal-overlay" onClick={() => setShowTokenDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Token Details - {searchedTokenIssue.tokenId}</h3>
              <button
                className="modal-close"
                onClick={() => setShowTokenDetailsModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Title:</span>
                <span className="detail-value">{searchedTokenIssue.title}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span
                  className={`status-badge ${searchedTokenIssue.status.toLowerCase().replace(" ", "-")}`}
                >
                  {searchedTokenIssue.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">
                  {searchedTokenIssue.department || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">
                  {searchedTokenIssue.location || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">
                  {searchedTokenIssue.description || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">
                  {new Date(searchedTokenIssue.createdAt).toLocaleString()}
                </span>
              </div>

              {searchedTokenIssue.status !== "Solved" && (
                <button
                  className="action-btn-primary"
                  onClick={() => {
                    setSelectedTicket(searchedTokenIssue);
                    setUploadModalOpen(true);
                    setShowTokenDetailsModal(false);
                  }}
                >
                  Mark as Solved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Solution - {selectedTicket?.tokenId}</h3>
              <button
                className="modal-close"
                onClick={() => setUploadModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="upload-section">
                <label className="upload-label">
                  Upload Resolution Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <div className="upload-btn-wrapper">
                    <Upload size={24} />
                    <span>Choose Image</span>
                  </div>
                </label>

                {uploadedImage && (
                  <div className="image-preview">
                    <img src={uploadedImage} alt="Preview" />
                    {aiCheckResult && !aiCheckResult.checking && (
                      <div
                        className={`ai-result ${aiCheckResult.isAI ? "warning" : "success"}`}
                      >
                        {aiCheckResult.message} ({aiCheckResult.confidence}%
                        confidence)
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                className="action-btn-primary"
                onClick={handleSubmitSolution}
                disabled={!uploadedImage}
              >
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;
