import { useState, useRef, useEffect } from "react";
import "./App.css";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { premiumGradients } from "./gradients";


function App() {

  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("invitation");
  const [mode, setMode] = useState("single");
  const [nom, setNom] = useState("");
  const [noms, setNoms] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [bgColor, setBgColor] = useState("#fff8e1");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradiantsOpen, setGradiantsOpen] = useState(false);

  const cardRef = useRef(null);

  const listeInvites = noms
    .split(",")
    .map((nom) => nom.trim())
    .filter((nom) => nom !== "");

  const templates = [
    {
      id: 1,
      name: "Elegant",
      background: "linear-gradient(135deg, #f5d0c5, #ad7373)",
    },
    {
      id: 2,
      name: "Dark Luxury",
      background: "linear-gradient(135deg, #1f1f1f, #313159)",
    },
    {
      id: 3,
      name: "Ocean",
      background: "linear-gradient(135deg, #168aa7, #b8c1c3)",
    },
    {
      id: 4,
      name: "Sunset",
      background: "linear-gradient(135deg, #e12514, #e99621)",
    },

  ];

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const randomGradient = () => {
    const colors = [
      "#ff7e5f", "#feb47b", "#6a11cb", "#2575fc",
      "#ff9a9e", "#fad0c4", "#a18cd1", "#fbc2eb"
    ];

    const c1 = colors[Math.floor(Math.random() * colors.length)];
    const c2 = colors[Math.floor(Math.random() * colors.length)];

    return `linear-gradient(135deg, ${c1}, ${c2})`;
  };



  const fetchImages = async (query = "invitation") => {
    try {
      console.log("Recherche :", query);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`
      );
      console.log(import.meta.env.VITE_UNSPLASH_KEY);
      const data = await res.json();

      if (data.results) {
        setImages(data.results);
      } else {
        console.error("Pas de résultats :", data);
        setImages([]);
      }
    } catch (err) {
      console.error("Erreur Unsplash :", err);
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages(search);
  }, []);

  const handleDownload = () => {
    html2canvas(cardRef.current, { useCORS: true, }).then((canvas) => {
      const link = document.createElement("a");
      const safeName = cleanFileName(nom || "invite");
      link.download = `invitation_${safeName}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleDownloadAll = async () => {
    const cards = cardsContainerRef.current.querySelectorAll(".card");
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
  };

  const cleanFileName = (name) => {
    return name
      .normalize("NFD") // enlève accents
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_") // remplace caractères spéciaux
      .toLowerCase();
  };


  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const cards = cardsContainerRef.current.querySelectorAll(".card");
    if (cards.length === 0) {
      alert("Aucune carte à télécharger !");
      return;
    }
    for (let i = 0; i < cards.length; i++) {
      const canvas = await html2canvas(cards[i]);
      const imgData = canvas.toDataURL("image/png");
      // convertir base64 en fichier
      const base64Data = imgData.split(",")[1];
      const inviteName = listeInvites[i] || `invite_${i + 1}`;
      const safeName = cleanFileName(inviteName);
      zip.file(`invitation_${i + 1}.png`, base64Data, { base64: true });
    }
    // générer le zip
    const content = await zip.generateAsync({ type: "blob" });
    // télécharger
    saveAs(content, "invitations.zip");
  };

  const cardsContainerRef = useRef(null);

  // const generateInvites = () => {
  //   const liste = noms
  //     .split(",")
  //     .map((nom) => nom.trim())
  //     .filter((nom) => nom !== "");

  //   setListeInvites(liste);
  // };


  return (
    <div className="container">

      {/* MODE UN SEUL INVITE */}
      {mode === "single" && (
        <>
          <form className="form">
            <h3>Créer une invitation</h3>

            <div className="row">
              <input
                className="searchInput"
                type="text"
                placeholder="Rechercher un thème (mariage, anniversaire...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button className="search-btn" type="button" onClick={() => { fetchImages(search); setIsModalOpen(true) }}>
                Rechercher
              </button>
            </div>

            <div className="row">
              <button type="button" onClick={() => { setGradiantsOpen(true); console.log("gradient option click") }}>
                dégradés
              </button>
              {["marriage", "anniversaire", "fete", "diplome"].map((cat) => (
                <button type="button" key={cat} className="preOption" onClick={() => { fetchImages(cat); setIsModalOpen(true) }}>
                  {cat}
                </button>
              ))}
            </div>


            <div className="modeSelector">
              <label className={`modeOption ${mode === "single" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="mode"
                  value="single"
                  checked={mode === "single"}
                  onChange={() => setMode("single")}
                />
                Invitation unique
              </label>

              <label className={`modeOption ${mode === "multi" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="mode"
                  value="multiple"
                  checked={mode === "multiple"}
                  onChange={() => setMode("multiple")}
                />
                Plusieurs invités
              </label>
            </div>


            {gradiantsOpen && (console.log("gradiantsOpen"),
              <div className="modal-overlay" onClick={() => setGradiantsOpen(false)}>
                <div className="modal-content" >

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setGradiantsOpen(false)}
                  >
                    ✕
                  </button>

                  <h3>Choisir un dégradé</h3>

                  <div className="templates">
                    {/* {templates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="gradient-template"
                        onClick={() => {
                          setSelectedTemplate(tpl);
                        }}
                        style={{ background: tpl.background }}
                      >
                        {tpl.name}
                      </div>
                    ))} */}
                    {premiumGradients.map((gradient, index) => (
                      <div
                        key={index}
                        className="gradient-template"
                        onClick={() => {
                          setSelectedTemplate({
                            type: "gradient",
                            background: gradient
                          });
                        }}
                        style={{ background: gradient }}
                      />
                    ))}
                  </div>

                </div>
              </div>
            )}



            {isModalOpen && (
              <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>

                  <h3>Choisir un background</h3>

                  <div className="templates">
                    {images.length > 0 && images.map((img) => (
                      <div
                        key={img.id}
                        className="template-img"
                        onClick={() =>
                          setSelectedTemplate({
                            type: "image",
                            background: img.urls.regular,
                          })
                        }
                        style={{
                          backgroundImage: `url(${img.urls.small})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          width: "100px",
                          height: "100px",
                        }}
                      />
                    ))}
                  </div>

                </div>
              </div>
            )}


            <input
              className="infoInput"
              type="text"
              placeholder="Titre de l'invitation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="infoInput"
              type="text"
              placeholder="Nom de l'invité"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />

            <textarea
              className="infoInput"
              placeholder="Votre message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="line">
              {/* <div>
                <input
                  className="colorInput"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <label>Fond : {bgColor}</label>
              </div> */}

              <div>
                <input
                  className="colorInput"
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                />
                <label>Texte : {fontColor}</label>
              </div>
              <button type="button" onClick={() => setSelectedTemplate({
                type: "gradient",
                background: randomGradient()
              })}>
                Générer
              </button>
            </div>

            <div className="line">
              <label>Police :</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option>Arial</option>
                <option>Georgia</option>
                <option>Verdana</option>
                <option>Courier New</option>
              </select>
            </div>

            <button type="button" className="generationButton" onClick={handleDownload}>
              Télécharger
            </button>
          </form>

          {/* CARD */}
          <div
            className="card"
            ref={cardRef}
            style={{
              background:
                selectedTemplate?.type === "image"
                  ? `url(${selectedTemplate.background})`
                  : selectedTemplate?.background,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "darken",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <h1 style={{ color: fontColor, fontFamily: fontFamily }}>{title || "Titre de l'invitation"}</h1>
            <p style={{ color: fontColor, fontFamily: fontFamily }}>
              Chere <strong><em>{nom || "..."}</em></strong>,
            </p>
            <p style={{ color: fontColor, fontFamily: fontFamily }}>
              {message || "Votre message ici..."}
            </p>
          </div>
        </>
      )}

      {/*MODE PLUSIEURS INVITES */}
      {mode === "multiple" && (
        <>
          <form className="form">
            <h3>CREER PLUSIEURES INVITATIONS</h3>

            <div className="row">
              <input
                type="text"
                className="searchInput"
                placeholder="Rechercher un thème (mariage, anniversaire...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button type="button" className="search-btn" onClick={() => { fetchImages(search); setIsModalOpen(true) }}>
                Rechercher
              </button>
            </div>

            <div className="row">
              <button type="button" onClick={() => { setGradiantsOpen(true); console.log("gradient option click") }}>
                dégradés
              </button>
              {["marriage", "anniversaire", "fete", "diplome"].map((cat) => (
                <button type="button" key={cat} className="preOption" onClick={() => { fetchImages(cat); setIsModalOpen(true) }}>
                  {cat}
                </button>
              ))}
            </div>



            <div className="modeSelector">
              <label className={`modeOption ${mode === "single" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="mode"
                  value="single"
                  checked={mode === "single"}
                  onChange={() => setMode("single")}
                />
                Invitation unique
              </label>

              <label className={`modeOption ${mode === "multiple" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="mode"
                  value="multiple"
                  checked={mode === "multiple"}
                  onChange={() => setMode("multiple")}
                />
                Plusieurs invités
              </label>
            </div>

            {gradiantsOpen && (console.log("gradiantsOpen"),
              <div className="modal-overlay" onClick={() => setGradiantsOpen(false)}>
                <div className="modal-content" >

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setGradiantsOpen(false)}
                  >
                    ✕
                  </button>

                  <h3>Choisir un dégradé</h3>

                  <div className="templates">
                    {templates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="gradient-template"
                        onClick={() => {
                          setSelectedTemplate(tpl);
                        }}
                        style={{ background: tpl.background }}
                      >
                        {tpl.name}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            <textarea
              className="infoInput"
              placeholder="Noms séparés par virgules"
              value={noms}
              onChange={(e) => setNoms(e.target.value)}
            />

            <textarea
              className="infoInput"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div>
              <input
                className="colorInput"
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
              />
              <label>Texte : {fontColor}</label>
            </div>
            <button type="button" onClick={() => setSelectedTemplate({
              type: "gradient",
              background: randomGradient()
            })}>
              Générer
            </button>

            {isModalOpen && (
              <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>

                  <h3>Choisir un background</h3>

                  <div className="templates">
                    {images.length > 0 && images.map((img) => (
                      <div
                        key={img.id}
                        className="template-img"
                        onClick={() =>
                          setSelectedTemplate({
                            type: "image",
                            background: img.urls.regular,
                          })
                        }
                        style={{
                          backgroundImage: `url(${img.urls.small})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          width: "100px",
                          height: "100px",
                        }}
                      />
                    ))}
                  </div>

                </div>

              </div>
            )}


            <button type="button" className="generationButton" onClick={handleDownloadAll}>
              Télécharger toutes les invitations
            </button>
            <button type="button" className="generationButton" onClick={handleDownloadZip}>
              Télécharger en ZIP
            </button>

          </form>

          {/* MULTIPLES CARTES */}
          <div className="cards" ref={cardsContainerRef}>
            {listeInvites.length === 0 && <div className="card"><p>Aucun invité pour le moment</p></div>}
            {listeInvites.map((invite, index) => (
              <div
                key={index}
                className="card"
                style={{
                  background:
                    selectedTemplate?.type === "image"
                      ? `url(${selectedTemplate.background})`
                      : selectedTemplate?.background,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "darken",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  fontFamily
                }}
              >
                {/* <h2>Invitation</h2>
                <p style={{ color: fontColor }}>
                  Cher(e) <strong>{invite}</strong>,
                </p> */}
                <h1 style={{ color: fontColor, fontFamily: fontFamily }}>{title || "Titre de l'invitation"}</h1>
                <p style={{ color: fontColor, fontFamily: fontFamily }}>
                  Chere <strong><em>{invite || "..."}</em></strong>,
                </p>
                <p style={{ color: fontColor, fontFamily: fontFamily }}>
                  {message || "Votre message ici..."}
                </p>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;