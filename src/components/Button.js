// src/components/Button.js
"use client";

import React from "react";

const Button = ({ text, style, customStyle }) => {
  return (
    <button className={`btn ${style} text-sm ${customStyle}`}>
      {text}
    </button>
  );
};

export default Button;
