import { FC } from "react";
import { cn } from "@/shared/helpers";

interface DimensionInputsProps {
  /** Opening width in mm */
  openingWidth: number;
  /** Opening height in mm */
  openingHeight: number;
  /** Opening thickness in mm */
  openingThickness: number;
  /** Width change handler */
  onWidthChange: (value: number) => void;
  /** Height change handler */
  onHeightChange: (value: number) => void;
  /** Thickness change handler */
  onThicknessChange: (value: number) => void;
  /** Custom class name */
  className?: string;
}

// Standard dimension options
const WIDTH_OPTIONS = [600, 700, 800, 900, 1000, 1200];
const HEIGHT_OPTIONS = [2000, 2100, 2200, 2300, 2400];
const THICKNESS_OPTIONS = [75, 100, 125, 150, 175, 200];

/**
 * Dimension input dropdowns for door opening size
 */
export const DimensionInputs: FC<DimensionInputsProps> = ({
  openingWidth,
  openingHeight,
  openingThickness,
  onWidthChange,
  onHeightChange,
  onThicknessChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Width selector */}
      <DimensionSelect
        value={openingWidth}
        options={WIDTH_OPTIONS}
        onChange={onWidthChange}
        label="Ширина"
      />

      {/* Height selector */}
      <DimensionSelect
        value={openingHeight}
        options={HEIGHT_OPTIONS}
        onChange={onHeightChange}
        label="Высота"
      />

      {/* Thickness selector */}
      <DimensionSelect
        value={openingThickness}
        options={THICKNESS_OPTIONS}
        onChange={onThicknessChange}
        label="Толщина"
      />

      {/* Additional placeholders (matching the design with 6 dropdowns) */}
      <DimensionSelect
        value={0}
        options={[0]}
        onChange={() => {}}
        label=""
        disabled
      />

      <DimensionSelect
        value={0}
        options={[0]}
        onChange={() => {}}
        label=""
        disabled
      />

      <DimensionSelect
        value={0}
        options={[0]}
        onChange={() => {}}
        label=""
        disabled
      />
    </div>
  );
};

/**
 * Individual dimension select dropdown
 */
interface DimensionSelectProps {
  value: number;
  options: number[];
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

const DimensionSelect: FC<DimensionSelectProps> = ({
  value,
  options,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <span className="text-[10px] text-gray-400 leading-none">{label}</span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={cn(
          "w-14 h-8 px-1 text-sm border border-gray-300 rounded-md",
          "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
          "bg-white appearance-none cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 2px center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "16px",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "0"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DimensionInputs;
