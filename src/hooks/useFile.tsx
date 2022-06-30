import React, { useState } from "react";

const useFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (readerEvent) => {
          if (readerEvent.target?.result) {
            setSelectedFiles((prev) => [
              ...prev,
              readerEvent.target?.result as string,
            ]);
          }
        };
      });
    }
  };
  
  return {
    selectedFile,
    setSelectedFile,
    onSelectFile,
    selectedFiles,
    setSelectedFiles,
    onSelectFiles,
  };
};

export default useFile;
