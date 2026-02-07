import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    FileText
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'How It Works', href: '#how-it-works' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'FAQ', href: '#faq' },
        ],
        company: [
            { name: 'About Us', href: '#about' },
            { name: 'Careers', href: '#careers' },
            { name: 'Blog', href: '#blog' },
            { name: 'Press Kit', href: '#press' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#privacy' },
            { name: 'Terms of Service', href: '#terms' },
            { name: 'Cookie Policy', href: '#cookies' },
            { name: 'Disclaimer', href: '#disclaimer' },
        ],
        support: [
            { name: 'Help Center', href: '#help' },
            { name: 'Contact Us', href: '#contact' },
            { name: 'Report Issue', href: '#report' },
            { name: 'Status', href: '#status' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
    ];

    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="footer-newsletter">
                <div className="container">
                    <motion.div
                        className="newsletter-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="newsletter-text">
                            <h3 className="newsletter-title">Stay Updated</h3>
                            <p className="newsletter-description">
                                Get the latest updates on civic improvements in your area
                            </p>
                        </div>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                            />
                            <button className="btn btn-primary">
                                <Send size={18} />
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand Column */}
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <FileText size={32} strokeWidth={2.5} />
                                <span className="footer-logo-text">CivicReport</span>
                            </div>
                            <p className="footer-brand-description">
                                Empowering citizens with AI-driven civic reporting for a better
                                Kozhikode. Making governance transparent and responsive.
                            </p>
                            <div className="footer-contact">
                                <div className="contact-item">
                                    <MapPin size={18} />
                                    <span>Kozhikode, Kerala, India</span>
                                </div>
                                <div className="contact-item">
                                    <Phone size={18} />
                                    <span>+91 495 XXX XXXX</span>
                                </div>
                                <div className="contact-item">
                                    <Mail size={18} />
                                    <span>support@civicreport.in</span>
                                </div>
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="footer-links-group">
                            <div className="footer-links-column">
                                <h4 className="footer-links-title">Product</h4>
                                <ul className="footer-links-list">
                                    {footerLinks.product.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.href} className="footer-link">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="footer-links-column">
                                <h4 className="footer-links-title">Company</h4>
                                <ul className="footer-links-list">
                                    {footerLinks.company.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.href} className="footer-link">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="footer-links-column">
                                <h4 className="footer-links-title">Legal</h4>
                                <ul className="footer-links-list">
                                    {footerLinks.legal.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.href} className="footer-link">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="footer-links-column">
                                <h4 className="footer-links-title">Support</h4>
                                <ul className="footer-links-list">
                                    {footerLinks.support.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.href} className="footer-link">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="footer-copyright">
                            © {currentYear} CivicReport. All rights reserved.
                        </p>
                        <div className="footer-social">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="social-link"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
