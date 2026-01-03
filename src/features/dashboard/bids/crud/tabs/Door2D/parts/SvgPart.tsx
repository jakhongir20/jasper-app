import { FC, useEffect, useState } from "react";

interface SvgPartProps {
  /** URL to the SVG file */
  svgUrl?: string;
  /** X position (only used when useNativeViewBox is false) */
  x?: number;
  /** Y position (only used when useNativeViewBox is false) */
  y?: number;
  /** Width to scale SVG to (only used when useNativeViewBox is false) */
  width?: number;
  /** Height to scale SVG to (only used when useNativeViewBox is false) */
  height?: number;
  /** Whether to show the part */
  visible?: boolean;
  /** Fallback content if SVG fails to load */
  fallback?: React.ReactNode;
  /** Callback when using fallback */
  onFallback?: (isFallback: boolean) => void;
  /**
   * When true, renders SVG content directly using its native coordinates.
   * All parts should share the same coordinate system (e.g., from Figma).
   * When false (default), wraps content in nested SVG with position/size.
   */
  useNativeViewBox?: boolean;
}

interface SvgData {
  content: string;
  viewBox: string;
}

/**
 * Extract bounding box from SVG path data
 */
function extractBoundingBox(svg: string): { minX: number; minY: number; maxX: number; maxY: number } | null {
  // Find all coordinate pairs in path d attributes
  const pathMatches = svg.matchAll(/d="([^"]+)"/g);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let foundCoords = false;

  for (const match of pathMatches) {
    const pathData = match[1];
    // Extract all numbers that look like coordinates (pairs of numbers)
    const coordMatches = pathData.matchAll(/(\d+\.?\d*)\s*[,\s]\s*(\d+\.?\d*)/g);
    for (const coord of coordMatches) {
      const x = parseFloat(coord[1]);
      const y = parseFloat(coord[2]);
      if (!isNaN(x) && !isNaN(y) && x < 10000 && y < 10000) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        foundCoords = true;
      }
    }
  }

  if (!foundCoords) return null;

  // Add small padding
  const padding = 10;
  return {
    minX: Math.max(0, minX - padding),
    minY: Math.max(0, minY - padding),
    maxX: maxX + padding,
    maxY: maxY + padding,
  };
}

/**
 * Component that loads and renders an external SVG file
 *
 * Two rendering modes:
 * 1. useNativeViewBox=true: Renders SVG content directly with its original coordinates.
 *    Use this when all parts share a common coordinate system (e.g., all exported from
 *    the same Figma frame). Parts will naturally align based on their positions in the
 *    original design.
 *
 * 2. useNativeViewBox=false (default): Wraps content in a nested SVG with x/y/width/height.
 *    Use this for positioning parts independently.
 */
export const SvgPart: FC<SvgPartProps> = ({
  svgUrl,
  x = 0,
  y = 0,
  width,
  height,
  visible = true,
  fallback,
  onFallback,
  useNativeViewBox = false,
}) => {
  const [svgData, setSvgData] = useState<SvgData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!svgUrl) {
      setError(true);
      onFallback?.(true);
      return;
    }

    setError(false);
    setSvgData(null);

    fetch(svgUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load SVG");
        return res.text();
      })
      .then((svg) => {
        // Get original viewBox for reference
        const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/i);
        const originalViewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 2000 2000";

        let viewBox: string;
        if (useNativeViewBox) {
          // Keep original viewBox for native rendering
          viewBox = originalViewBox;
        } else {
          // Try to extract actual bounding box from path data for scaled rendering
          const bbox = extractBoundingBox(svg);
          if (bbox) {
            const bboxWidth = bbox.maxX - bbox.minX;
            const bboxHeight = bbox.maxY - bbox.minY;
            viewBox = `${bbox.minX} ${bbox.minY} ${bboxWidth} ${bboxHeight}`;
          } else {
            viewBox = originalViewBox;
          }
        }

        // Extract inner content
        const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        const content = innerMatch ? innerMatch[1] : svg;

        setSvgData({ content, viewBox });
        onFallback?.(false);
      })
      .catch(() => {
        setError(true);
        onFallback?.(true);
      });
  }, [svgUrl, onFallback, useNativeViewBox]);

  if (!visible) return null;

  // Show fallback if error or no SVG URL
  if (error || !svgUrl) {
    return <g transform={`translate(${x}, ${y})`}>{fallback}</g>;
  }

  // Show nothing while loading
  if (!svgData) {
    return null;
  }

  // Native mode: render content directly with its original coordinates
  // This allows multiple parts to align naturally in a shared coordinate space
  if (useNativeViewBox) {
    return <g dangerouslySetInnerHTML={{ __html: svgData.content }} />;
  }

  // Scaled mode: wrap in nested SVG with position and size
  return (
    <svg
      x={x}
      y={y}
      width={width || 100}
      height={height || 100}
      viewBox={svgData.viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      <g dangerouslySetInnerHTML={{ __html: svgData.content }} />
    </svg>
  );
};

export default SvgPart;
