import React from 'react';

const SkipToContent: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      setTimeout(() => mainContent.removeAttribute('tabindex'), 1000);
    }
  };

  return (
    <a 
      href="#main-content" 
      className="skip-to-content" 
      onClick={handleClick}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
