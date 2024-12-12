import React from "react";
import "../styles/SectionGroup.css";
import InputGroup from "./InputGroup";

function SectionGroup({ title, inputs, onChange }) {
  return (
    <>
      <h5 className="text-center text-info fw-bold py-2 shadow-sm">{title}</h5>
      <div className="section-group mb-4 p-3 ">
        <div className="d-flex justify-content-around">
          <div className="input-column">
            {inputs.right.map((input, index) => (
              <InputGroup
                key={`right-${index}`}
                label={input.label}
                field={input.field}
                unit={input.unit}
                side="right"
                onChange={onChange}
              />
            ))}
          </div>

          <div className="divider mx-3"></div>

          <div className="input-column">
            {inputs.left.map((input, index) => (
              <InputGroup
                key={`left-${index}`}
                label={input.label}
                field={input.field}
                unit={input.unit}
                side="left"
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SectionGroup;
