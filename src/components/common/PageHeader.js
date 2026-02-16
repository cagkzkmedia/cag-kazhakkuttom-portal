import React from 'react';
import { useNavigate } from 'react-router-dom';
import churchLogo from '../../assets/cag-logo.png';
import agLogo from '../../assets/ag-logo.png';
import './PageHeader.css';

const PageHeader = ({ title, subtitle, showBackButton = false, backPath = '/' }) => {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <div className="page-header-logos">
        <img src={agLogo} alt="Assemblies of God" className="page-header-logo ag-logo" />
        <img src={churchLogo} alt="Christ AG Church" className="page-header-logo church-logo" />
      </div>
      
      <div className="page-header-content">
        <h1 className="page-header-title">{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        <div className="page-header-church-name">
          Christ AG Church Kazhakkoottam
        </div>
      </div>

      {showBackButton && (
        <button 
          className="page-header-back-btn"
          onClick={() => navigate(backPath)}
          aria-label="Go back"
        >
          ← Back
        </button>
      )}
    </div>
  );
};

export default PageHeader;
