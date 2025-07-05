import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Ramp = ({ PUB_ID, WEBSITE_ID }) => {
  const [rampInitialized, setRampInitialized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!PUB_ID || !WEBSITE_ID) {
      console.log("Missing Publisher Id and Website Id");
      return;
    }

    if (rampInitialized) {
      return; // Prevent re-initialization
    }

    setRampInitialized(true);

    window.ramp = window.ramp || {};
    window.ramp.que = window.ramp.que || [];
    window.ramp.passiveMode = true;

    const configScript = document.createElement("script");
    configScript.src = `https://cdn.intergient.com/${PUB_ID}/${WEBSITE_ID}/ramp.js`;
    document.body.appendChild(configScript);

    configScript.onload = () => {
      window.ramp.que.push(() => {
        window.ramp.spaNewPage(location.pathname);
      });
    };
  }, [PUB_ID, WEBSITE_ID, location.pathname]); // Only depend on PUB_ID, WEBSITE_ID, and location.pathname

  return null;
};

export default Ramp;
