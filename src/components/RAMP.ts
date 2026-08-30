import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface RampProps {
  PUB_ID: number;
  WEBSITE_ID: number;
}

interface RampWindow {
  que: Array<() => void>;
  passiveMode?: boolean;
  spaNewPage?: (pathname: string) => void;
}

declare global {
  interface Window {
    ramp?: RampWindow;
  }
}

const Ramp = ({ PUB_ID, WEBSITE_ID }: RampProps) => {
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

    const ramp = (window.ramp ??= { que: [] });
    ramp.passiveMode = true;

    const configScript = document.createElement("script");
    configScript.src = `https://cdn.intergient.com/${PUB_ID}/${WEBSITE_ID}/ramp.js`;
    document.body.appendChild(configScript);

    configScript.onload = () => {
      ramp.que.push(() => {
        window.ramp?.spaNewPage?.(location.pathname);
      });
    };
  }, [PUB_ID, WEBSITE_ID, location.pathname]); // Only depend on PUB_ID, WEBSITE_ID, and location.pathname

  return null;
};

export default Ramp;
