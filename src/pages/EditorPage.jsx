import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  ArrowLeft,
  Search,
  Sparkles,
  Download,
  FolderArchive,
  Palette,
  Image as ImageIcon,
  X,
  User,
  Users,
  Check
} from "lucide-react";

import CardifyLogo from "../components/CardifyLogo";
import { premiumGradients } from "../gradients";
import "../App.css";

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const initialTheme = searchParams.get("theme") || "invitation";

  const [images, setImages] = useState([]);
  const [search, setSearch] = useState(initialTheme);
  const [mode, setMode] = useState("single");
  const [nom, setNom] = useState("");
  const [noms, setNoms] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradiantsOpen, setGradiantsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardRef = useRef(null);
  const cardsContainerRef = useRef(null);

  const listeInvites = noms
    .split(",")
    .map((nom) => nom.trim())
    .filter((nom) => nom !== "");

  const templates = [
    {
      id: 1,
      name: "Dark Luxury",
      background: "linear-gradient(135deg, #1f1f1f, #313159)",
    },
    {
      id: 2,
      name: "Elegant Rose",
      background: "linear-gradient(135deg, #f5d0c5, #ad7373)",
    },
    {
      id: 3,
      name: "Ocean Glow",
      background: "linear-gradient(135deg, #168aa7, #b8c1c3)",
    },
    {
      id: 4,
      name: "Sunset Gold",
      background: "linear-gradient(135deg, #e12514, #e99621)",
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState({
    type: "gradient",
    background: templates[0].background,
  });

  const randomGradient = () => {
    const colors = [
      "#ff7e5f", "#feb47b", "#6a11cb", "#2575fc",
      "#ff9a9e", "#fad0c4", "#a18cd1", "#fbc2eb",
      "#3b0764", "#7c3aed", "#0f172a", "#1e1b4b"
    ];

    const c1 = colors[Math.floor(Math.random() * colors.length)];
    const c2 = colors[Math.floor(Math.random() * colors.length)];

    return `linear-gradient(135deg, ${c1}, ${c2})`;
  };

  const fetchImages = async (query = "invitation") => {
    try {
      const apiKey = import.meta.env.VITE_UNSPLASH_KEY;
      if (!apiKey) {
        console.warn("VITE_UNSPLASH_KEY non défini dans .env");
        return;
      }
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&client_id=${apiKey}`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        setImages(data.results);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error("Erreur Unsplash :", err);
      setImages([]);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadInitialImages = async () => {
      try {
        const apiKey = import.meta.env.VITE_UNSPLASH_KEY;
        if (!apiKey) return;
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(search)}&per_page=12&client_id=${apiKey}`
        );
        const data = await res.json();
        if (isMounted && data.results) {
          setImages(data.results);
        }
      } catch (err) {
        console.error("Erreur Unsplash :", err);
      }
    };

    loadInitialImages();
    return () => {
      isMounted = false;
    };
  }, [search]);

  const cleanFileName = (name) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
      });
      const link = document.createElement("a");
      const safeName = cleanFileName(nom || "invite");
      link.download = `invitation_${safeName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!cardsContainerRef.current) return;
    const cards = cardsContainerRef.current.querySelectorAll(".card");
    if (cards.length === 0) {
      alert("Aucune carte à télécharger !");
      return;
    }
    setIsDownloading(true);
    try {
      for (let i = 0; i < cards.length; i++) {
        const canvas = await html2canvas(cards[i], {
          useCORS: true,
          scale: 2,
        });
        const link = document.createElement("a");
        link.download = `invitation_${i + 1}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement multiple:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!cardsContainerRef.current) return;
    const cards = cardsContainerRef.current.querySelectorAll(".card");
    if (cards.length === 0) {
      alert("Aucune carte à exporter dans le fichier ZIP !");
      return;
    }
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < cards.length; i++) {
        const canvas = await html2canvas(cards[i], { useCORS: true, scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const base64Data = imgData.split(",")[1];
        const inviteName = listeInvites[i] || `invite_${i + 1}`;
        const safeName = cleanFileName(inviteName);
        zip.file(`invitation_${safeName}.png`, base64Data, { base64: true });
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "invitations_cardify.zip");
    } catch (error) {
      console.error("Erreur lors de la création du ZIP:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="editor-page-wrapper">
      {/* Top Header Bar */}
      <header className="editor-topbar">
        <div className="editor-topbar-left">
          <Link to="/" className="btn-back-home" title="Retour à l'accueil">
            <ArrowLeft size={18} />
            <span>Accueil</span>
          </Link>
          <div className="editor-brand-divider" />
          <CardifyLogo linkTo="/" />
        </div>

        <div className="editor-mode-toggle">
          <button
            type="button"
            className={`mode-toggle-btn ${mode === "single" ? "active" : ""}`}
            onClick={() => setMode("single")}
          >
            <User size={16} />
            <span>Invitation unique</span>
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${mode === "multiple" ? "active" : ""}`}
            onClick={() => setMode("multiple")}
          >
            <Users size={16} />
            <span>Plusieurs invités</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="editor-workspace">
        {/* Left Panel: Form & Controls */}
        <aside className="editor-controls-panel">
          <div className="editor-panel-card">
            <h2 className="editor-panel-title">
              {mode === "single" ? "Personnaliser l'invitation" : "Créer pour plusieurs invités"}
            </h2>

            {/* Unsplash Search */}
            <div className="form-group">
              <label className="input-label">Image d'arrière-plan (Unsplash)</label>
              <div className="search-input-group">
                <input
                  className="searchInput"
                  type="text"
                  placeholder="Thème (mariage, anniversaire, fete...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      fetchImages(search);
                      setIsModalOpen(true);
                    }
                  }}
                />
                <button
                  className="search-btn"
                  type="button"
                  onClick={() => {
                    fetchImages(search);
                    setIsModalOpen(true);
                  }}
                  title="Rechercher des photos"
                >
                  <Search size={16} />
                  <span>Rechercher</span>
                </button>
              </div>

              {/* Quick tags */}
              <div className="theme-tags-row">
                <button
                  type="button"
                  className="theme-tag-btn gradient-btn"
                  onClick={() => setGradiantsOpen(true)}
                >
                  <Palette size={14} />
                  <span>Dégradés</span>
                </button>
                {["mariage", "anniversaire", "fete", "diplome"].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    className="theme-tag-btn"
                    onClick={() => {
                      setSearch(cat);
                      fetchImages(cat);
                      setIsModalOpen(true);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Invitation Content Fields */}
            <div className="form-group">
              <label className="input-label">Titre de l'événement</label>
              <input
                className="infoInput"
                type="text"
                placeholder="Ex: Mon 30ème Anniversaire"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {mode === "single" ? (
              <div className="form-group">
                <label className="input-label">Nom de l'invité</label>
                <input
                  className="infoInput"
                  type="text"
                  placeholder="Ex: Sophie Martin"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="input-label">
                  Liste des invités (séparés par des virgules)
                </label>
                <textarea
                  className="infoInput textarea-invites"
                  placeholder="Ex: Sophie, Alexandre, Fatima, David, Chloé"
                  value={noms}
                  onChange={(e) => setNoms(e.target.value)}
                  rows={3}
                />
                <span className="counter-badge">
                  {listeInvites.length} invité{listeInvites.length > 1 ? "s" : ""} identifié{listeInvites.length > 1 ? "s" : ""}
                </span>
              </div>
            )}

            <div className="form-group">
              <label className="input-label">Message d'invitation</label>
              <textarea
                className="infoInput"
                placeholder="Ex: Je serais ravi(e) de partager ce moment inoubliable avec vous..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Styling Options: Color & Font */}
            <div className="styling-options-row">
              <div className="form-group flex-1">
                <label className="input-label">Couleur du texte</label>
                <div className="color-picker-row">
                  <input
                    className="colorInput"
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                  />
                  <span className="color-hex-text">{fontColor}</span>
                </div>
              </div>

              <div className="form-group flex-1">
                <label className="input-label">Police</label>
                <select
                  className="selectInput"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="Arial">Arial (Moderne)</option>
                  <option value="'Outfit', sans-serif">Outfit (Design)</option>
                  <option value="'Cinzel', serif">Cinzel (Luxe)</option>
                  <option value="'Great Vibes', cursive">Great Vibes (Calligraphie)</option>
                  <option value="Georgia, serif">Georgia (Classique)</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
              </div>
            </div>

            {/* Quick Random Gradient Button */}
            <button
              type="button"
              className="btn-random-gradient"
              onClick={() =>
                setSelectedTemplate({
                  type: "gradient",
                  background: randomGradient(),
                })
              }
            >
              <Sparkles size={16} />
              <span>Générer un fond aléatoire</span>
            </button>

            {/* Download Action Buttons */}
            <div className="editor-download-actions">
              {mode === "single" ? (
                <button
                  type="button"
                  className="generationButton btn-primary-download"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <Download size={18} />
                  <span>{isDownloading ? "Téléchargement..." : "Télécharger l'invitation (PNG)"}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="generationButton btn-primary-download"
                    onClick={handleDownloadZip}
                    disabled={isDownloading || listeInvites.length === 0}
                  >
                    <FolderArchive size={18} />
                    <span>{isDownloading ? "Génération du ZIP..." : "Télécharger tout en ZIP"}</span>
                  </button>
                  <button
                    type="button"
                    className="generationButton btn-secondary-download"
                    onClick={handleDownloadAll}
                    disabled={isDownloading || listeInvites.length === 0}
                  >
                    <Download size={18} />
                    <span>Télécharger cartes séparées</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Right Panel: Live Real-Time Card Preview */}
        <section className="editor-preview-panel">
          <div className="preview-header-bar">
            <span className="preview-title-tag">Aperçu en direct (Rendu HD)</span>
            {mode === "multiple" && (
              <span className="preview-count-tag">
                {listeInvites.length} carte{listeInvites.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="preview-canvas-container">
            {mode === "single" ? (
              <div
                className="card card-live-preview"
                ref={cardRef}
                style={{
                  background:
                    selectedTemplate?.type === "image"
                      ? `url(${selectedTemplate.background})`
                      : selectedTemplate?.background,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "darken",
                  backgroundColor: "rgba(0,0,0,0.35)",
                }}
              >
                <div className="card-inner-content">
                  <h1 className="card-headline" style={{ color: fontColor, fontFamily: fontFamily }}>
                    {title || "Titre de l'invitation"}
                  </h1>
                  <p className="card-recipient" style={{ color: fontColor, fontFamily: fontFamily }}>
                    Cher(e) <strong><em>{nom || "Nom de l'invité"}</em></strong>,
                  </p>
                  <p className="card-body-text" style={{ color: fontColor, fontFamily: fontFamily }}>
                    {message || "Votre message d'invitation personnalisé apparaîtra ici..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="cards-multi-scroll" ref={cardsContainerRef}>
                {listeInvites.length === 0 ? (
                  <div className="card-empty-placeholder">
                    <Users size={48} className="placeholder-icon" />
                    <h4>Aucun invité pour le moment</h4>
                    <p>Saisissez les prénoms de vos invités séparés par des virgules dans le formulaire de gauche.</p>
                  </div>
                ) : (
                  listeInvites.map((invite, index) => (
                    <div key={index} className="multi-card-item-wrapper">
                      <div className="multi-card-item-header">
                        <span className="multi-card-badge">Carte #{index + 1}</span>
                        <span className="multi-card-guest-name">Pour : <strong>{invite}</strong></span>
                      </div>
                      <div
                        className="card card-multi-item"
                        style={{
                          background:
                            selectedTemplate?.type === "image"
                              ? `url(${selectedTemplate.background})`
                              : selectedTemplate?.background,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundBlendMode: "darken",
                          backgroundColor: "rgba(0,0,0,0.35)",
                        }}
                      >
                        <div className="card-inner-content">
                          <h1 className="card-headline" style={{ color: fontColor, fontFamily: fontFamily }}>
                            {title || "Titre de l'invitation"}
                          </h1>
                          <p className="card-recipient" style={{ color: fontColor, fontFamily: fontFamily }}>
                            Cher(e) <strong><em>{invite}</em></strong>,
                          </p>
                          <p className="card-body-text" style={{ color: fontColor, fontFamily: fontFamily }}>
                            {message || "Votre message d'invitation personnalisé apparaîtra ici..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL: UNSPLASH IMAGES SELECTION */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-box">
                <ImageIcon size={20} className="text-purple-600" />
                <h3>Choisir une image d'arrière-plan</h3>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-search-row">
              <input
                className="searchInput"
                type="text"
                placeholder="Rechercher sur Unsplash..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    fetchImages(search);
                  }
                }}
              />
              <button
                type="button"
                className="search-btn"
                onClick={() => fetchImages(search)}
              >
                <Search size={16} />
                <span>Rechercher</span>
              </button>
            </div>

            <div className="templates-modal-grid">
              {images.length > 0 ? (
                images.map((img) => (
                  <div
                    key={img.id}
                    className="template-img-card"
                    onClick={() => {
                      setSelectedTemplate({
                        type: "image",
                        background: img.urls.regular,
                      });
                      setIsModalOpen(false);
                    }}
                    style={{
                      backgroundImage: `url(${img.urls.small})`,
                    }}
                  >
                    <div className="template-img-hover">
                      <Check size={20} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="modal-empty-state">
                  <p>Aucune image trouvée pour "{search}". Essayez une autre recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GRADIENTS SELECTION */}
      {gradiantsOpen && (
        <div className="modal-overlay" onClick={() => setGradiantsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-box">
                <Palette size={20} className="text-purple-600" />
                <h3>Choisir un dégradé élégant</h3>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setGradiantsOpen(false)}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="templates-modal-grid">
              {premiumGradients.map((gradient, index) => (
                <div
                  key={index}
                  className="gradient-template-card"
                  onClick={() => {
                    setSelectedTemplate({
                      type: "gradient",
                      background: gradient,
                    });
                    setGradiantsOpen(false);
                  }}
                  style={{ background: gradient }}
                >
                  <div className="gradient-card-overlay">
                    <Check size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
