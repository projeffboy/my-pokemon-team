import { useEffect, useRef } from "react";
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
  const rampInitialized = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (!PUB_ID || !WEBSITE_ID) {
      console.warn("Missing Publisher Id and Website Id");
      return;
    }

    if (rampInitialized.current) {
      return; // Prevent re-initialization
    }
    rampInitialized.current = true;

    const ramp = (window.ramp ??= { que: [] });
    ramp.passiveMode = true;

    const configScript = document.createElement("script");
    configScript.src = `https://cdn.intergient.com/${PUB_ID}/${WEBSITE_ID}/ramp.js`;
    document.body.appendChild(configScript);
  }, [PUB_ID, WEBSITE_ID]);

  // Notify Playwire on every SPA navigation (queued items run once ramp.js loads)
  useEffect(() => {
    if (!rampInitialized.current) return;

    const ramp = (window.ramp ??= { que: [] });
    ramp.que.push(() => {
      window.ramp?.spaNewPage?.(location.pathname);
    });
  }, [location.pathname]);

  return null;
};

export default Ramp;
