import { memo } from "react";

interface LogoProps {
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg";
  darkBg?: boolean;
  className?: string;
}

const Logo = memo(({ variant = "full", size = "md", darkBg = false, className = "" }: LogoProps) => {
  const sizes = {
    sm: { icon: 32, text: 20, tagline: 8 },
    md: { icon: 48, text: 28, tagline: 10 },
    lg: { icon: 64, text: 36, tagline: 12 }
  };

  const currentSize = sizes[size];
  const goldColor = "#c9a96e";
  const textColor = darkBg ? "#f5f5f0" : "#1a1a1a";
  const taglineColor = darkBg ? "rgba(245, 245, 240, 0.7)" : "rgba(26, 26, 26, 0.6)";

  // CV Monogram Icon
  const CVIcon = () => (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* C letter - curved */}
      <path
        d="M30 25 C10 25, 10 75, 30 75 C40 75, 45 65, 45 55"
        stroke={goldColor}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* V letter */}
      <path
        d="M40 25 L55 75 L70 25"
        stroke={goldColor}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Decorative curl on C */}
      <path
        d="M30 25 C35 20, 45 20, 50 25"
        stroke={goldColor}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Circle accent */}
      <circle
        cx="70"
        cy="25"
        r="8"
        stroke={goldColor}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );

  // Text only
  const TextLogo = () => (
    <div className="flex flex-col">
      <span
        style={{
          fontSize: currentSize.text,
          fontWeight: 400,
          letterSpacing: "0.15em",
          color: textColor,
          fontFamily: "'Times New Roman', 'Georgia', serif"
        }}
      >
        CAREVILLE
      </span>
      {variant === "full" && (
        <span
          style={{
            fontSize: currentSize.tagline,
            fontWeight: 400,
            letterSpacing: "0.2em",
            color: taglineColor,
            marginTop: 2
          }}
        >
          A LIVING SPACE CARE COMPANY
        </span>
      )}
    </div>
  );

  if (variant === "icon") {
    return (
      <div className={className}>
        <CVIcon />
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={className}>
        <TextLogo />
      </div>
    );
  }

  // Full logo with icon and text
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CVIcon />
      <TextLogo />
    </div>
  );
});

Logo.displayName = "Logo";

export default Logo;
