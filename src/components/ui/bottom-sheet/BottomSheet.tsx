import React, { useEffect, useRef, useCallback } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const BottomSheet: React.FC<Props> = ({ isOpen, onClose, children, title, subtitle }) => {
  const sheetRef   = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragState  = useRef({ dragging: false, startY: 0, currentY: 0 });

  // Body scroll lock — save & restore previous value
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : prev;
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Drag-to-dismiss
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragState.current = { dragging: true, startY: e.clientY, currentY: 0 };
    sheetRef.current!.style.transition = "none";
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragState.current.dragging) return;
      const dy = Math.max(0, e.clientY - dragState.current.startY);
      dragState.current.currentY = dy;
      if (sheetRef.current)   sheetRef.current.style.transform   = `translateY(${dy}px)`;
      if (overlayRef.current) overlayRef.current.style.opacity   = String(Math.max(0, 0.5 - dy / 400));
    };

    const onUp = () => {
      if (!dragState.current.dragging) return;
      dragState.current.dragging = false;
      const sheet   = sheetRef.current;
      const overlay = overlayRef.current;
      if (!sheet) return;

      if (dragState.current.currentY > 80) {
        sheet.style.transition = "transform 0.25s cubic-bezier(0.32,0.72,0,1)";
        sheet.style.transform  = "translateY(100%)";
        if (overlay) { overlay.style.transition = "opacity 0.25s"; overlay.style.opacity = "0"; }
        setTimeout(onClose, 250);
      } else {
        sheet.style.transition = "transform 0.3s cubic-bezier(0.32,0.72,0,1)";
        sheet.style.transform  = "translateY(0)";
        if (overlay) { overlay.style.opacity = "0.5"; }
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50"
        style={{
          opacity:       isOpen ? 0.5 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition:    "opacity 0.3s",
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-lg
          bg-white dark:bg-[#111] rounded-t-[24px] shadow-2xl"
        style={{
          transform:  isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.4s cubic-bezier(0.32,0.72,0,1)",
          paddingBottom: "env(safe-area-inset-bottom, 24px)",
        }}
      >
        {/* Drag handle */}
        <div
          onPointerDown={onPointerDown}
          className="flex flex-col items-center pt-4 pb-1 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="w-9 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-7 h-7 rounded-full flex items-center justify-center
            bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10
            active:scale-90 transition-transform"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className="text-gray-500 dark:text-white/50">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Optional title */}
        {(title || subtitle) && (
          <div className="px-5 pt-2 pb-1">
            {title    && <h3 className="text-[17px] font-extrabold text-gray-900 dark:text-white">{title}</h3>}
            {subtitle && <p  className="text-[13px] text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        )}

        {/* Content */}
        <div className="px-5 pt-3 pb-2 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;