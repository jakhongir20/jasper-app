import { FC } from "react";
import { cn } from "@/shared/helpers";

interface PartThumbnailProps {
  /** Part type for rendering appropriate SVG */
  type: "frame" | "crown" | "door" | "lock" | "fullHeight";
  /** Variant data */
  variant: {
    id: number;
    name: string;
    type?: string;
    svgUrl?: string;
  };
  /** Whether this thumbnail is selected */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Display color */
  color?: string;
  /** Custom class name */
  className?: string;
}

/**
 * Thumbnail component for part selection
 * Displays a mini preview of the door part variant
 */
export const PartThumbnail: FC<PartThumbnailProps> = ({
  type,
  variant,
  selected = false,
  onClick,
  color = "#D4A574",
  className,
}) => {
  // If variant has svgUrl, use it as thumbnail
  const hasSvgUrl = variant.svgUrl && variant.id !== 0;

  const renderThumbnail = () => {
    // Use SVG file if available
    if (hasSvgUrl) {
      return (
        <img
          src={variant.svgUrl}
          alt={variant.name}
          className="h-full w-full object-contain"
        />
      );
    }

    // Fallback to programmatic thumbnails
    switch (type) {
      case "frame":
        return <FrameThumbnail variant={variant} color={color} />;
      case "crown":
        return <CrownThumbnail variant={variant} color={color} />;
      case "door":
        return <DoorThumbnail variant={variant} color={color} />;
      case "lock":
        return <LockThumbnail variant={variant} color={color} />;
      case "fullHeight":
        return <FullHeightThumbnail variant={variant} color={color} />;
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 p-2 transition-all duration-200",
        "cursor-pointer hover:border-blue-400 hover:shadow-md",
        "min-h-[80px] min-w-[70px]",
        selected
          ? "border-[#1C7488] bg-blue-50 shadow-sm"
          : "border-[rgba(5,5,5,0.06)] bg-white",
        className,
      )}
    >
      <div className="flex h-14 w-12 items-center justify-center">
        {renderThumbnail()}
      </div>
    </button>
  );
};

/**
 * Frame thumbnail SVG
 */
function FrameThumbnail({
  variant,
  color,
}: {
  variant: { type?: string };
  color: string;
}) {
  const thickness =
    variant.type === "minimal" ? 3 : variant.type === "decorative" ? 6 : 4;

  return (
    <svg viewBox="0 0 40 60" className="h-full w-full">
      {/* Frame outline */}
      <path
        d={`
          M 0 0 L 40 0 L 40 60 L 0 60 Z
          M ${thickness} ${thickness} L ${thickness} 60 L ${40 - thickness} 60 L ${40 - thickness} ${thickness} Z
        `}
        fill={color}
        fillRule="evenodd"
        stroke="#00000020"
        strokeWidth={0.5}
      />
      {variant.type === "decorative" && (
        <rect
          x={2}
          y={2}
          width={36}
          height={56}
          fill="none"
          stroke="#00000010"
          strokeWidth={1}
          rx={1}
        />
      )}
    </svg>
  );
}

/**
 * Crown thumbnail SVG
 */
