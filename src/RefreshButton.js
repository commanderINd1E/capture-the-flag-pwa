import React from 'react';

const RefreshButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={{ margin: '10px', padding: '10px' }}>
      Refresh
    </button>
  );
};

export default RefreshButton;
