// File: FileContext.js
import React, { createContext, useState } from 'react';


export const ContextFileImage = createContext();

export const FileProvider = ({ children }) => {
  const [fileImgae, setFileImage] = useState(null);

  return (
    <ContextFileImage.Provider value={{ fileImgae, setFileImage }}>
      {children}
    </ContextFileImage.Provider>
  );
};
