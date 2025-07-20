import React from "react";

interface DownloadJsonButtonProps {
  json: string; 
  fileName?: string; 
}

const DownloadJsonButton: React.FC<DownloadJsonButtonProps> = ({
  json,
  fileName = "formatted.json",
}) => {
  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
    >
      Download JSON
    </button>
  );
};

export default DownloadJsonButton;