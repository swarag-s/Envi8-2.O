import { motion } from 'framer-motion';
import { Camera, Upload, Send, CheckCircle } from 'lucide-react';
import Lottie from 'lottie-react';
import './Hero.css';

const Hero = ({ onReportClick }) => {
    // Simple animation data for civic reporting
    const reportAnimation = {
        v: "5.7.4",
        fr: 30,
        ip: 0,
        op: 60,
        w: 400,
        h: 400,
        nm: "Report Animation",
        ddd: 0,
        assets: [],
        layers: []
    };

    return (
        <section className="hero" id="home">
            <div className="hero-background">
                <div className="hero-gradient"></div>
                <div className="hero-pattern"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    {/* Left Content */}
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="hero-badge"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="badge-dot"></span>
                            AI-Powered Civic Reporting
                        </motion.div>

                        <h1 className="hero-title">
                            Smarter Governance for
                            <span className="hero-title-highlight"> Kozhikode</span>
                        </h1>

                        <p className="hero-description">
                            Empowering citizens with AI-driven reporting. Transform your city
                            with a single click and real-time transparency. Report civic issues
                            directly to your Corporation, Panchayat, or Local Self Government.
                        </p>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">1,240</div>
                                <div className="stat-label">Issues Resolved</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">98%</div>
                                <div className="stat-label">Success Rate</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">24h</div>
                                <div className="stat-label">Avg Response</div>
                            </div>
                        </div>

                        <div className="hero-actions">
                            <button className="btn btn-primary btn-lg" onClick={onReportClick}>
                                <Camera size={20} />
                                Report an Issue
                            </button>
                            <button className="btn btn-outline btn-lg">
                                <Upload size={20} />
                                How It Works
                            </button>
                        </div>

                        <div className="hero-trust">
                            <div className="trust-badges">
                                <div className="trust-badge">
                                    <CheckCircle size={16} />
                                    <span>Verified by Govt</span>
                                </div>
                                <div className="trust-badge">
                                    <CheckCircle size={16} />
                                    <span>AI-Powered</span>
                                </div>
                                <div className="trust-badge">
                                    <CheckCircle size={16} />
                                    <span>100% Secure</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Animation */}
                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="visual-container">
                            <div className="visual-card">
                                <div className="visual-icon-grid">
                                    <motion.div
                                        className="visual-icon-item"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                                    >
                                        <Camera size={40} />
                                        <span>Capture</span>
                                    </motion.div>
                                    <motion.div
                                        className="visual-icon-item"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                    >
                                        <Upload size={40} />
                                        <span>Upload</span>
                                    </motion.div>
                                    <motion.div
                                        className="visual-icon-item"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                                    >
                                        <Send size={40} />
                                        <span>AI Analysis</span>
                                    </motion.div>
                                    <motion.div
                                        className="visual-icon-item"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                                    >
                                        <CheckCircle size={40} />
                                        <span>Resolution</span>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="visual-decoration decoration-1"></div>
                            <div className="visual-decoration decoration-2"></div>
                            <div className="visual-decoration decoration-3"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="scroll-indicator"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <div className="scroll-line"></div>
            </motion.div>
        </section>
    );
};

export default Hero;
