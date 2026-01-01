import { FC } from "react";

interface CrownProps {
  /** Width of the crown in pixels */
  width: number;
  /** Height of the crown in pixels */
  height: number;
  /** Fill color */
  color?: string;
  /** Whether to show the crown */
  visible?: boolean;
  /** X offset position */
  x?: number;
  /** Y offset position */
  y?: number;
  /** Crown style variant */
  variant?: "classic" | "modern" | "ornate";
}

/**
 * SVG Crown component - decorative top element above door frame
 * Different variants have different ornamental styles
 */
export const Crown: FC<CrownProps> = ({
  width,
  height,
  color = "currentColor",
  visible = true,
  x = 0,
  y = 0,
  variant = "classic",
}) => {
  if (!visible || height <= 0) return null;

  // Crown extends slightly beyond frame on each side
  const overhang = 10;
  const totalWidth = width + overhang * 2;

  // Calculate profile points based on variant
  const renderCrown = () => {
    switch (variant) {
      case "classic":
        return renderClassicCrown(totalWidth, height, overhang);
      case "modern":
        return renderModernCrown(totalWidth, height, overhang);
      case "ornate":
        return renderOrnateCrown(totalWidth, height, overhang);
      default:
        return renderClassicCrown(totalWidth, height, overhang);
    }
  };

  return (
    <g transform={`translate(${x - overhang}, ${y})`}>
      {/* Main crown shape */}
      <g fill={color} stroke="#00000020" strokeWidth={0.5}>
        {renderCrown()}
      </g>

      {/* Bottom shadow line */}
      <line
        x1={0}
        y1={height}
        x2={totalWidth}
        y2={height}
        stroke="#00000030"
        strokeWidth={1}
      />
    </g>
  );
};

/**
 * Classic crown with curved top profile
 */
function renderClassicCrown(
  width: number,
  height: number,
  overhang: number,
): JSX.Element {
  // Multi-tiered crown profile
  const tier1Height = height * 0.3;
  const tier2Height = height * 0.4;
  const tier3Height = height * 0.3;

  const curveDepth = 8;

  return (
    <>
      {/* Top decorative molding with curve */}
      <path
        d={`
          M 0 ${height}
          L 0 ${tier2Height + tier3Height}
          L ${width} ${tier2Height + tier3Height}
          L ${width} ${height}
          Z
        `}
      />
      {/* Middle tier */}
      <path
        d={`
          M ${overhang / 2} ${tier2Height + tier3Height}
          L ${overhang / 2} ${tier3Height}
          Q ${width / 2} ${tier3Height - curveDepth} ${width - overhang / 2} ${tier3Height}
          L ${width - overhang / 2} ${tier2Height + tier3Height}
          Z
        `}
      />
      {/* Top cap with slight curve */}
      <path
        d={`
          M ${overhang} ${tier3Height}
          Q ${width / 2} ${-curveDepth / 2} ${width - overhang} ${tier3Height}
          L ${width - overhang} 0
          Q ${width / 2} ${curveDepth} ${overhang} 0
          Z
        `}
      />
      {/* Decorative center ornament */}
      <circle cx={width / 2} cy={tier3Height / 2} r={4} fill="#FFFFFF20" />
    </>
  );
}

/**
 * Modern crown with clean lines
 */
function renderModernCrown(
  width: number,
  height: number,
  overhang: number,
): JSX.Element {
  return (
    <>
      {/* Simple rectangular molding */}
      <rect x={0} y={height * 0.6} width={width} height={height * 0.4} />
      {/* Top bar */}
      <rect
        x={overhang / 2}
        y={height * 0.2}
        width={width - overhang}
        height={height * 0.4}
      />
      {/* Top cap */}
      <rect
        x={overhang}
        y={0}
        width={width - overhang * 2}
        height={height * 0.2}
      />
      {/* Accent line */}
      <line
        x1={overhang}
        y1={height * 0.3}
        x2={width - overhang}
        y2={height * 0.3}
        stroke="#FFFFFF20"
        strokeWidth={2}
      />
    </>
  );
}

/**
 * Ornate crown with decorative elements
 */
function renderOrnateCrown(
  width: number,
  height: number,
  overhang: number,
): JSX.Element {
  const centerX = width / 2;

  return (
    <>
      {/* Base molding */}
      <rect x={0} y={height * 0.7} width={width} height={height * 0.3} />

      {/* Scalloped middle section */}
      <path
        d={`
          M ${overhang / 2} ${height * 0.7}
          L ${overhang / 2} ${height * 0.35}
          Q ${width * 0.25} ${height * 0.3} ${centerX} ${height * 0.35}
          Q ${width * 0.75} ${height * 0.3} ${width - overhang / 2} ${height * 0.35}
          L ${width - overhang / 2} ${height * 0.7}
          Z
        `}
      />

      {/* Top ornamental piece */}
      <path
        d={`
          M ${overhang} ${height * 0.35}
          Q ${overhang} ${height * 0.1} ${centerX - 20} ${height * 0.1}
          L ${centerX - 10} 0
          L ${centerX + 10} 0
          L ${centerX + 20} ${height * 0.1}
          Q ${width - overhang} ${height * 0.1} ${width - overhang} ${height * 0.35}
          Z
        `}
      />

      {/* Central decorative element */}
      <ellipse
        cx={centerX}
        cy={height * 0.15}
        rx={8}
        ry={6}
        fill="#FFFFFF15"
      />

      {/* Side scrolls */}
      <circle
        cx={overhang + 15}
        cy={height * 0.5}
        r={5}
        fill="#FFFFFF10"
      />
      <circle
        cx={width - overhang - 15}
        cy={height * 0.5}
        r={5}
        fill="#FFFFFF10"
      />
    </>
  );
}

export default Crown;