function CrownThumbnail({
  variant,
  color,
}: {
  variant: { type?: string };
  color: string;
}) {
  const renderByType = () => {
    switch (variant.type) {
      case "modern":
        return (
          <>
            <rect x={0} y={10} width={40} height={5} fill={color} />
            <rect x={2} y={5} width={36} height={5} fill={color} />
            <rect x={5} y={0} width={30} height={5} fill={color} />
          </>
        );
      case "ornate":
        return (
          <>
            <rect x={0} y={10} width={40} height={5} fill={color} />
            <path d={`M 3 10 Q 20 2 37 10 L 37 5 Q 20 -2 3 5 Z`} fill={color} />
            <ellipse cx={20} cy={4} rx={4} ry={2} fill="#FFFFFF30" />
          </>
        );
      default:
        // Classic
        return (
          <>
            <rect x={0} y={10} width={40} height={5} fill={color} />
            <path d={`M 2 10 L 2 5 Q 20 3 38 5 L 38 10 Z`} fill={color} />
            <rect x={5} y={2} width={30} height={3} fill={color} rx={1} />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 40 15" className="h-6 w-full">
      <g stroke="#00000020" strokeWidth={0.5}>
        {renderByType()}
      </g>
    </svg>
  );
}

/**
 * Door thumbnail SVG
 */
function DoorThumbnail({
  variant,
  color,
}: {
  variant: { type?: string };
  color: string;
}) {
  const hasGlass = variant.type === "glass";
  const isPaneled = variant.type === "panel";

  return (
    <svg viewBox="0 0 30 50" className="h-full w-full">
      {/* Door body */}
      <rect
        x={0}
        y={0}
        width={30}
        height={50}
        fill={color}
        stroke="#00000030"
        strokeWidth={0.5}
        rx={1}
      />

      {/* Panels for panel variant */}
      {isPaneled && (
        <>
          <rect x={4} y={6} width={9} height={12} fill="#00000015" rx={1} />
          <rect x={17} y={6} width={9} height={12} fill="#00000015" rx={1} />
          <rect x={4} y={22} width={9} height={12} fill="#00000015" rx={1} />
          <rect x={17} y={22} width={9} height={12} fill="#00000015" rx={1} />
        </>
      )}

      {/* Glass insert */}
      {hasGlass && (
        <rect
          x={8}
          y={6}
          width={14}
          height={18}
          fill="#E8F4FC"
          stroke="#00000020"
          strokeWidth={0.5}
          rx={1}
        />
      )}

      {/* Handle dot */}
      <circle cx={24} cy={28} r={2} fill="#D4AF37" />
    </svg>
  );
}

/**
 * Lock/handle thumbnail SVG
 */
function LockThumbnail({
  variant,
  color,
}: {
  variant: { type?: string };
  color: string;
}) {
  const renderByType = () => {
    switch (variant.type) {
      case "knob":
        return (
          <>
            <circle cx={20} cy={20} r={10} fill={color} stroke="#00000020" />
            <circle cx={20} cy={20} r={6} fill={color} stroke="#00000010" />
            <ellipse cx={20} cy={20} rx={2} ry={3} fill="#00000030" />
          </>
        );
      case "handle":
        return (
          <>
            <rect x={12} y={5} width={6} height={8} rx={2} fill={color} />
            <rect x={12} y={27} width={6} height={8} rx={2} fill={color} />
            <rect x={22} y={8} width={4} height={24} rx={2} fill={color} />
            <rect x={16} y={10} width={8} height={3} rx={1} fill={color} />
            <rect x={16} y={27} width={8} height={3} rx={1} fill={color} />
          </>
        );
      default:
        // Lever
        return (
          <>
            <ellipse
              cx={15}
              cy={20}
              rx={6}
              ry={10}
              fill={color}
              stroke="#00000020"
            />
            <rect x={13} y={16} width={18} height={5} rx={2} fill={color} />
            <circle cx={30} cy={18.5} r={3} fill={color} />
            <ellipse cx={15} cy={26} rx={2} ry={3} fill="#00000030" />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      {renderByType()}
    </svg>
  );
}

/**
 * Full height option thumbnail
 */
function FullHeightThumbnail({
  variant,
  color,
}: {
  variant: { id: number };
  color: string;
}) {
  const isFullHeight = variant.id === 2;

  return (
    <svg viewBox="0 0 40 60" className="h-full w-full">
      {/* Wall indication */}
      <rect x={0} y={0} width={40} height={60} fill="#F3F4F6" />

      {/* Door frame */}
      <rect
        x={8}
        y={isFullHeight ? 0 : 10}
        width={24}
        height={isFullHeight ? 60 : 50}
        fill={color}
        stroke="#00000020"
      />

      {/* Door opening */}
      <rect
        x={11}
        y={isFullHeight ? 3 : 13}
        width={18}
        height={isFullHeight ? 57 : 47}
        fill="#FFFFFF"
      />

      {/* Height indicator arrows */}
      <line
        x1={4}
        y1={isFullHeight ? 5 : 15}
        x2={4}
        y2={55}
        stroke="#6B7280"
        strokeWidth={1}
        markerStart="url(#arrowUp)"
        markerEnd="url(#arrowDown)"
      />

      <defs>
        <marker
          id="arrowUp"
          markerWidth={4}
          markerHeight={4}
          refX={2}
          refY={2}
          orient="auto"
        >
          <path d="M0,4 L2,0 L4,4" fill="#6B7280" />
        </marker>
        <marker
          id="arrowDown"
          markerWidth={4}
          markerHeight={4}
          refX={2}
          refY={2}
          orient="auto"
        >
          <path d="M0,0 L2,4 L4,0" fill="#6B7280" />
        </marker>
      </defs>
    </svg>
  );
}

export default PartThumbnail;
