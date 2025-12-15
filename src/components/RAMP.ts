import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    ramp: {
      que: (() => void)[];
      passiveMode: boolean;
      spaNewPage: (path: string) => void;
    };
  }
}

interface RampProps {
  PUB_ID: number;
  WEBSITE_ID: number;
}

const Ramp: React.FC<RampProps> = ({ PUB_ID, WEBSITE_ID }) => {
  const [rampComponentLoaded, setRampComponentLoaded] = useState(false);
  const location = useLocation(); // React Router hook to get the current location

  useEffect(() => {
    if (!PUB_ID || !WEBSITE_ID) {
      console.log("Missing Publisher Id and Website Id");
      return;
    }

    if (!rampComponentLoaded) {
      setRampComponentLoaded(true);
      window.ramp = window.ramp || {};
      window.ramp.que = window.ramp.que || [];
      window.ramp.passiveMode = true;

      // Load the Ramp configuration script
      const configScript = document.createElement("script");
      configScript.src = `https://cdn.intergient.com/${PUB_ID}/${WEBSITE_ID}/ramp.js`;
      document.body.appendChild(configScript);

      configScript.onload = () => {
        window.ramp.que.push(() => {
          window.ramp.spaNewPage(location.pathname);
        });
      };
    }

    // Cleanup function to handle component unmount
    return () => {
      window.ramp.que.push(() => {
        window.ramp.spaNewPage(location.pathname);
      });
    };
  }, [location.pathname, PUB_ID, WEBSITE_ID]);

  return null;
};

export default Ramp;
