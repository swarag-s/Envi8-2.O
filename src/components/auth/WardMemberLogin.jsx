import { useState } from 'react';
import { CreditCard, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './WardMemberLogin.css';

const WardMemberLogin = ({ onBack, onLogin, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        memberId: '',
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
        console.log('Ward Member Login:', formData);

        // Call onLogin callback if provided
        if (onLogin) {
            // In production, this would validate credentials with backend
            // For now, extract ward number from member ID (e.g., WM-14-001 -> Ward 14)
            const wardMatch = formData.memberId.match(/WM-(\d+)-/);
            const wardNumber = wardMatch ? wardMatch[1] : '14';

            onLogin({
                memberId: formData.memberId,
                wardNumber: wardNumber,
                name: 'Ward Member' // In production, this would come from backend
            });
        }
    };

    return (
        <div className="auth-form-container">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Selection
            </button>

            <div className="auth-header">
                <h2>Ward Member Login</h2>
                <p>Access your ward member dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                {/* Unique Member ID */}
                <div className="form-group">
                    <label htmlFor="memberId">Unique Member ID *</label>
                    <div className="input-wrapper">
                        <CreditCard className="input-icon" size={20} />
                        <input
                            type="text"
                            id="memberId"
                            name="memberId"
                            value={formData.memberId}
                            onChange={handleChange}
                            placeholder="Enter your unique member ID"
                            required
                        />
                    </div>
                    <small className="input-hint">Format: WM-[Ward]-[Number] (e.g., WM-14-001)</small>
                </div>

                {/* Password */}
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
                <div className="form-row">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember me</span>
                    </label>
                    <a href="#forgot" className="forgot-link">
                        Forgot password?
                    </a>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-full">
                    Login to Dashboard
                </button>

                {/* Switch to Register */}
                <div className="form-footer">
                    <p>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="link-button"
                            onClick={onSwitchToRegister}
                        >
                            Register as Ward Member
                        </button>
                    </p>
                </div>
            </form>

            {/* Help Box */}
            <div className="help-box">
                <h4>Need Help?</h4>
                <p>
                    Your Unique Member ID is provided by your LSG administration.
                    Contact your local government office if you don't have your credentials.
                </p>
            </div>
        </div>
    );
};

export default WardMemberLogin;
