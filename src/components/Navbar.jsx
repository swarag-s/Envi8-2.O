import { useState, useEffect } from 'react';
import { Menu, X, Megaphone, LogIn, UserPlus } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Impact', href: '#impact' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <Megaphone className="logo-icon" size={32} strokeWidth={2.5} />
            <span className="logo-text">JannaShabdha</span>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="nav-link">
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="navbar-actions">
            <button className="btn btn-outline btn-sm" onClick={onLoginClick}>
              <LogIn size={18} />
              Login
            </button>
            <button className="btn btn-primary btn-sm" onClick={onLoginClick}>
              <UserPlus size={18} />
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="mobile-menu-actions">
              <button className="btn btn-outline btn-full" onClick={onLoginClick}>
                <LogIn size={18} />
                Login
              </button>
              <button className="btn btn-primary btn-full" onClick={onLoginClick}>
                <UserPlus size={18} />
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
