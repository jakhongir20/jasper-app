import { FC } from "react";

interface WallProps {
  /** Total canvas width in pixels */
  canvasWidth: number;
  /** Total canvas height in pixels */
  canvasHeight: number;
  /** Door opening X position */
  doorX: number;
  /** Door opening Y position */
  doorY: number;
  /** Door opening width */
  doorWidth: number;
  /** Door opening height */
  doorHeight: number;
  /** Wall color */
  color?: string;
  /** Whether to show the wall */
  visible?: boolean;
  /** Wall pattern style */
  pattern?: "solid" | "subtle" | "brick";
}

/**
 * SVG Wall component - background wall with door opening cutout
 * Creates visual context for the door installation
 */
export const Wall: FC<WallProps> = ({
  canvasWidth,
  canvasHeight,
  doorX,
  doorY,
  doorWidth,
  doorHeight,
  color = "#F3F4F6",
  visible = true,
  pattern = "subtle",
}) => {
  if (!visible) return null;

  // Pattern ID for unique references
  const patternId = `wall-pattern-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <g>
      {/* Pattern definitions */}
      <defs>
        {pattern === "subtle" && (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={40}
            height={40}
          >
            {/* Diagonal subtle lines */}
            <path
              d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20"
              stroke="#00000005"
              strokeWidth={1}
            />
          </pattern>
        )}
        {pattern === "brick" && (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={60}
            height={30}
          >
            <rect width={60} height={30} fill={color} />
            <rect
              x={0}
              y={0}
              width={28}
              height={13}
              fill="none"
              stroke="#00000010"
              strokeWidth={1}
            />
            <rect
              x={30}
              y={0}
              width={28}
              height={13}
              fill="none"
              stroke="#00000010"
              strokeWidth={1}
            />
            <rect
              x={-15}
              y={15}
              width={28}
              height={13}
              fill="none"
              stroke="#00000010"
              strokeWidth={1}
            />
            <rect
              x={15}
              y={15}
              width={28}
              height={13}
              fill="none"
              stroke="#00000010"
              strokeWidth={1}
            />
            <rect
              x={45}
              y={15}
              width={28}
              height={13}
              fill="none"
              stroke="#00000010"
              strokeWidth={1}
            />
          </pattern>
        )}
      </defs>

      {/* Wall with door opening cutout using clip path */}
      <path
        d={`
          M 0 0
          L ${canvasWidth} 0
          L ${canvasWidth} ${canvasHeight}
          L 0 ${canvasHeight}
          Z
          M ${doorX} ${doorY}
          L ${doorX} ${doorY + doorHeight}
          L ${doorX + doorWidth} ${doorY + doorHeight}
          L ${doorX + doorWidth} ${doorY}
          Z
        `}
        fill={color}
        fillRule="evenodd"
      />

      {/* Pattern overlay */}
      {pattern !== "solid" && (
        <path
          d={`
            M 0 0
            L ${canvasWidth} 0
            L ${canvasWidth} ${canvasHeight}
            L 0 ${canvasHeight}
            Z
            M ${doorX} ${doorY}
            L ${doorX} ${doorY + doorHeight}
            L ${doorX + doorWidth} ${doorY + doorHeight}
            L ${doorX + doorWidth} ${doorY}
            Z
          `}
          fill={`url(#${patternId})`}
          fillRule="evenodd"
        />
      )}

      {/* Opening edge shadow/depth */}
      <rect
        x={doorX}
        y={doorY}
        width={doorWidth}
        height={doorHeight}
        fill="none"
        stroke="#00000020"
        strokeWidth={3}
      />

      {/* Inner edge highlight */}
      <rect
        x={doorX + 1}
        y={doorY + 1}
        width={doorWidth - 2}
        height={doorHeight - 2}
        fill="none"
        stroke="#FFFFFF30"
        strokeWidth={1}
      />
    </g>
  );
};

export default Wall;
