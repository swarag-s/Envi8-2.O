import { motion } from 'framer-motion';
import { Camera, Zap, Send, CheckCircle2, MapPin, Clock } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            icon: Camera,
            title: 'Capture the Issue',
            description: 'Take a photo or video of the civic issue you want to report. Our app makes it simple and quick.',
            color: '#10B981',
        },
        {
            icon: Zap,
            title: 'AI Analysis',
            description: 'Our AI automatically identifies the issue type, location, and routes it to the correct department.',
            color: '#3B82F6',
        },
        {
            icon: Send,
            title: 'Auto-Route to Authority',
            description: 'The report is instantly sent to your Corporation, Panchayat, or LSG with all necessary details.',
            color: '#F59E0B',
        },
        {
            icon: CheckCircle2,
            title: 'Track & Resolution',
            description: 'Monitor the status in real-time and receive updates until the issue is completely resolved.',
            color: '#10B981',
        },
    ];

    const features = [
        {
            icon: MapPin,
            title: 'Auto-Location Detection',
            description: 'GPS-based location tagging for precise issue reporting',
        },
        {
            icon: Clock,
            title: 'Real-Time Updates',
            description: 'Get instant notifications on your report status',
        },
        {
            icon: Zap,
            title: 'Smart Categorization',
            description: 'AI categorizes issues into 15+ civic categories',
        },
    ];

    return (
        <section className="how-it-works section" id="how-it-works">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="section-header text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="section-badge">
                        <Zap size={16} />
                        Simple Process
                    </div>
                    <h2 className="section-title">How to Report an Issue</h2>
                    <p className="section-description">
                        Four simple steps to make your city better. Our AI-powered platform
                        handles the rest.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="steps-container">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="step-item"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className="step-number">{index + 1}</div>

                            <div className="step-icon" style={{ backgroundColor: `${step.color}15` }}>
                                <step.icon size={32} style={{ color: step.color }} />
                            </div>

                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>

                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <div className="connector-line"></div>
                                    <div className="connector-arrow"></div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Features Grid */}
                <motion.div
                    className="features-grid"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">
                                <feature.icon size={24} />
                            </div>
                            <h4 className="feature-title">{feature.title}</h4>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="how-it-works-cta"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <button className="btn btn-primary btn-lg">
                        <Camera size={20} />
                        Start Reporting Now
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
