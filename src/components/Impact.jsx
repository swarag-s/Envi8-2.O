import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    Award,
    Target,
    Building2,
    MapPin,
    Clock,
    ThumbsUp
} from 'lucide-react';
import './Impact.css';

const Impact = () => {
    const stats = [
        {
            icon: Users,
            number: '15,000+',
            label: 'Active Citizens',
            color: '#10B981',
        },
        {
            icon: Target,
            number: '8,500+',
            label: 'Issues Resolved',
            color: '#3B82F6',
        },
        {
            icon: Building2,
            number: '45+',
            label: 'Government Bodies',
            color: '#F59E0B',
        },
        {
            icon: Clock,
            number: '18hrs',
            label: 'Avg Resolution Time',
            color: '#EF4444',
        },
    ];

    const achievements = [
        {
            icon: Award,
            title: 'Best Civic App 2025',
            description: 'Recognized by Kerala Government',
        },
        {
            icon: TrendingUp,
            title: '95% Success Rate',
            description: 'Issues resolved within 48 hours',
        },
        {
            icon: ThumbsUp,
            title: '4.8/5 Rating',
            description: 'Based on 10,000+ reviews',
        },
    ];

    const locations = [
        { name: 'Kozhikode Corporation', issues: 3240 },
        { name: 'Vadakara Municipality', issues: 1850 },
        { name: 'Koyilandy Municipality', issues: 1420 },
        { name: 'Rural Panchayats', issues: 2990 },
    ];

    return (
        <section className="impact section" id="impact">
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
                        <TrendingUp size={16} />
                        Our Impact
                    </div>
                    <h2 className="section-title">Making a Real Difference</h2>
                    <p className="section-description">
                        Empowering citizens and transforming governance across Kozhikode
                        district with data-driven civic engagement.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
                                <stat.icon size={32} style={{ color: stat.color }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number" style={{ color: stat.color }}>
                                    {stat.number}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Achievements */}
                <motion.div
                    className="achievements-container"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h3 className="achievements-title">Recognition & Achievements</h3>
                    <div className="achievements-grid">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="achievement-card">
                                <div className="achievement-icon">
                                    <achievement.icon size={28} />
                                </div>
                                <div className="achievement-content">
                                    <h4 className="achievement-title">{achievement.title}</h4>
                                    <p className="achievement-description">{achievement.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Location Coverage */}
                <motion.div
                    className="locations-container"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <div className="locations-header">
                        <MapPin size={24} />
                        <h3 className="locations-title">Coverage Across Kozhikode</h3>
                    </div>
                    <div className="locations-grid">
                        {locations.map((location, index) => (
                            <div key={index} className="location-item">
                                <div className="location-name">{location.name}</div>
                                <div className="location-bar-container">
                                    <motion.div
                                        className="location-bar"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(location.issues / 3240) * 100}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                    />
                                </div>
                                <div className="location-count">{location.issues} issues</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Impact;
