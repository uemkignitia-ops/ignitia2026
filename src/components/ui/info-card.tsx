import React, { useRef, useState } from "react";

// RTL detection for Hebrew/Arabic
function isRTL(text: string) {
  return /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);
}

export interface InfoCardProps {
  image: string;
  overlayImage?: string;
  title: string;
  description: string;
  prize?: string;
  format?: string;
  entryFee?: string;
  day?: string;
  customFooterText?: string;
  customHeader?: React.ReactNode | ((hovered: boolean) => React.ReactNode);
  overlayHeight?: string;
  metadataPaddingLeft?: string | number;
  width?: number | string;
  height?: number | string;
  borderColor?: string;
  borderBgColor?: string;
  borderWidth?: number;
  borderPadding?: number;
  cardBgColor?: string;
  shadowColor?: string;
  patternColor1?: string;
  patternColor2?: string;
  textColor?: string;
  hoverTextColor?: string;
  fontFamily?: string;
  rtlFontFamily?: string;
  effectBgColor?: string;
  contentPadding?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  image,
  overlayImage,
  title,
  description,
  prize,
  format,
  entryFee,
  day,
  customFooterText,
  customHeader,
  overlayHeight,
  metadataPaddingLeft = 0,
  width = "100%",
  height = "100%",
  borderColor = "#DAFF3E",
  borderBgColor = "#242424",
  borderWidth = 3,
  borderPadding = 14,
  cardBgColor = "#000",
  shadowColor = "#242424",
  patternColor1 = "rgba(230,230,230,0.15)",
  patternColor2 = "rgba(240,240,240,0.15)",
  textColor = "#f5f5f5",
  hoverTextColor = "#242424",
  fontFamily = "'Roboto Mono', monospace",
  rtlFontFamily = "'Montserrat', sans-serif",
  effectBgColor = "#DAFF3E",
  contentPadding = "14px 16px",
}) => {
  const [hovered, setHovered] = useState(false);
  const borderRef = useRef<HTMLDivElement>(null);

  // Mouse movement for rotating border
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const border = borderRef.current;
    if (!border) return;
    const rect = border.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    border.style.setProperty("--rotation", `${angle}rad`);
  };

  // RTL logic
  const rtl = isRTL(title) || isRTL(description);
  const effectiveFont = rtl ? rtlFontFamily : fontFamily;
  const titleDirection = isRTL(title) ? "rtl" : "ltr";
  const descDirection = isRTL(description) ? "rtl" : "ltr";

  // Sizes for inner card relative to container
  const innerWidth = "100%";
  const innerHeight = "100%";

  // Pattern background
  const pattern =
    `linear-gradient(45deg, ${patternColor1} 25%, transparent 25%, transparent 75%, ${patternColor2} 75%),` +
    `linear-gradient(-45deg, ${patternColor2} 25%, transparent 25%, transparent 75%, ${patternColor1} 75%)`;

  // Border gradient
  const borderGradient = `conic-gradient(from var(--rotation,0deg), ${borderColor} 0deg, ${borderColor} 90deg, ${borderBgColor} 90deg, ${borderBgColor} 360deg)`;

  return (
    <div
      ref={borderRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (borderRef.current)
          borderRef.current.style.setProperty("--rotation", "0deg");
      }}
      style={{
        width,
        height,
        border: `${borderWidth}px solid transparent`,
        borderRadius: "1.5rem",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        backgroundImage: `linear-gradient(${cardBgColor}, ${cardBgColor}), ${borderGradient}`,
        padding: borderPadding,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        cursor: title === "Cultural Program" ? "default" : "pointer",
        userSelect: "none",
        transition: "box-shadow 0.3s",
        position: "relative",
        fontFamily: effectiveFont,
        flexGrow: 1,
      } as React.CSSProperties}
    >
      <div
        style={{
          width: innerWidth,
          height: innerHeight,
          borderRadius: "1rem",
          background: cardBgColor,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          backgroundImage: pattern,
          backgroundSize: "20.84px 20.84px",
          padding: "0 0 8px 0",
        }}
      >
        <div style={{ width: "100%", height: "200px", position: "relative", overflow: "hidden" }}>
          {customHeader ? (
            typeof customHeader === "function" ? (customHeader as Function)(hovered) : customHeader
          ) : (
            <>
              <img
                src={image}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: hovered ? "contrast(0.925)" : "contrast(0.825)",
                  transition: "filter 0.3s ease",
                }}
              />
              {overlayImage && (
                <img
                  src={overlayImage}
                  alt={`${title} overlay`}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "auto",
                    height: overlayHeight || "95%",
                    objectFit: "contain",
                    zIndex: 10,
                  }}
                />
              )}
            </>
          )}
        </div>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: contentPadding,
            minHeight: 0,
          }}
        >
          <h1
            style={{
              fontSize: 21,
              fontWeight: "bold",
              letterSpacing: "-.01em",
              lineHeight: "normal",
              marginBottom: 8,
              color: hovered ? hoverTextColor : textColor,
              transition: "color 0.3s ease",
              position: "relative",
              overflow: "hidden",
              direction: titleDirection,
              width: "auto",
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: 10,
                padding: "2px 4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {title}
            </span>
            <span
              style={{
                clipPath: hovered
                  ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                  : "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
                transformOrigin: "center",
                transition: "all cubic-bezier(.1,.5,.5,1) 0.4s",
                position: "absolute",
                left: -4,
                right: -4,
                top: -4,
                bottom: -4,
                zIndex: 0,
                backgroundColor: effectBgColor,
              }}
            />
          </h1>
          <p
            style={{
              fontSize: 14,
              color: textColor,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              direction: descDirection,
              marginBottom: 16,
              paddingBottom: 0,
              minHeight: 0,
              textAlign: "center",
            }}
          >
            {description}
          </p>

          {customFooterText ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginTop: "auto",
                paddingTop: "16px",
                borderTop: `1px solid rgba(255,255,255,0.05)`,
                width: "100%",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#fff",
                lineHeight: "1.4",
                fontFamily: "monospace",
              }}
            >
              {customFooterText}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
                marginTop: "auto",
                paddingTop: "16px",
                paddingLeft: metadataPaddingLeft,
                borderTop: `1px solid rgba(255,255,255,0.05)`,
                width: "100%",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 0px", minWidth: "0px", textAlign: "center" }}>
                <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: "4px", whiteSpace: "nowrap" }}>Prize</span>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: effectBgColor, textShadow: `0 0 10px ${effectBgColor}66`, lineHeight: "1.2" }}>{prize || "TBD"}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 0px", minWidth: "0px", textAlign: "center" }}>
                <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: "4px", whiteSpace: "nowrap" }}>Entry Fee</span>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#fff", lineHeight: "1.2" }}>{entryFee || "TBD"}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 0px", minWidth: "0px", textAlign: "center" }}>
                <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: "4px", whiteSpace: "nowrap" }}>Format</span>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#fff", lineHeight: "1.2" }}>{format || "TBD"}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 0px", minWidth: "0px", textAlign: "center" }}>
                <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: "4px", whiteSpace: "nowrap" }}>Day</span>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#fff", lineHeight: "1.2" }}>
                  {day ? day.replace(/\b([a-zA-Z]+)\s+(\d+)\b/g, "$1\u00a0$2") : "TBD"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
