import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function ScrollContent({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    const update = () => {
      const top = viewport.scrollTop > 1;
      const bottom =
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop > 1;
      setEdges(previous =>
        previous.top === top && previous.bottom === bottom ?
          previous
        : { top, bottom },
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(content);
    viewport.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flex: 1,
        minHeight: 0,
        borderTop: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <DialogContent
        ref={viewportRef}
        sx={{ minHeight: 0, py: 0, px: { xxs: 2, sm: 3 } }}
      >
        <Box ref={contentRef} sx={{ display: "flow-root", pb: 2 }}>
          {children}
        </Box>
      </DialogContent>
      {(["top", "bottom"] as const).map(edge => (
        <Box
          key={edge}
          aria-hidden="true"
          sx={theme => ({
            position: "absolute",
            [edge]: 0,
            left: 0,
            right: 0,
            height: 6,
            pointerEvents: "none",
            opacity: edges[edge] ? 1 : 0,
            background: `linear-gradient(to ${edge === "top" ? "bottom" : "top"}, ${theme.alpha((theme.vars || theme).palette.text.primary, 0.06)}, transparent)`,
          })}
        />
      ))}
    </Box>
  );
}
