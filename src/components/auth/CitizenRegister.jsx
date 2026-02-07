import { useState } from 'react';
import { User, CreditCard, Phone, Mail, MapPin, Building2, Lock, Eye, EyeOff } from 'lucide-react';
import './CitizenRegister.css';

const CitizenRegister = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        adharNumber: '',
        mobileNumber: '',
        email: '',
        ward: '',
        lsgType: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const lsgOptions = [
        'Kozhikode Corporation',
        'Vadakara Municipality',
        'Koyilandy Municipality',
        'Balussery Municipality',
        'Gram Panchayat - Atholi',
        'Gram Panchayat - Chelannur',
        'Gram Panchayat - Koduvally',
        'Gram Panchayat - Kunnamangalam',
        'Gram Panchayat - Omassery',
        'Gram Panchayat - Thamarassery',
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        console.log('Citizen Registration:', formData);
        // Add registration logic here
    };

    return (
        <div className="auth-form-container">
            <div className="auth-header">
                <h2>Citizen Registration</h2>
                <p>Create your account to start reporting civic issues</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                {/* Name */}
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <div className="input-wrapper">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                </div>

                {/* Adhar Number */}
                <div className="form-group">
                    <label htmlFor="adharNumber">Adhar Number *</label>
                    <div className="input-wrapper">
                        <CreditCard className="input-icon" size={20} />
                        <input
                            type="text"
                            id="adharNumber"
                            name="adharNumber"
                            value={formData.adharNumber}
                            onChange={handleChange}
                            placeholder="Enter 12-digit Adhar number"
                            pattern="[0-9]{12}"
                            maxLength="12"
                            required
                        />
                    </div>
                    <small className="input-hint">Enter your 12-digit Adhar number</small>
                </div>

                {/* Mobile Number */}
                <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number *</label>
                    <div className="input-wrapper">
                        <Phone className="input-icon" size={20} />
                        <div className="phone-input">
                            <span className="country-code">+91</span>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="Enter 10-digit mobile number"
                                pattern="[0-9]{10}"
                                maxLength="10"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <div className="input-wrapper">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            required
                        />
                    </div>
                </div>

                {/* Ward */}
                <div className="form-group">
                    <label htmlFor="ward">Ward *</label>
                    <div className="input-wrapper">
                        <MapPin className="input-icon" size={20} />
                        <input
                            type="text"
                            id="ward"
                            name="ward"
                            value={formData.ward}
                            onChange={handleChange}
                            placeholder="Enter your ward number"
                            required
                        />
                    </div>
                </div>

                {/* Panchayat/Municipality/Corporation */}
                <div className="form-group">
                    <label htmlFor="lsgType">Panchayat/Municipality/Corporation *</label>
                    <div className="input-wrapper">
                        <Building2 className="input-icon" size={20} />
                        <select
                            id="lsgType"
                            name="lsgType"
                            value={formData.lsgType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select your LSG</option>
                            {lsgOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
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
                            placeholder="Create a strong password"
                            minLength="8"
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
                    <small className="input-hint">Minimum 8 characters</small>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            minLength="8"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-full">
                    Create Account
                </button>

                {/* Login Link */}
                <div className="auth-switch">
                    <span>Already have an account?</span>
                    <button
                        type="button"
                        className="switch-link"
                        onClick={onSwitchToLogin}
                    >
                        Login Here
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CitizenRegister;
