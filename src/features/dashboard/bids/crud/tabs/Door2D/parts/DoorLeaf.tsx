import { FC } from "react";

interface DoorLeafProps {
  /** Width of the door leaf in pixels */
  width: number;
  /** Height of the door leaf in pixels */
  height: number;
  /** Fill color */
  color?: string;
  /** Whether to show the door */
  visible?: boolean;
  /** X offset position */
  x?: number;
  /** Y offset position */
  y?: number;
  /** Door style variant */
  variant?: "solid" | "glass" | "panel";
  /** Number of panels (for panel variant) */
  panelCount?: number;
  /** Whether door has glass */
  hasGlass?: boolean;
  /** Glass color (if has glass) */
  glassColor?: string;
}

/**
 * SVG Door Leaf component - the actual door panel
 * Supports different styles: solid, glass, paneled
 */
export const DoorLeaf: FC<DoorLeafProps> = ({
  width,
  height,
  color = "currentColor",
  visible = true,
  x = 0,
  y = 0,
  variant = "solid",
  panelCount = 4,
  hasGlass = false,
  glassColor = "#E8F4FC",
}) => {
  if (!visible) return null;

  // Panel dimensions
  const panelPadding = 15;
  const panelGap = 10;
  const panelInnerWidth = width - panelPadding * 2;

  // Calculate panel layout (2 columns usually)
  const columns = 2;
  const rows = Math.ceil(panelCount / columns);
  const singlePanelWidth = (panelInnerWidth - panelGap * (columns - 1)) / columns;
  const panelAreaHeight = height - panelPadding * 2 - 120; // Reserve space for top/bottom
  const singlePanelHeight = (panelAreaHeight - panelGap * (rows - 1)) / rows;

  // Glass area (centered in door)
  const glassWidth = width * 0.3;
  const glassHeight = height * 0.25;
  const glassX = (width - glassWidth) / 2;
  const glassY = panelPadding + 30;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Main door body */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={color}
        stroke="#00000030"
        strokeWidth={1}
        rx={1}
      />

      {/* Door edge highlight (3D effect) */}
      <rect
        x={1}
        y={1}
        width={width - 2}
        height={height - 2}
        fill="none"
        stroke="#FFFFFF20"
        strokeWidth={1}
      />

      {/* Panel decorations based on variant */}
      {variant === "panel" && (
        <g>
          {Array.from({ length: panelCount }).map((_, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const px = panelPadding + col * (singlePanelWidth + panelGap);
            const py =
              panelPadding + 60 + row * (singlePanelHeight + panelGap);

            return (
              <g key={index}>
                {/* Panel recess */}
                <rect
                  x={px}
                  y={py}
                  width={singlePanelWidth}
                  height={singlePanelHeight}
                  fill="#00000015"
                  stroke="#00000020"
                  strokeWidth={1}
                  rx={2}
                />
                {/* Panel inner border */}
                <rect
                  x={px + 4}
                  y={py + 4}
                  width={singlePanelWidth - 8}
                  height={singlePanelHeight - 8}
                  fill="none"
                  stroke="#FFFFFF10"
                  strokeWidth={1}
                  rx={1}
                />
              </g>
            );
          })}
        </g>
      )}

      {/* Solid door - simple design with subtle details */}
      {variant === "solid" && (
        <g>
          {/* Central horizontal line */}
          <line
            x1={panelPadding}
            y1={height / 2}
            x2={width - panelPadding}
            y2={height / 2}
            stroke="#00000010"
            strokeWidth={2}
          />
          {/* Decorative border */}
          <rect
            x={panelPadding}
            y={panelPadding}
            width={width - panelPadding * 2}
            height={height - panelPadding * 2}
            fill="none"
            stroke="#00000010"
            strokeWidth={2}
            rx={2}
          />
        </g>
      )}

      {/* Glass insert */}
      {hasGlass && (
        <g>
          <rect
            x={glassX}
            y={glassY}
            width={glassWidth}
            height={glassHeight}
            fill={glassColor}
            stroke="#00000030"
            strokeWidth={1}
            rx={2}
          />
          {/* Glass grid pattern */}
          <line
            x1={glassX + glassWidth / 2}
            y1={glassY}
            x2={glassX + glassWidth / 2}
            y2={glassY + glassHeight}
            stroke="#00000020"
            strokeWidth={1}
          />
          <line
            x1={glassX}
            y1={glassY + glassHeight / 2}
            x2={glassX + glassWidth}
            y2={glassY + glassHeight / 2}
            stroke="#00000020"
            strokeWidth={1}
          />
          {/* Glass highlight */}
          <rect
            x={glassX + 3}
            y={glassY + 3}
            width={glassWidth / 3}
            height={glassHeight / 2}
            fill="#FFFFFF40"
            rx={1}
          />
        </g>
      )}

      {/* Glass door variant */}
      {variant === "glass" && !hasGlass && (
        <g>
          <rect
            x={panelPadding}
            y={panelPadding + 20}
            width={width - panelPadding * 2}
            height={height * 0.6}
            fill={glassColor}
            stroke="#00000030"
            strokeWidth={1}
            rx={2}
          />
          {/* Glass decorative frame */}
          <rect
            x={panelPadding + 5}
            y={panelPadding + 25}
            width={width - panelPadding * 2 - 10}
            height={height * 0.6 - 10}
            fill="none"
            stroke="#FFFFFF30"
            strokeWidth={1}
            rx={1}
          />
        </g>
      )}
    </g>
  );
};

export default DoorLeaf;
