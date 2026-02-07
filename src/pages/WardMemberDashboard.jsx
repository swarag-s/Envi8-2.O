import { useState } from 'react';
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
    User
} from 'lucide-react';
import './WardMemberDashboard.css';

const WardMemberDashboard = ({ onLogout, userName = "Suresh Menon", wardNumber = "14" }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [tokenSearchId, setTokenSearchId] = useState('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [aiCheckResult, setAiCheckResult] = useState(null);

    // Mock data
    const stats = {
        ticketsRaised: 432,
        ticketsRaisedChange: -0,
        solvedTickets: 385,
        solvedRate: 5,
        pendingTickets: 47,
        backlog: 'Action Required'
    };

    const queueStatus = {
        balanceTokens: 12,
        dailyGoal: 75,
        dailyGoalProgress: 75
    };

    const tickets = [
        {
            id: 'TK-4092',
            description: 'Street Light Flicker',
            location: 'South junction post #42 malfuncti...',
            date: 'Oct 24, 2023',
            status: 'In Progress',
            priority: 'medium'
        },
        {
            id: 'TK-4091',
            description: 'Water Pipe Leakage',
            location: 'Major leak near Govt School entr...',
            date: 'Oct 24, 2023',
            status: 'Urgent',
            priority: 'high'
        },
        {
            id: 'TK-4088',
            description: 'Waste Collection Missed',
            location: 'Sector 4 residential area bin over...',
            date: 'Oct 23, 2023',
            status: 'Pending',
            priority: 'low'
        },
        {
            id: 'TK-4085',
            description: 'Pothole Repair',
            location: 'Main market road, dangerous for ...',
            date: 'Oct 23, 2023',
            status: 'Assigned',
            priority: 'medium'
        },
        {
            id: 'TK-4082',
            description: 'Drainage Cleaning',
            location: 'Pre-monsoon cleaning request, l...',
            date: 'Oct 22, 2023',
            status: 'Pending',
            priority: 'low'
        }
    ];

    const departmentUpdates = [
        {
            department: 'Water Authority',
            message: 'Scheduled maintenance in Ward 14 postponed to tomorrow.',
            time: '30 mins ago',
            icon: '💧'
        },
        {
            department: 'PWD Engineer',
            message: 'Road patchwork for Token #TK-4022 completed.',
            time: '2h ago',
            icon: '🔧'
        },
        {
            department: 'Health Dept',
            message: 'Mosquito fogging schedule updated for evening.',
            time: '4h ago',
            icon: '🏥'
        }
    ];

    const analyticsData = {
        resolvedTasks: { count: 42, trend: '+5 this week', color: '#10B981' },
        pendingApprovals: { count: 15, trend: 'Urgent-3', color: '#F59E0B' },
        fundUtilization: { amount: '₹ 2.4L', progress: 60, color: '#8B5CF6' },
        satisfaction: { percentage: '92%', trend: 'Good', color: '#10B981' }
    };

    const departmentProgress = [
        { name: 'Sanitation', subtitle: 'Waste collection & street sweeping', resolved: 34, pending: 6, target: 90, progress: 85, color: '#10B981' },
        { name: 'Roads & Infrastructure', subtitle: 'Potholes & maintenance', resolved: 9, pending: 11, target: 75, progress: 45, color: '#6B7280' },
        { name: 'Electricity (KSEB)', subtitle: 'Streetlights & outages', resolved: 23, pending: 2, target: 95, progress: 92, color: '#F59E0B' },
        { name: 'Water Authority', subtitle: 'Pipe leaks & supply', resolved: 12, pending: 8, target: 80, progress: 60, color: '#3B82F6' }
    ];

    const recentTaskUpdates = [
        { id: '#TK-8821', title: 'Street Light Repair', location: 'Ch1 Station Rd, Ward 14', status: 'SOLVED', time: '2h ago' },
        { id: '#TK-8845', title: 'Drainage Cleaning', location: 'Near Govt School', status: 'PENDING', time: '5h ago' },
        { id: '#TK-8780', title: 'Water Pipe Leakage', location: 'Beach Road Junction', status: 'IN PROGRESS', time: '1d ago' },
        { id: '#TK-8555', title: 'Garbage Pileup Removal', location: 'Market Area', status: 'SOLVED', time: '2d ago' }
    ];

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                // Simulate AI detection API call
                checkAIGenerated(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const checkAIGenerated = async (imageData) => {
        // Simulate API call to AI detection service
        setAiCheckResult({ checking: true });

        setTimeout(() => {
            // Mock result - in production, call actual AI detection API
            const isAI = Math.random() > 0.8; // 20% chance of AI detection
            setAiCheckResult({
                checking: false,
                isAI: isAI,
                confidence: isAI ? 87 : 12,
                message: isAI
                    ? 'Warning: This image appears to be AI-generated'
                    : 'Image verified as authentic'
            });
        }, 2000);
    };

    const handleSubmitSolution = () => {
        if (aiCheckResult && !aiCheckResult.isAI) {
            alert('Solution submitted successfully!');
            setUploadModalOpen(false);
            setUploadedImage(null);
            setAiCheckResult(null);
            setSelectedTicket(null);
        } else {
            alert('Cannot submit AI-generated images. Please upload authentic photo.');
        }
    };

    const renderDashboard = () => (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1>Ward {wardNumber} Overview</h1>
                </div>
                <div className="header-actions">
                    <button className="queue-status-badge">
                        <span className="status-dot"></span>
                        QUEUE ACTIVE
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
                        <span className="stat-label">TICKETS RAISED</span>
                        <div className="stat-icon blue">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.ticketsRaised}</div>
                    <div className="stat-footer">
                        <span className="stat-change neutral">{stats.ticketsRaisedChange}%</span>
                        <span className="stat-subtitle">NEW COMPLAINTS THIS WEEK</span>
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
                        <span className="stat-change positive">+{stats.solvedRate}%</span>
                        <span className="stat-subtitle">RESOLUTION RATE</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">PENDING TICKETS</span>
                        <div className="stat-icon orange">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.pendingTickets}</div>
                    <div className="stat-footer">
                        <span className="stat-badge warning">⚠️ {stats.backlog}</span>
                        <span className="stat-subtitle">BACKLOG</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="main-grid">
                {/* Token Queue */}
                <div className="token-queue-section">
                    <div className="section-header">
                        <div className="section-title">
                            <ClipboardList size={20} />
                            <h3>Token Queue</h3>
                        </div>
                        <p className="section-subtitle">Manage incoming citizen requests in order</p>
                    </div>

                    {/* Search Token */}
                    <div className="token-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Enter Token ID"
                            value={tokenSearchId}
                            onChange={(e) => setTokenSearchId(e.target.value)}
                        />
                    </div>

                    {/* Token Table */}
                    <div className="token-table">
                        <div className="table-header">
                            <div className="th token-id">TOKEN ID</div>
                            <div className="th issue-desc">ISSUE DESCRIPTION</div>
                            <div className="th date">DATE</div>
                            <div className="th status">STATUS</div>
                            <div className="th action">ACTION</div>
                        </div>
                        <div className="table-body">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="table-row">
                                    <div className="td token-id">
                                        <strong>{ticket.id}</strong>
                                    </div>
                                    <div className="td issue-desc">
                                        <div className="issue-title">{ticket.description}</div>
                                        <div className="issue-location">{ticket.location}</div>
                                    </div>
                                    <div className="td date">{ticket.date}</div>
                                    <div className="td status">
                                        <span className={`status-badge ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="td action">
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
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="right-sidebar">
                    {/* Queue Status */}
                    <div className="queue-status-card">
                        <div className="queue-status-header">
                            <h3>QUEUE STATUS</h3>
                        </div>
                        <div className="balance-tokens">
                            <div className="balance-number">{queueStatus.balanceTokens}</div>
                            <p style={{ color: 'white' }}>Balance tokens to be solved today</p>
                        </div>
                        <div className="daily-goal">
                            <div className="goal-header">
                                <span>Daily Goal</span>
                                <span className="goal-percentage">{queueStatus.dailyGoalProgress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${queueStatus.dailyGoalProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <button className="btn-process-token">Process Next Token</button>
                    </div>

                    {/* Department Updates */}
                    <div className="department-updates">
                        <h3>Department Updates</h3>
                        <div className="updates-list">
                            {departmentUpdates.map((update, index) => (
                                <div key={index} className="update-item">
                                    <div className="update-icon">{update.icon}</div>
                                    <div className="update-content">
                                        <div className="update-dept">{update.department}</div>
                                        <div className="update-message">{update.message}</div>
                                        <div className="update-time">{update.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="analytics-content">
            <div className="analytics-header">
                <div>
                    <h1>Ward Performance Analytics</h1>
                    <p className="subtitle">Ward {wardNumber} • Last updated: Just now</p>
                </div>
                <div className="weather-widget">
                    <span>☀️ 28°C, Kozhikode</span>
                    <span className="humidity">Humidity: 78%</span>
                </div>
            </div>

            {/* Analytics Stats */}
            <div className="analytics-stats-grid">
                <div className="analytics-stat-card">
                    <div className="stat-icon-badge blue">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-number">{analyticsData.resolvedTasks.count}</div>
                        <div className="stat-label">Resolved Tasks</div>
                        <div className="stat-trend positive">{analyticsData.resolvedTasks.trend}</div>
                    </div>
                    <div className="stat-progress-mini">
                        <div className="progress-bar-mini" style={{ width: '70%', background: analyticsData.resolvedTasks.color }}></div>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon-badge orange">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-number">{analyticsData.pendingApprovals.count}</div>
                        <div className="stat-label">Pending Approvals</div>
                        <div className="stat-trend warning">{analyticsData.pendingApprovals.trend}</div>
                    </div>
                    <div className="stat-progress-mini">
                        <div className="progress-bar-mini" style={{ width: '40%', background: analyticsData.pendingApprovals.color }}></div>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon-badge purple">
                        <BarChart3 size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-number">{analyticsData.fundUtilization.amount}</div>
                        <div className="stat-label">Fund Utilization</div>
                        <div className="stat-trend">FY 2024-25</div>
                    </div>
                    <div className="stat-progress-mini">
                        <div className="progress-bar-mini" style={{ width: `${analyticsData.fundUtilization.progress}%`, background: analyticsData.fundUtilization.color }}></div>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon-badge green">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-number">{analyticsData.satisfaction.percentage}</div>
                        <div className="stat-label">Constituent Satisfaction</div>
                        <div className="stat-trend positive">{analyticsData.satisfaction.trend}</div>
                    </div>
                    <div className="stat-progress-mini">
                        <div className="progress-bar-mini" style={{ width: '92%', background: analyticsData.satisfaction.color }}></div>
                    </div>
                </div>
            </div>

            {/* Department Progress */}
            <div className="department-progress-section">
                <div className="section-header-row">
                    <h2>Department Task Progress</h2>
                    <div className="view-toggle">
                        <button className="toggle-btn">Weekly</button>
                        <button className="toggle-btn active">Monthly</button>
                    </div>
                </div>

                <div className="progress-cards">
                    {departmentProgress.map((dept, index) => (
                        <div key={index} className="progress-card">
                            <div className="progress-card-header">
                                <div className="dept-icon" style={{ background: `${dept.color}20`, color: dept.color }}>
                                    {dept.name === 'Sanitation' && '🗑️'}
                                    {dept.name === 'Roads & Infrastructure' && '🛣️'}
                                    {dept.name === 'Electricity (KSEB)' && '💡'}
                                    {dept.name === 'Water Authority' && '💧'}
                                </div>
                                <div className="dept-info">
                                    <h4>{dept.name}</h4>
                                    <p>{dept.subtitle}</p>
                                </div>
                                <div className="dept-percentage">
                                    <span className="percentage-value">{dept.progress}%</span>
                                    <span className="percentage-label">Target: {dept.target}%</span>
                                </div>
                            </div>
                            <div className="progress-bar-large">
                                <div
                                    className="progress-fill-large"
                                    style={{ width: `${dept.progress}%`, background: dept.color }}
                                ></div>
                            </div>
                            <div className="progress-stats">
                                <span className="stat-item">{dept.resolved} Resolved</span>
                                <span className="stat-item pending">{dept.pending} Pending {dept.pending > 10 ? '(Critical)' : ''}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Task Updates */}
            <div className="recent-tasks-section">
                <div className="section-header-row">
                    <h2>Recent Task Updates</h2>
                    <button className="view-all-btn">View All</button>
                </div>
                <div className="task-updates-list">
                    {recentTaskUpdates.map((task, index) => (
                        <div key={index} className="task-update-item">
                            <div className="task-id-badge">{task.id}</div>
                            <div className="task-details">
                                <h4>{task.title}</h4>
                                <p>{task.location}</p>
                            </div>
                            <span className={`task-status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                                {task.status}
                            </span>
                            <span className="task-time">{task.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDepartmentTasks = () => (
        <div className="department-tasks-content">
            <div className="tasks-header">
                <h1>Task Management</h1>
                <div className="weather-info">
                    <span>☁️ Kozhikode: 28°C, Light Rain</span>
                </div>
            </div>

            {/* Task Stats */}
            <div className="task-stats">
                <div className="task-stat">
                    <div className="stat-label">RAISED</div>
                    <div className="stat-number">42</div>
                    <div className="stat-change">+3 Today</div>
                </div>
                <div className="task-stat">
                    <div className="stat-label">SOLVED</div>
                    <div className="stat-number green">18</div>
                    <div className="stat-change">88.5% Rate</div>
                </div>
                <div className="task-stat">
                    <div className="stat-label">PENDING</div>
                    <div className="stat-number orange">24</div>
                    <div className="stat-change">Avg 2d</div>
                </div>
            </div>

            {/* Token Management & Department Tasks Grid */}
            <div className="tasks-main-grid">
                <div className="token-management-card">
                    <div className="card-header">
                        <div className="card-icon">🎫</div>
                        <div>
                            <h3>Token Management</h3>
                            <p>Track status or assign tasks manually</p>
                        </div>
                    </div>

                    <div className="token-input-section">
                        <label>ENTER TOKEN ID</label>
                        <div className="token-input-group">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="e.g. WARD-14-882"
                                value={tokenSearchId}
                                onChange={(e) => setTokenSearchId(e.target.value)}
                            />
                            <button className="check-btn">Check</button>
                        </div>
                    </div>

                    {tokenSearchId && (
                        <div className="token-details-card">
                            <div className="token-status-badge processing">PROCESSING</div>
                            <h4>#WARD-14-882</h4>
                            <p>Drainage blockage reported near Government High School. Photo evidence verified.</p>

                            <div className="assign-section">
                                <label>ASSIGN DEPARTMENT</label>
                                <select className="department-select">
                                    <option>Sanitation & Waste Management</option>
                                    <option>Water Authority</option>
                                    <option>PWD</option>
                                    <option>KSEB</option>
                                </select>
                                <button className="update-assignment-btn">UPDATE ASSIGNMENT</button>
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button className="action-btn new-task">
                            <CheckCircle2 size={20} />
                            New Task
                        </button>
                        <button className="action-btn broadcast">
                            <Bell size={20} />
                            Broadcast
                        </button>
                    </div>
                </div>

                {/* Department Tasks List */}
                <div className="department-tasks-list">
                    <div className="list-header">
                        <h3>Department Tasks</h3>
                        <select className="filter-select">
                            <option>All Departments</option>
                            <option>Sanitation</option>
                            <option>Water Authority</option>
                            <option>PWD</option>
                            <option>KSEB</option>
                        </select>
                    </div>

                    <div className="tasks-table">
                        <div className="tasks-table-header">
                            <div>ISSUE / TOKEN</div>
                            <div>DEPARTMENT</div>
                            <div>STATUS</div>
                            <div>ASSIGNEE</div>
                            <div>ACTION</div>
                        </div>
                        <div className="tasks-table-body">
                            {[
                                { issue: 'Waste Pileup', token: '#WARD-14-901', dept: 'Sanitation', status: 'Delayed', assignee: 'RM Menon', time: '30m ago' },
                                { issue: 'Broken Pipe', token: '#WARD-14-885', dept: 'Water Auth', status: 'In Progress', assignee: 'AS Singh', time: '4h ago' },
                                { issue: 'Street Light Out', token: '#WARD-14-820', dept: 'KSEB', status: 'Resolved', assignee: 'JP J. Paul', time: 'Yesterday' },
                                { issue: 'Pothole Repair', token: '#WARD-14-912', dept: 'PWD', status: 'Unassigned', assignee: '--', time: '15m ago' },
                                { issue: 'Waterlogging', token: '#WARD-14-889', dept: 'Water Auth', status: 'Scheduled', assignee: 'VK V. Kumar', time: '1h ago' }
                            ].map((task, index) => (
                                <div key={index} className="task-row">
                                    <div className="task-issue">
                                        <div className="priority-dot"></div>
                                        <div>
                                            <div className="issue-name">{task.issue}</div>
                                            <div className="issue-token">{task.token}</div>
                                            <div className="issue-time">• {task.time}</div>
                                        </div>
                                    </div>
                                    <div className="task-dept">
                                        <span className="dept-badge">{task.dept}</span>
                                    </div>
                                    <div className="task-status">
                                        <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                                            {task.status === 'Delayed' && '🔴 '}
                                            {task.status}
                                        </span>
                                    </div>
                                    <div className="task-assignee">
                                        <div className="assignee-avatar">{task.assignee.split(' ').map(n => n[0]).join('')}</div>
                                        <span>{task.assignee}</span>
                                    </div>
                                    <div className="task-action">
                                        <button
                                            className="upload-btn"
                                            onClick={() => {
                                                setSelectedTicket({ id: task.token, description: task.issue });
                                                setUploadModalOpen(true);
                                            }}
                                        >
                                            <Upload size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="table-footer">
                        Showing 5 of 24 pending tasks
                        <div className="pagination">
                            <button>Prev</button>
                            <button>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="ward-dashboard">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">🏛️</div>
                        <div className="logo-text">
                            <div className="logo-title">CivicAI</div>
                            <div className="logo-subtitle">WARD MEMBER PORTAL</div>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveSection('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveSection('analytics')}
                    >
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'tasks' ? 'active' : ''}`}
                        onClick={() => setActiveSection('tasks')}
                    >
                        <ClipboardList size={20} />
                        <span>Department Tasks</span>
                    </button>
                    <button className="nav-item">
                        <Settings size={20} />
                        <span>Ward Settings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            <User size={20} />
                        </div>
                        <div className="user-info">
                            <div className="user-name">{userName}</div>
                            <div className="user-role">Ward {wardNumber} Councilor</div>
                        </div>
                        <button className="logout-btn" onClick={onLogout}>
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
                {activeSection === 'dashboard' && renderDashboard()}
                {activeSection === 'analytics' && renderAnalytics()}
                {activeSection === 'tasks' && renderDepartmentTasks()}
            </div>

            {/* Upload Modal */}
            {uploadModalOpen && (
                <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Upload Solution Photo</h2>
                            <button className="close-btn" onClick={() => setUploadModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {selectedTicket && (
                                <div className="ticket-info">
                                    <strong>{selectedTicket.id}</strong>
                                    <p>{selectedTicket.description}</p>
                                </div>
                            )}

                            <div className="upload-area">
                                {!uploadedImage ? (
                                    <label className="upload-label">
                                        <Upload size={48} />
                                        <p>Click to upload or drag and drop</p>
                                        <span>PNG, JPG up to 10MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            hidden
                                        />
                                    </label>
                                ) : (
                                    <div className="uploaded-preview">
                                        <img src={uploadedImage} alt="Uploaded" />
                                    </div>
                                )}
                            </div>

                            {aiCheckResult && (
                                <div className={`ai-check-result ${aiCheckResult.isAI ? 'warning' : 'success'}`}>
                                    {aiCheckResult.checking ? (
                                        <div className="checking">
                                            <div className="spinner"></div>
                                            <p>Verifying image authenticity...</p>
                                        </div>
                                    ) : (
                                        <div className="result">
                                            <div className="result-icon">
                                                {aiCheckResult.isAI ? '⚠️' : '✅'}
                                            </div>
                                            <div className="result-text">
                                                <strong>{aiCheckResult.message}</strong>
                                                <p>Confidence: {aiCheckResult.confidence}%</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => setUploadModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-submit"
                                onClick={handleSubmitSolution}
                                disabled={!uploadedImage || aiCheckResult?.checking || aiCheckResult?.isAI}
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

export default WardMemberDashboard;
