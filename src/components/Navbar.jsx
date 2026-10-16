import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import CardifyLogo from './CardifyLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <header className={`cardify-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <CardifyLogo linkTo="/" />

        {/* Center Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="#accueil" className="nav-link">
            Accueil
          </a>
          <a href="#modeles" className="nav-link">
            Modèles
          </a>
          <a href="#tarifs" className="nav-link">
            Tarifs
          </a>
          <a href="#comment-ca-marche" className="nav-link">
            Comment ça marche
          </a>
        </nav>

        {/* Right CTA Button */}
        <div className="navbar-actions">
          <Link to="/create" className="btn-cta-navbar" id="cta-navbar-create">
            <span>Créer maintenant</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} color="#ffffff" /> : <Menu size={24} color="#ffffff" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <a href="#accueil" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Accueil
          </a>
          <a href="#modeles" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Modèles
          </a>
          <a href="#tarifs" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Tarifs
          </a>
          <a href="#comment-ca-marche" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Comment ça marche
          </a>
          <Link
            to="/create"
            className="mobile-cta-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Créer une invitation</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </header>
  );
}
