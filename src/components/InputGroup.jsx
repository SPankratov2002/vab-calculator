import React from "react";

function InputGroup({ label, field, unit, side, value, onChange }) {
  return (
    <div className="input-group mb-2">
      <input
        type="number"
        className="form-control"
        placeholder={label}
        value={value} // Привязка значения
        onChange={(e) => onChange(side, field, e.target.value)}
      />
      <span className="input-group-text text-muted ">{unit}</span>
    </div>
  );
}

export default InputGroup;
