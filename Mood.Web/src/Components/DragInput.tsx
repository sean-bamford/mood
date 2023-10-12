import { useState } from 'react';
import './DragInput.css';
import React from 'react';

interface DragInputProps {
    component: React.ReactNode;
}

const DragInput = ({ component }: DragInputProps) => {
    const [value, setValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            const newValue = value + Math.round(e.movementX / 2) - Math.round(e.movementY / 2);
            setValue(newValue);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
            setValue(newValue);
        }
    };

    return (
        <div id="dragInput">
            <div
                className={`slider ${isDragging ? 'grabbing' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {React.cloneElement(component as React.ReactElement, { value })}
            </div>
            <input
                id="inputField"
                type="text"
                className="input-field"
                value={value}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default DragInput;
