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
    User,
    Building
} from 'lucide-react';
import './DepartmentDashboard.css';

const DepartmentDashboard = ({ onLogout, departmentName = "Water Authority", udnNumber = "WA-KZD-001" }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [tokenSearchId, setTokenSearchId] = useState('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [aiCheckResult, setAiCheckResult] = useState(null);

    // Mock data - similar structure but department-specific
    const stats = {
        ticketsAssigned: 156,
        ticketsAssignedChange: 8,
        solvedTickets: 142,
        solvedRate: 91,
        pendingTickets: 14,
        backlog: 'On Track'
    };

    const queueStatus = {
        balanceTokens: 8,
        dailyGoal: 85,
        dailyGoalProgress: 85
    };

    const tickets = [
        {
            id: 'WA-4092',
            description: 'Water Pipe Burst',
            location: 'Beach Road, Ward 12',
            date: 'Oct 24, 2023',
            status: 'In Progress',
            priority: 'high',
            assignee: 'Team A'
        },
        {
            id: 'WA-4091',
            description: 'Low Water Pressure',
            location: 'Market Area, Ward 8',
            date: 'Oct 24, 2023',
            status: 'Urgent',
            priority: 'high',
            assignee: 'Team B'
        },
        {
            id: 'WA-4088',
            description: 'Water Supply Interruption',
            location: 'Residential Colony, Ward 5',
            date: 'Oct 23, 2023',
            status: 'Pending',
            priority: 'medium',
            assignee: 'Unassigned'
        },
        {
            id: 'WA-4085',
            description: 'Valve Replacement',
            location: 'Main Road Junction, Ward 14',
            date: 'Oct 23, 2023',
            status: 'Assigned',
            priority: 'medium',
            assignee: 'Team C'
        },
        {
            id: 'WA-4082',
            description: 'Pipeline Maintenance',
            location: 'School Area, Ward 10',
            date: 'Oct 22, 2023',
            status: 'Pending',
            priority: 'low',
            assignee: 'Team A'
        }
    ];

    const departmentUpdates = [
        {
            department: 'Ward 14 Council',
            message: 'New complaint registered for pipeline leak.',
            time: '15 mins ago',
            icon: '🏛️'
        },
        {
            department: 'Central Office',
            message: 'Monthly performance review scheduled for tomorrow.',
            time: '1h ago',
            icon: '📋'
        },
        {
            department: 'Ward 8 Council',
            message: 'Urgent: Water supply issue needs immediate attention.',
            time: '3h ago',
            icon: '⚠️'
        }
    ];

    const analyticsData = {
        resolvedTasks: { count: 142, trend: '+12 this month', color: '#10B981' },
        pendingApprovals: { count: 14, trend: 'Urgent-2', color: '#F59E0B' },
        teamUtilization: { percentage: '87%', progress: 87, color: '#8B5CF6' },
        avgResolutionTime: { time: '4.2h', trend: 'Improved', color: '#10B981' }
    };

    const wardProgress = [
        { ward: 'Ward 14', resolved: 28, pending: 3, target: 90, progress: 90, color: '#10B981' },
        { ward: 'Ward 12', resolved: 22, pending: 5, target: 80, progress: 81, color: '#3B82F6' },
        { ward: 'Ward 8', resolved: 18, pending: 4, target: 85, progress: 82, color: '#8B5CF6' },
        { ward: 'Ward 5', resolved: 15, pending: 2, target: 88, progress: 88, color: '#10B981' }
    ];

    const recentTaskUpdates = [
        { id: '#WA-8821', title: 'Pipeline Repair', location: 'Beach Road, Ward 12', status: 'SOLVED', time: '1h ago', team: 'Team A' },
        { id: '#WA-8845', title: 'Valve Replacement', location: 'Market Area, Ward 8', status: 'PENDING', time: '3h ago', team: 'Team B' },
        { id: '#WA-8780', title: 'Water Supply Restoration', location: 'School Area, Ward 5', status: 'IN PROGRESS', time: '5h ago', team: 'Team C' },
        { id: '#WA-8555', title: 'Leak Detection', location: 'Residential Area, Ward 14', status: 'SOLVED', time: '1d ago', team: 'Team A' }
    ];

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                checkAIGenerated(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const checkAIGenerated = async (imageData) => {
        setAiCheckResult({ checking: true });

        setTimeout(() => {
            const isAI = Math.random() > 0.8;
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
                    <h1>{departmentName} Dashboard</h1>
                    <p className="dept-subtitle">UDN: {udnNumber}</p>
                </div>
                <div className="header-actions">
                    <button className="queue-status-badge dept">
                        <span className="status-dot"></span>
                        ACTIVE
                    </button>
                    <button className="icon-btn">
                        <Bell size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card dept">
                    <div className="stat-header">
                        <span className="stat-label">TICKETS ASSIGNED</span>
                        <div className="stat-icon purple">
                            <ClipboardList size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.ticketsAssigned}</div>
                    <div className="stat-footer">
                        <span className="stat-change positive">+{stats.ticketsAssignedChange}</span>
                        <span className="stat-subtitle">THIS MONTH</span>
                    </div>
                </div>

                <div className="stat-card dept">
                    <div className="stat-header">
                        <span className="stat-label">SOLVED TICKETS</span>
                        <div className="stat-icon green">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.solvedTickets}</div>
                    <div className="stat-footer">
                        <span className="stat-change positive">{stats.solvedRate}%</span>
                        <span className="stat-subtitle">RESOLUTION RATE</span>
                    </div>
                </div>

                <div className="stat-card dept">
                    <div className="stat-header">
                        <span className="stat-label">PENDING TICKETS</span>
                        <div className="stat-icon blue">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.pendingTickets}</div>
                    <div className="stat-footer">
                        <span className="stat-badge success">✓ {stats.backlog}</span>
                        <span className="stat-subtitle">STATUS</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="main-grid">
                {/* Token Queue */}
                <div className="token-queue-section dept">
                    <div className="section-header">
                        <div className="section-title dept">
                            <ClipboardList size={20} />
                            <h3>Assigned Tasks Queue</h3>
                        </div>
                        <p className="section-subtitle">Manage department-assigned citizen requests</p>
                    </div>

                    {/* Search Token */}
                    <div className="token-search dept">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by Token ID or Location"
                            value={tokenSearchId}
                            onChange={(e) => setTokenSearchId(e.target.value)}
                        />
                    </div>

                    {/* Token Table */}
                    <div className="token-table dept">
                        <div className="table-header">
                            <div className="th token-id">TOKEN ID</div>
                            <div className="th issue-desc">ISSUE DESCRIPTION</div>
                            <div className="th assignee">TEAM</div>
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
                                    <div className="td assignee">
                                        <span className="team-badge">{ticket.assignee}</span>
                                    </div>
                                    <div className="td status">
                                        <span className={`status-badge ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="td action">
                                        <button
                                            className="btn-review dept"
                                            onClick={() => {
                                                setSelectedTicket(ticket);
                                                setUploadModalOpen(true);
                                            }}
                                        >
                                            Upload
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
                    <div className="queue-status-card dept">
                        <div className="queue-status-header">
                            <h3>QUEUE STATUS</h3>
                        </div>
                        <div className="balance-tokens">
                            <div className="balance-number">{queueStatus.balanceTokens}</div>
                            <p style={{ color: 'white' }}>Pending tasks to complete today</p>
                        </div>
                        <div className="daily-goal">
                            <div className="goal-header">
                                <span>Daily Target</span>
                                <span className="goal-percentage">{queueStatus.dailyGoalProgress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${queueStatus.dailyGoalProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <button className="btn-process-token dept">Process Next Task</button>
                    </div>

                    {/* Department Updates */}
                    <div className="department-updates dept">
                        <h3>Ward Updates</h3>
                        <div className="updates-list">
                            {departmentUpdates.map((update, index) => (
                                <div key={index} className="update-item">
                                    <div className="update-icon dept">{update.icon}</div>
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
                    <h1>{departmentName} Performance Analytics</h1>
                    <p className="subtitle">UDN: {udnNumber} • Last updated: Just now</p>
                </div>
                <div className="weather-widget dept">
                    <span>☀️ 28°C, Kozhikode</span>
                    <span className="humidity">Humidity: 78%</span>
                </div>
            </div>

            {/* Analytics Stats */}
            <div className="analytics-stats-grid">
                <div className="analytics-stat-card dept">
                    <div className="stat-icon-badge green">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-number">{analyticsData.resolvedTasks.count}</div>
                        <div className="stat-label">Resolved Tasks</div>
                        <div className="stat-trend positive">{analyticsData.resolvedTasks.trend}</div>
                    </div>
                    <div className="stat-progress-mini">
                        <div className="progress-bar-mini" style={{ width: '91%', background: analyticsData.resolvedTasks.color }}></div>
                    </div>
                </div>

                <div className="analytics-stat-card dept">
                    <div className="stat-icon-badge orange">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-number">{analyticsData.pendingApprovals.count}</div>
                        <div className="stat-label">Pending Tasks</div>
                        <div className="stat-trend warning">{analyticsData.pendingApprovals.trend}</div>
                    </div>
                    <div className="stat-progress-mini">
                        <div className="progress-bar-mini" style={{ width: '30%', background: analyticsData.pendingApprovals.color }}></div>
                    </div>
                </div>

                <div className="analytics-stat-card dept">
                    <div className="stat-icon-badge purple">
                        <BarChart3 size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-number">{analyticsData.teamUtilization.percentage}</div>
                        <div className="stat-label">Team Utilization</div>
                        <div className="stat-trend">Current Month</div>
                    </div>
                    <div className="stat-progress-mini">
                        <div className="progress-bar-mini" style={{ width: `${analyticsData.teamUtilization.progress}%`, background: analyticsData.teamUtilization.color }}></div>
                    </div>
                </div>

                <div className="analytics-stat-card dept">
                    <div className="stat-icon-badge blue">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-number">{analyticsData.avgResolutionTime.time}</div>
                        <div className="stat-label">Avg Resolution Time</div>
                        <div className="stat-trend positive">{analyticsData.avgResolutionTime.trend}</div>
                    </div>
                    <div className="stat-progress-mini">
                        <div className="progress-bar-mini" style={{ width: '75%', background: analyticsData.avgResolutionTime.color }}></div>
                    </div>
                </div>
            </div>

            {/* Ward Progress */}
            <div className="department-progress-section dept">
                <div className="section-header-row">
                    <h2>Ward-wise Task Progress</h2>
                    <div className="view-toggle">
                        <button className="toggle-btn">Weekly</button>
                        <button className="toggle-btn active">Monthly</button>
                    </div>
                </div>

                <div className="progress-cards">
                    {wardProgress.map((ward, index) => (
                        <div key={index} className="progress-card dept">
                            <div className="progress-card-header">
                                <div className="dept-icon" style={{ background: `${ward.color}20`, color: ward.color }}>
                                    🏘️
                                </div>
                                <div className="dept-info">
                                    <h4>{ward.ward}</h4>
                                    <p>{departmentName} tasks assigned to this ward</p>
                                </div>
                                <div className="dept-percentage">
                                    <span className="percentage-value">{ward.progress}%</span>
                                    <span className="percentage-label">Target: {ward.target}%</span>
                                </div>
                            </div>
                            <div className="progress-bar-large">
                                <div
                                    className="progress-fill-large"
                                    style={{ width: `${ward.progress}%`, background: ward.color }}
                                ></div>
                            </div>
                            <div className="progress-stats">
                                <span className="stat-item">{ward.resolved} Resolved</span>
                                <span className="stat-item pending">{ward.pending} Pending</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Task Updates */}
            <div className="recent-tasks-section dept">
                <div className="section-header-row">
                    <h2>Recent Task Updates</h2>
                    <button className="view-all-btn dept">View All</button>
                </div>
                <div className="task-updates-list">
                    {recentTaskUpdates.map((task, index) => (
                        <div key={index} className="task-update-item dept">
                            <div className="task-id-badge dept">{task.id}</div>
                            <div className="task-details">
                                <h4>{task.title}</h4>
                                <p>{task.location}</p>
                            </div>
                            <span className="team-info">{task.team}</span>
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
                <h1>Task Management - {departmentName}</h1>
                <div className="weather-info">
                    <span>☁️ Kozhikode: 28°C, Light Rain</span>
                </div>
            </div>

            {/* Task Stats */}
            <div className="task-stats dept">
                <div className="task-stat">
                    <div className="stat-label">ASSIGNED</div>
                    <div className="stat-number purple">{stats.ticketsAssigned}</div>
                    <div className="stat-change">Total Tasks</div>
                </div>
                <div className="task-stat">
                    <div className="stat-label">COMPLETED</div>
                    <div className="stat-number green">{stats.solvedTickets}</div>
                    <div className="stat-change">{stats.solvedRate}% Rate</div>
                </div>
                <div className="task-stat">
                    <div className="stat-label">PENDING</div>
                    <div className="stat-number orange">{stats.pendingTickets}</div>
                    <div className="stat-change">Avg 3.2h</div>
                </div>
            </div>

            {/* Main Tasks View */}
            <div className="tasks-main-grid dept">
                <div className="token-management-card dept">
                    <div className="card-header">
                        <div className="card-icon dept">🔍</div>
                        <div>
                            <h3>Task Lookup</h3>
                            <p>Search and update task status</p>
                        </div>
                    </div>

                    <div className="token-input-section">
                        <label>ENTER TASK ID</label>
                        <div className="token-input-group dept">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="e.g. WA-14-882"
                                value={tokenSearchId}
                                onChange={(e) => setTokenSearchId(e.target.value)}
                            />
                            <button className="check-btn dept">Search</button>
                        </div>
                    </div>

                    {tokenSearchId && (
                        <div className="token-details-card dept">
                            <div className="token-status-badge processing">IN PROGRESS</div>
                            <h4>#WA-14-882</h4>
                            <p>Water pipeline leak reported at Beach Road Junction. Team A assigned for repair work.</p>

                            <div className="assign-section">
                                <label>UPDATE STATUS</label>
                                <select className="department-select dept">
                                    <option>In Progress</option>
                                    <option>Completed - Upload Photo</option>
                                    <option>On Hold</option>
                                    <option>Requires Approval</option>
                                </select>
                                <button className="update-assignment-btn dept">UPDATE STATUS</button>
                            </div>
                        </div>
                    )}

                    <div className="action-buttons dept">
                        <button className="action-btn new-task dept">
                            <CheckCircle2 size={20} />
                            Mark Complete
                        </button>
                        <button className="action-btn broadcast dept">
                            <Bell size={20} />
                            Request Support
                        </button>
                    </div>
                </div>

                {/* Department Tasks List */}
                <div className="department-tasks-list dept">
                    <div className="list-header">
                        <h3>Active Tasks</h3>
                        <select className="filter-select dept">
                            <option>All Wards</option>
                            <option>Ward 14</option>
                            <option>Ward 12</option>
                            <option>Ward 8</option>
                            <option>Ward 5</option>
                        </select>
                    </div>

                    <div className="tasks-table dept">
                        <div className="tasks-table-header">
                            <div>TASK / TOKEN</div>
                            <div>WARD</div>
                            <div>TEAM</div>
                            <div>STATUS</div>
                            <div>ACTION</div>
                        </div>
                        <div className="tasks-table-body">
                            {tickets.map((task, index) => (
                                <div key={index} className="task-row dept">
                                    <div className="task-issue">
                                        <div className="priority-dot high"></div>
                                        <div>
                                            <div className="issue-name">{task.description}</div>
                                            <div className="issue-token">{task.id}</div>
                                            <div className="issue-time">• {task.date}</div>
                                        </div>
                                    </div>
                                    <div className="task-dept">
                                        <span className="dept-badge">{task.location.split(',')[1] || 'Ward 14'}</span>
                                    </div>
                                    <div className="task-assignee">
                                        <div className="assignee-avatar dept">{task.assignee[0]}</div>
                                        <span>{task.assignee}</span>
                                    </div>
                                    <div className="task-status">
                                        <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <div className="task-action">
                                        <button
                                            className="upload-btn dept"
                                            onClick={() => {
                                                setSelectedTicket({ id: task.id, description: task.description });
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
                        Showing 5 of {stats.ticketsAssigned} total tasks
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
        <div className="ward-dashboard department">
            {/* Sidebar */}
            <div className="dashboard-sidebar dept">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon dept">
                            <Building size={24} />
                        </div>
                        <div className="logo-text">
                            <div className="logo-title">CivicAI</div>
                            <div className="logo-subtitle">DEPARTMENT PORTAL</div>
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

            {/* Main Content */}
            <div className="dashboard-main">
                {activeSection === 'dashboard' && renderDashboard()}
                {activeSection === 'analytics' && renderAnalytics()}
                {activeSection === 'tasks' && renderDepartmentTasks()}
            </div>

            {/* Upload Modal - Same as Ward Member */}
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

export default DepartmentDashboard;
