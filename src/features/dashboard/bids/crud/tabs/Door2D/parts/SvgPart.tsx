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
  originalWidth: number;
  originalHeight: number;
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
        // Extract viewBox and dimensions from SVG
        const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/i);
        const widthMatch = svg.match(/width=["'](\d+)["']/i);
        const heightMatch = svg.match(/height=["'](\d+)["']/i);

        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 100 100";
        const originalWidth = widthMatch ? parseInt(widthMatch[1]) : 100;
        const originalHeight = heightMatch ? parseInt(heightMatch[1]) : 100;

        // Extract inner content
        const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        const content = innerMatch ? innerMatch[1] : svg;

        setSvgData({ content, viewBox, originalWidth, originalHeight });
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
  // Use "none" to stretch SVG to fill the entire width/height
  return (
    <svg
      x={x}
      y={y}
      width={width || svgData.originalWidth}
      height={height || svgData.originalHeight}
      viewBox={svgData.viewBox}
      preserveAspectRatio="none"
    >
      <g dangerouslySetInnerHTML={{ __html: svgData.content }} />
    </svg>
  );
};

export default SvgPart;
