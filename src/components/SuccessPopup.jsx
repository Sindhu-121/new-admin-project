import React from 'react';

function SuccessPopup(props) {
  return (
    <div className="success-popup">
      <div className="success-content">
        <h2>Success!</h2>
        <p>Exam created successfully and saved to the database.</p>
        <button onClick={props.onClose}>Close</button>
      </div>
    </div>
  );
}

export default SuccessPopup;