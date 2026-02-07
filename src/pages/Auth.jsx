import { useState } from 'react';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import CitizenLogin from '../components/auth/CitizenLogin';
import CitizenRegister from '../components/auth/CitizenRegister';
import AuthorityLogin from '../components/auth/AuthorityLogin';
import WardMemberLogin from '../components/auth/WardMemberLogin';
import WardMemberRegister from '../components/auth/WardMemberRegister';
import DepartmentLogin from '../components/auth/DepartmentLogin';
import './Auth.css';

const Auth = ({ onBack, onCitizenLogin, onWardMemberLogin, onDepartmentLogin }) => {
    const [activeTab, setActiveTab] = useState('citizen');
    const [citizenView, setCitizenView] = useState('login');
    const [authorityView, setAuthorityView] = useState('selection');
    const [wardMemberView, setWardMemberView] = useState('login'); // 'login' or 'register'

    const handleCitizenLogin = (data) => {
        console.log('Citizen Login:', data);
        if (onCitizenLogin) {
            onCitizenLogin(data);
        }
    };

    const handleWardMemberLoginSubmit = (data) => {
        console.log('Ward Member Login:', data);
        if (onWardMemberLogin) {
            onWardMemberLogin({
                name: data.name || 'Ward Member',
                wardNumber: data.wardNumber,
                memberId: data.memberId
            });
        }
    };

    const handleWardMemberRegister = (data) => {
        console.log('Ward Member Registration:', data);
        if (onWardMemberLogin) {
            onWardMemberLogin({
                name: data.name,
                wardNumber: data.wardNumber,
                memberId: data.memberId
            });
        }
    };

    const handleDepartmentLogin = (data) => {
        console.log('Department Login:', data);
        if (onDepartmentLogin) {
            onDepartmentLogin({ departmentName: 'Water Authority', udnNumber: data.udnNumber });
        }
    };

    return (
        <div className="auth-page">
            {/* Left Panel */}
            <div className="auth-left-panel">
                <button className="back-to-home" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                <div className="auth-branding">
                    <div className="auth-logo">
                        <div className="logo-icon">
                            <FileText size={32} />
                        </div>
                        <h1>CivicReport</h1>
                    </div>

                    <div className="auth-description">
                        <h2>Shape your community together</h2>
                        <p>
                            Join thousands of citizens and government officials working together
                            to create cleaner, safer, and better-maintained communities across Kerala.
                        </p>
                    </div>

                    <div className="auth-features">
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>AI-Powered Issue Detection</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Real-Time Status Tracking</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Direct Government Connection</span>
                        </div>
                    </div>
                </div>

                <div className="auth-footer">
                    <a href="#privacy">Privacy Policy</a>
                    <span>•</span>
                    <a href="#terms">Terms of Service</a>
                    <span>•</span>
                    <a href="#contact">Contact Support</a>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right-panel">
                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${activeTab === 'citizen' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('citizen');
                            setCitizenView('login');
                        }}
                    >
                        <FileText size={18} />
                        Citizen
                    </button>
                    <button
                        className={`auth-tab ${activeTab === 'authority' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('authority');
                            setAuthorityView('selection');
                        }}
                    >
                        <Shield size={18} />
                        Authority (LSG)
                    </button>
                </div>

                {/* Content */}
                <div className="auth-content">
                    {activeTab === 'citizen' && (
                        <>
                            {citizenView === 'login' && (
                                <CitizenLogin
                                    onSwitchToRegister={() => setCitizenView('register')}
                                    onLogin={handleCitizenLogin}
                                />
                            )}
                            {citizenView === 'register' && (
                                <CitizenRegister onSwitchToLogin={() => setCitizenView('login')} />
                            )}
                        </>
                    )}

                    {activeTab === 'authority' && (
                        <>
                            {authorityView === 'selection' && (
                                <AuthorityLogin
                                    onSelectWardMember={() => {
                                        setAuthorityView('ward-member');
                                        setWardMemberView('login');
                                    }}
                                    onSelectDepartment={() => setAuthorityView('department')}
                                />
                            )}
                            {authorityView === 'ward-member' && (
                                <>
                                    {wardMemberView === 'login' && (
                                        <WardMemberLogin
                                            onBack={() => setAuthorityView('selection')}
                                            onLogin={handleWardMemberLoginSubmit}
                                            onSwitchToRegister={() => setWardMemberView('register')}
                                        />
                                    )}
                                    {wardMemberView === 'register' && (
                                        <WardMemberRegister
                                            onBack={() => setWardMemberView('login')}
                                            onRegister={handleWardMemberRegister}
                                        />
                                    )}
                                </>
                            )}
                            {authorityView === 'department' && (
                                <DepartmentLogin
                                    onBack={() => setAuthorityView('selection')}
                                    onLogin={handleDepartmentLogin}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
