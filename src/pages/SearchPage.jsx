import React from 'react';
import SocialLayout from '../components/layout/SocialLayout';
import SearchUsers from '../components/social/SearchUsers';

const SearchPage = () => {
  const handleResultSelect = (result) => {
    console.log('Selected result:', result);
    // TODO: Navigate to result page
  };

  return (
    <SocialLayout showSidebars={false}>
      <div className="max-w-4xl mx-auto">
        <SearchUsers onResultSelect={handleResultSelect} />
      </div>
    </SocialLayout>
  );
};

export default SearchPage;