import React, { useEffect } from "react";

const DevfolioButtonComponent = () => {
  useEffect(() => {
    // Load Devfolio SDK dynamically after the component mounts
    const script = document.createElement("script");
    script.src = "https://apply.devfolio.co/v2/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="apply-button"
      data-hackathon-slug="ignisys-ignitia"
      data-button-theme="light"
      style={{ height: "44px", width: "312px" }}
    />
  );
};

export const DevfolioButton = React.memo(DevfolioButtonComponent);
