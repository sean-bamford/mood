import React, { useState, useEffect } from 'react';
import './DragInput.css';

const DragInput = () => {
    const [value, setValue] = useState(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
  
    const handleMouseDown = () => {
      setIsDragging(true);
      console.log(isDragging)
      document.addEventListener('mousemove', (e) => handleMouseMove(e));
      document.addEventListener('mouseup', handleMouseUp);
    console.log("mouse down");
    };
  
    const handleMouseMove = (e) => {
       if (isDragging === true) {
        const newValue = value + e.movementX;
        setValue(newValue);
        console.log("mouse move");
        console.log(isDragging)
       }
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      console.log("mouse up");
    };
  
    const handleInputChange = (e) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        setValue(newValue);
        console.log("input change");
      }
    };
  
    return (
      <div id="dragInput">
        <div className="slider" onMouseDown={handleMouseDown}></div>
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
  