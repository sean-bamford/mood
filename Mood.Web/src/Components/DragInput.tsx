import React, { useState } from 'react';
import './DragInput.css';

const DragInput = () => {
  const [value, setValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    // Ensure that isDragging is true before updating the value
    if (isDragging) {
      const newValue = value + e.movementX;
      setValue(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <div id="dragInput">
      <div
        className={`slider ${isDragging ? 'grabbing' : ''}`} // Removed 'grab' class
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove} // Added mousemove event
        onMouseUp={handleMouseUp}
      ></div>
      <input
        id="inputField"
        type="text"
        className="input-field"
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default DragInput;
