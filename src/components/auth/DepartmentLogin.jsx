import { useState } from 'react';
import { CreditCard, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './DepartmentLogin.css';

const DepartmentLogin = ({ onBack, onLogin }) => {
    const [formData, setFormData] = useState({
        udnNumber: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Department Login:', formData);
        // Call onLogin callback if provided
        if (onLogin) {
            onLogin(formData);
        }
    };

    return (
        <div className="auth-form-container">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Selection
            </button>

            <div className="auth-header">
                <h2>Department Login</h2>
                <p>Access the department dashboard with your UDN credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                {/* UDN Number Field */}
                <div className="form-group">
                    <label htmlFor="udnNumber">UDN Number *</label>
                    <div className="input-wrapper">
                        <CreditCard className="input-icon" size={20} />
                        <input
                            type="text"
                            id="udnNumber"
                            name="udnNumber"
                            value={formData.udnNumber}
                            onChange={handleChange}
                            placeholder="Enter your UDN number"
                            required
                        />
                    </div>
                    <small className="input-hint">Unique Department Number</small>
                </div>

                {/* Password Field */}
                <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember me</span>
                    </label>
                    <a href="#forgot-password" className="forgot-link">
                        Forgot Password?
                    </a>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-full">
                    Access Department Dashboard
                </button>

                {/* Help Section */}
                <div className="department-help">
                    <div className="help-box">
                        <h4>Need Help?</h4>
                        <p>
                            Contact your System Administrator if you don't have your UDN
                            credentials or facing login issues.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DepartmentLogin;
