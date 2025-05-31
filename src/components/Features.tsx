import { FaShieldAlt, FaBolt, FaCloud } from 'react-icons/fa';
import './Features.css';

export const Features = () => {
  const features = [
    {
      icon: <FaBolt />,
      title: 'Fast & Easy',
      description: 'Merge PDFs in seconds with our intuitive interface'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure',
      description: 'Your files are encrypted and automatically deleted after processing'
    },
    {
      icon: <FaCloud />,
      title: 'Cloud Storage',
      description: 'Access your merged PDFs anywhere, anytime'
    }
  ];

  return (
    <section className="features">
      <h2>Why Choose Our PDF Merger?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
