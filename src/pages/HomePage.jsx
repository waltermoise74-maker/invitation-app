import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Palette,
  Users,
  Download,
  CheckCircle2,
  ShieldCheck,
  SlidersHorizontal,
  Wand2
} from 'lucide-react';

import Navbar from '../components/Navbar';
import FeatureBanner from '../components/FeatureBanner';
import CardifyLogo from '../components/CardifyLogo';
import './HomePage.css';

// Import hero card images
import cardAnniversary from '../assets/card-anniversary.jpg';
import cardVip from '../assets/card-vip.jpg';
import cardWedding from '../assets/card-wedding.jpg';
import cardGrad from '../assets/card-grad.jpg';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templatesList = [
    {
      id: 'anniversary',
      title: 'Anniversaire 30 ans Floral',
      category: 'anniversaire',
      tag: 'Populaire',
      image: cardAnniversary,
      themeQuery: 'anniversaire'
    },
    {
      id: 'vip-party',
      title: 'Soirée VIP Gold & Black',
      category: 'soiree',
      tag: 'Tendance',
      image: cardVip,
      themeQuery: 'fete'
    },
    {
      id: 'wedding-botanical',
      title: 'Mariage Eucalyptus & Or',
      category: 'mariage',
      tag: 'Élégant',
      image: cardWedding,
      themeQuery: 'marriage'
    },
    {
      id: 'graduation-gold',
      title: 'Remise de Diplôme Royal',
      category: 'diplome',
      tag: 'Nouveau',
      image: cardGrad,
      themeQuery: 'diplome'
    }
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? templatesList
      : templatesList.filter((tpl) => tpl.category === selectedCategory);

  const handleSelectTemplate = (themeQuery) => {
    navigate(`/create?theme=${encodeURIComponent(themeQuery)}`);
  };

  return (
    <div className="homepage-root" id="accueil">
      {/* Top Navigation */}
      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section className="hero-section">
        {/* Background glow & ambient shapes */}
        <div className="hero-ambient-glow hero-glow-1" />
        <div className="hero-ambient-glow hero-glow-2" />
        <div className="hero-mesh-grid" />

        <div className="hero-container">
          {/* Left Column: Headline, subtext, actions */}
          <div className="hero-content">
            {/* Pill Badge */}
            {/* <div className="hero-badge">
              <Zap size={14} className="badge-icon-accent" />
              <span>Rapide • Simple • Professionnel</span>
            </div> */}

            {/* Main Headline */}
            <h1 className="hero-title">
              Des invitations <br />
              <span className="hero-title-highlight">qui marquent</span> <br />
              les esprits
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Choisissez un modèle, personnalisez, payez et téléchargez. C'est aussi simple que ça !
            </p>

            {/* Action Buttons */}
            <div className="hero-actions">
              <Link to="/create" className="btn-hero-primary" id="hero-create-btn">
                <span>Créer une invitation</span>
              </Link>

              {/* <a href="#modeles" className="btn-hero-secondary" id="hero-explore-btn">
                <span>Voir les modèles</span>
              </a> */}
            </div>
          </div>

          {/* Right Column: 3D Floating Cards Preview */}
          <div className="hero-visual">
            <div className="cards-stage">
              {/* Back Card (VIP Party) */}
              <div className="card-mockup card-mockup-back" >
                <img src={cardVip} alt="Invitation VIP Party" className="card-img" />
                <div className="card-glare" />
              </div>

              {/* Front Card (Anniversaire 30 ans) */}
              <div className="card-mockup card-mockup-front" >
                <img src={cardAnniversary} alt="Invitation Anniversaire 30 ans" className="card-img" />
                <div className="card-glare" />
              </div>

              {/* Ambient blur circle behind cards */}
              <div className="cards-ambient-glow" />
            </div>
          </div>
        </div>

        {/* Feature Bar (White card spanning bottom of hero) */}
        <FeatureBanner />
      </section>

      {/* ===================== SECTION: MODÈLES ===================== */}
      <section className="section-container" id="modeles">
        <div className="section-header">
          <h2 className="section-heading">Explorez nos créations prêtes à l'emploi</h2>
          <p className="section-description">
            Sélectionnez un design coup de cœur et commencez la personnalisation en temps réel.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="template-categories-bar">
          {[
            { id: 'all', label: 'Tous les modèles' },
            { id: 'anniversaire', label: 'Anniversaire' },
            { id: 'mariage', label: 'Mariage' },
            { id: 'soiree', label: 'Soirée & VIP' },
            { id: 'diplome', label: 'Remise de Diplôme' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`category-tab-btn ${selectedCategory === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="templates-showcase-grid">
          {filteredTemplates.map((tpl) => (
            <div key={tpl.id} className="template-showcase-card">
              <div className="template-card-preview">
                <img src={tpl.image} alt={tpl.title} className="template-card-thumb" />
                <div className="template-hover-overlay">
                  <button
                    type="button"
                    className="btn-overlay-customize"
                    onClick={() => handleSelectTemplate(tpl.themeQuery)}
                  >
                    <span>Personnaliser ce modèle</span>
                  </button>
                </div>
              </div>
              <div className="template-card-footer">
                <h3 className="template-title">{tpl.title}</h3>
                <button
                  type="button"
                  className="template-quick-btn"
                  onClick={() => handleSelectTemplate(tpl.themeQuery)}
                >

                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="templates-cta-box">
          <p>Vous souhaitez un thème sur-mesure ? Notre moteur recherche parmi des centaines d'images.</p>
          <Link to="/create" className="btn-secondary-outline">
            <span>Ouvrir l'atelier complet</span>
          </Link>
        </div>
      </section>

      {/* ===================== SECTION: COMMENT ÇA MARCHE ===================== */}
      <section className="section-container steps-section" id="comment-ca-marche">
        <div className="section-header">

          <h2 className="section-heading">Comment ça marche ?</h2>
          <p className="section-description">
            Créez des invitations prestigieuses pour tous vos invités en 3 étapes intuitives.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number-badge">1</div>
            <Palette size={26} className="step-icon" />
            <h3 className="step-card-title">Choisissez votre style</h3>
            <p className="step-card-text">
              Parcourez les modèles artistiques, effectuez une recherche Unsplash ou sélectionnez un dégradé élégant.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number-badge">2</div>
            <Users size={26} className="step-icon" />
            <h3 className="step-card-title">Personnalisez en direct</h3>
            <p className="step-card-text">
              Modifiez le texte, la typographie, les couleurs et générez des cartes individuelles nominatives pour chacun de vos invités.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number-badge">3</div>
            <Download size={26} className="step-icon" />
            <h3 className="step-card-title">Téléchargez en 1 clic</h3>
            <p className="step-card-text">
              Exportez votre invitation en haute résolution PNG ou téléchargez l'ensemble de votre liste en un fichier ZIP prêt à être partagé.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: TARIFS ===================== */}
      <section className="section-container pricing-section" id="tarifs">
        <div className="section-header">
          <h2 className="section-heading">Des formules adaptées à chaque événement</h2>
          <p className="section-description">
            Aucun abonnement contraignant. Payez uniquement lorsque vous en avez besoin.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Free Tier */}
          <div className="pricing-card">
            <div className="pricing-card-header">
              <h3 className="pricing-tier-name">Découverte</h3>
              <p className="pricing-tier-desc">Pour concevoir et tester vos invitations en toute liberté.</p>
              <div className="pricing-price-box">
                <span className="price-amount">0 FCFA</span>
                <span className="price-period">/ gratuit</span>
              </div>
            </div>

            <ul className="pricing-features-list">
              <li>
                <CheckCircle2 size={18} className="feature-check" />
                <span>Création d'invitations illimitée</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="feature-check" />
                <span>Recherche d'images Unsplash intégrée</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="feature-check" />
                <span>Sélection de dégradés premium</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="feature-check" />
                <span>Téléchargement PNG standard</span>
              </li>
            </ul>

            <Link to="/create" className="btn-pricing-outline">
              Commencer gratuitement
            </Link>
          </div>

          {/* Pro Event Tier */}
          <div className="pricing-card pricing-card-featured">
            <div className="pricing-card-header">
              <h3 className="pricing-tier-name">Pack Événement VIP</h3>
              <p className="pricing-tier-desc">La solution ultime pour vos mariages, galas et grands anniversaires.</p>
              <div className="pricing-price-box">
                <span className="price-amount">2 500 FCFA</span>
                <span className="price-period">/ événement</span>
              </div>
            </div>

            <ul className="pricing-features-list">
              <li>
                <CheckCircle2 size={18} className="feature-check-gold" />
                <span><strong>Toutes les fonctionnalités gratuites</strong></span>
              </li>
              <li>
                <CheckCircle2 size={18} className="feature-check-gold" />
                <span>Génération multi-invités automatique</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="feature-check-gold" />
                <span>Export groupé en archive ZIP</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="feature-check-gold" />
                <span>Qualité d'impression Ultra-HD</span>
              </li>
              <li>
                <CheckCircle2 size={18} className="feature-check-gold" />
                <span>Paiement sécurisé MTN & Orange Money</span>
              </li>
            </ul>

            <Link to="/create" className="btn-hero-primary pricing-btn-cta">
              Créer mon événement
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== BANNER CTA ===================== */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-banner-content">
            <h2 className="cta-banner-title">Prêt à créer des invitations inoubliables ?</h2>
            <p className="cta-banner-text">
              Rejoignez des milliers d'organisateurs et envoyez des cartes personnalisées en quelques minutes.
            </p>
          </div>
          <Link to="/create" className="btn-hero-primary cta-banner-btn">
            <span>Créer mon invitation</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="cardify-footer">
        <div className="footer-container">
          <div className="footer-brand-col">
            <CardifyLogo linkTo="/" />
            <p className="footer-tagline">
              La plateforme moderne pour concevoir et générer des cartes d'invitation exceptionnelles.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <a href="#accueil">Accueil</a>
            <a href="#modeles">Modèles d'invitations</a>
            <a href="#comment-ca-marche">Comment ça marche</a>
            <a href="#tarifs">Tarifs</a>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Formats populaires</h4>
            <a href="#modeles" onClick={() => setSelectedCategory('anniversaire')}>Anniversaires</a>
            <a href="#modeles" onClick={() => setSelectedCategory('mariage')}>Mariages</a>
            <a href="#modeles" onClick={() => setSelectedCategory('soiree')}>Soirées VIP</a>
            <a href="#modeles" onClick={() => setSelectedCategory('diplome')}>Diplômes</a>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Sécurité & Paiement</h4>
            <p className="footer-info-text">MTN Mobile Money & Orange Money supportés.</p>
            <p className="footer-info-text">Aucune inscription obligatoire.</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Cardify. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
