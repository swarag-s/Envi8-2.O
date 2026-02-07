import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Impact from './components/Impact';
import Footer from './components/Footer';
import Auth from './pages/Auth';
import CitizenDashboard from './pages/CitizenDashboard';
import WardMemberDashboard from './pages/WardMemberDashboard';
import DepartmentDashboard from './pages/DepartmentDashboard';
import { IssueProvider } from './context/IssueContext';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'citizen-dashboard', 'ward-dashboard', 'dept-dashboard'
  const [userData, setUserData] = useState(null);

  const handleCitizenLogin = (data) => {
    setUserData(data);
    setCurrentView('citizen-dashboard');
  };

  const handleWardMemberLogin = (data) => {
    setUserData(data);
    setCurrentView('ward-dashboard');
  };

  const handleDepartmentLogin = (data) => {
    setUserData(data);
    setCurrentView('dept-dashboard');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentView('landing');
  };

  // Show Citizen Dashboard
  if (currentView === 'citizen-dashboard') {
    return (
      <IssueProvider>
        <CitizenDashboard
          onLogout={handleLogout}
          userName={userData?.name || 'Arun Kumar'}
          ward={userData?.ward || 'Ward 14'}
        />
      </IssueProvider>
    );
  }

  // Show Ward Member Dashboard
  if (currentView === 'ward-dashboard') {
    return (
      <IssueProvider>
        <WardMemberDashboard
          onLogout={handleLogout}
          userName={userData?.name || 'Ward Member'}
          wardNumber={userData?.wardNumber || '14'}
        />
      </IssueProvider>
    );
  }

  // Show Department Dashboard
  if (currentView === 'dept-dashboard') {
    return (
      <DepartmentDashboard
        onLogout={handleLogout}
        departmentName={userData?.departmentName || 'Water Authority'}
        udnNumber={userData?.udnNumber || 'WA-KZD-001'}
      />
    );
  }

  // Show Auth Page
  if (currentView === 'auth') {
    return (
      <Auth
        onBack={() => setCurrentView('landing')}
        onCitizenLogin={handleCitizenLogin}
        onWardMemberLogin={handleWardMemberLogin}
        onDepartmentLogin={handleDepartmentLogin}
      />
    );
  }

  // Show Landing Page
  return (
    <div className="app">
      <Navbar onLoginClick={() => setCurrentView('auth')} />
      <main>
        <Hero onReportClick={() => setCurrentView('auth')} />
        <HowItWorks />
        <Impact />
      </main>
      <Footer />
    </div>
  );
}

export default App;


