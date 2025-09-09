import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentFlow from './components/AssessmentFlow';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'assessment'>('landing');

  // Check URL parameters on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('page') === 'assessment') {
      setCurrentPage('assessment');
    }
  }, []);

  // Update URL when page changes
  const handlePageChange = (page: 'landing' | 'assessment') => {
    setCurrentPage(page);
    const url = new URL(window.location.href);
    if (page === 'assessment') {
      url.searchParams.set('page', 'assessment');
    } else {
      url.searchParams.delete('page');
    }
    window.history.pushState({}, '', url.toString());
  };

  const handleStartAssessment = () => {
    handlePageChange('assessment');
  };

  const handleBackToLanding = () => {
    handlePageChange('landing');
  };

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage onStartAssessment={handleStartAssessment} />
      ) : (
        <AssessmentFlow onBackToLanding={handleBackToLanding} />
      )}
    </>
  );
}

export default App;