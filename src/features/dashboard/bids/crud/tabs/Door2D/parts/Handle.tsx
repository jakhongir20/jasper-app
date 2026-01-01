import { FC } from "react";

interface HandleProps {
  /** X position of the handle */
  x: number;
  /** Y position of the handle */
  y: number;
  /** Handle style variant */
  variant?: "lever" | "knob" | "handle";
  /** Fill color */
  color?: string;
  /** Whether to show the handle */
  visible?: boolean;
  /** Handle position (left/right side of door) */
  position?: "left" | "right";
  /** Scale factor */
  scale?: number;
}

/**
 * SVG Handle component - door handle/lock hardware
 * Supports different handle styles: lever, knob, push handle
 */
export const Handle: FC<HandleProps> = ({
  x,
  y,
  variant = "lever",
  color = "#D4AF37",
  visible = true,
  position = "right",
  scale = 1,
}) => {
  if (!visible) return null;

  // Mirror for left position
  const scaleX = position === "left" ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scaleX * scale}, ${scale})`}>
      {variant === "lever" && <LeverHandle color={color} />}
      {variant === "knob" && <KnobHandle color={color} />}
      {variant === "handle" && <PushHandle color={color} />}
    </g>
  );
};

/**
 * Lever-style door handle
 */
function LeverHandle({ color }: { color: string }): JSX.Element {
  return (
    <g>
      {/* Escutcheon plate (base) */}
      <ellipse
        cx={0}
        cy={0}
        rx={12}
        ry={18}
        fill={color}
        stroke="#00000030"
        strokeWidth={1}
      />
      {/* Keyhole */}
      <ellipse cx={0} cy={8} rx={3} ry={4} fill="#000000" opacity={0.5} />
      {/* Lever arm */}
      <rect
        x={-4}
        y={-6}
        width={35}
        height={8}
        rx={4}
        fill={color}
        stroke="#00000030"
        strokeWidth={1}
      />
      {/* Lever end knob */}
      <circle
        cx={30}
        cy={-2}
        r={6}
        fill={color}
        stroke="#00000030"
        strokeWidth={1}
      />
      {/* Highlight */}
      <ellipse
        cx={-2}
        cy={-8}
        rx={4}
        ry={3}
        fill="#FFFFFF40"
      />
    </g>
  );
}

/**
 * Round knob-style handle
 */
function KnobHandle({ color }: { color: string }): JSX.Element {
  return (
    <g>
      {/* Base plate */}
      <circle
        cx={0}
        cy={0}
        r={14}
        fill={color}
        stroke="#00000030"
        strokeWidth={1}
      />
      {/* Knob */}
      <circle
        cx={0}
        cy={0}
        r={10}
        fill={color}
        stroke="#00000020"
        strokeWidth={1}
      />
      {/* Inner ring */}
      <circle
        cx={0}
        cy={0}
        r={6}
        fill="none"
        stroke="#00000020"
        strokeWidth={1}
      />
      {/* Keyhole */}
      <ellipse cx={0} cy={0} rx={2} ry={3} fill="#000000" opacity={0.4} />
      {/* Highlight */}
      <ellipse
        cx={-3}
        cy={-3}
        rx={4}
        ry={3}
        fill="#FFFFFF40"
      />
    </g>
  );
}

/**
 * Push/pull handle bar
 */
function PushHandle({ color }: { color: string }): JSX.Element {
  return (
    <g>
      {/* Top mounting plate */}
      <rect
        x={-8}
        y={-40}
        width={16}
        height={12}
        rx={3}
        fill={color}
        stroke="#00000030"
        strokeWidth={1}
      />
      {/* Bottom mounting plate */}
      <rect
        x={-8}
        y={28}
        width={16}
        height={12}
        rx={3}
        fill={color}
        stroke="#00000030"
        strokeWidth={1}
      />
      {/* Handle bar */}
      <rect
        x={15}
        y={-35}
        width={8}
        height={70}
        rx={4}
        fill={color}
        stroke="#00000030"
        strokeWidth={1}
      />
      {/* Connecting arms */}
      <rect
        x={-4}
        y={-34}
        width={20}
        height={6}
        rx={2}
        fill={color}
        stroke="#00000020"
        strokeWidth={0.5}
      />
      <rect
        x={-4}
        y={28}
        width={20}
        height={6}
        rx={2}
        fill={color}
        stroke="#00000020"
        strokeWidth={0.5}
      />
      {/* Highlight */}
      <rect
        x={16}
        y={-30}
        width={3}
        height={40}
        rx={1}
        fill="#FFFFFF30"
      />
    </g>
  );
}

export default Handle;
