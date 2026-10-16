import { Fragment } from 'react';
import { Layers, ShieldCheck, UserCheck, Download } from 'lucide-react';

export default function FeatureBanner() {
  const features = [
    {
      id: 'models',
      icon: <Layers size={22} className="feature-icon-svg" />,
      title: '1000+',
      subtitle: 'Modèles disponibles',
    },
    {
      id: 'payment',
      icon: <ShieldCheck size={22} className="feature-icon-svg" />,
      title: 'Paiement sécurisé',
      subtitle: 'MTN Mobile & Orange Money',
    },
    {
      id: 'no-account',
      icon: <UserCheck size={22} className="feature-icon-svg" />,
      title: 'Sans inscription',
      subtitle: 'Aucun compte nécessaire',
    },
    {
      id: 'download',
      icon: <Download size={22} className="feature-icon-svg" />,
      title: 'Téléchargement',
      subtitle: 'Instantané',
    },
  ];

  return (
    <section className="feature-banner-wrapper">
      <div className="feature-banner-card">
        {features.map((item, index) => (
          <Fragment key={item.id}>
            <div className="feature-item">
              <div className="feature-icon-box">
                {item.icon}
              </div>
              <div className="feature-text">
                <h4 className="feature-title">{item.title}</h4>
                <p className="feature-subtitle">{item.subtitle}</p>
              </div>
            </div>
            {index < features.length - 1 && <div className="feature-divider" />}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
