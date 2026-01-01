import { FC } from "react";

interface FrameProps {
  /** Outer width of the frame in pixels */
  width: number;
  /** Outer height of the frame in pixels */
  height: number;
  /** Thickness of the frame profile in pixels */
  thickness: number;
  /** Fill color */
  color?: string;
  /** Whether to show the frame */
  visible?: boolean;
  /** X offset position */
  x?: number;
  /** Y offset position */
  y?: number;
  /** Frame variant style */
  variant?: "standard" | "decorative" | "minimal";
}

/**
 * SVG Frame component - the door frame/box
 * Renders as a rectangular frame with configurable thickness
 */
export const Frame: FC<FrameProps> = ({
  width,
  height,
  thickness,
  color = "currentColor",
  visible = true,
  x = 0,
  y = 0,
  variant = "standard",
}) => {
  if (!visible) return null;

  // Inner dimensions (hole in the frame)
  const innerWidth = width - thickness * 2;
  const innerHeight = height - thickness; // No bottom frame (threshold area)

  // For decorative variant, add inner decorative line
  const decorativeOffset = variant === "decorative" ? 5 : 0;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer frame rectangle */}
      <path
        d={`
          M 0 0
          L ${width} 0
          L ${width} ${height}
          L 0 ${height}
          Z
          M ${thickness} ${thickness}
          L ${thickness} ${height}
          L ${thickness + innerWidth} ${height}
          L ${thickness + innerWidth} ${thickness}
          Z
        `}
        fill={color}
        fillRule="evenodd"
        stroke="#00000020"
        strokeWidth={0.5}
      />

      {/* Decorative inner border for decorative variant */}
      {variant === "decorative" && (
        <rect
          x={decorativeOffset}
          y={decorativeOffset}
          width={width - decorativeOffset * 2}
          height={height - decorativeOffset * 2}
          fill="none"
          stroke="#00000015"
          strokeWidth={1}
          rx={2}
        />
      )}

      {/* Frame shadow/depth effect */}
      <rect
        x={thickness - 2}
        y={thickness - 2}
        width={innerWidth + 4}
        height={height - thickness + 4}
        fill="none"
        stroke="#00000010"
        strokeWidth={2}
      />
    </g>
  );
};

export default Frame;
