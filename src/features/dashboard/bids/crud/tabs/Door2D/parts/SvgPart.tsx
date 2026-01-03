import { FC, useEffect, useState } from "react";

interface SvgPartProps {
  /** URL to the SVG file */
  svgUrl?: string;
  /** X position */
  x?: number;
  /** Y position */
  y?: number;
  /** Width to scale SVG to */
  width?: number;
  /** Height to scale SVG to */
  height?: number;
  /** Whether to show the part */
  visible?: boolean;
  /** Fallback content if SVG fails to load */
  fallback?: React.ReactNode;
  /** Callback when using fallback */
  onFallback?: (isFallback: boolean) => void;
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
 * Falls back to provided content if SVG is not available
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
        // Try to extract actual bounding box from path data
        const bbox = extractBoundingBox(svg);

        let viewBox: string;
        if (bbox) {
          // Use calculated bounding box
          const bboxWidth = bbox.maxX - bbox.minX;
          const bboxHeight = bbox.maxY - bbox.minY;
          viewBox = `${bbox.minX} ${bbox.minY} ${bboxWidth} ${bboxHeight}`;
        } else {
          // Fallback to original viewBox
          const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/i);
          viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 100 100";
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
  }, [svgUrl, onFallback]);

  if (!visible) return null;

  // Show fallback if error or no SVG URL
  if (error || !svgUrl) {
    return <g transform={`translate(${x}, ${y})`}>{fallback}</g>;
  }

  // Show nothing while loading
  if (!svgData) {
    return null;
  }

  // Use nested SVG to properly scale the content
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
