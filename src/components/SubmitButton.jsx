import React from 'react';

function SubmitButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      style={{ minWidth: "36px" }}
      title="Submit"
    >
      ✔
    </button>
  );
}

export default SubmitButton;
