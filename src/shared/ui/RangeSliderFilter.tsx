import { Button, Popover, Slider } from "antd";
import { NumberInput } from "@/shared/ui";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface RangeSliderFilterProps {
  label?: string;
  min: number;
  max: number;
  value?: [number, number];
  onChange?: (min: number, max: number) => void;
  minQueryKey: string;
  maxQueryKey: string;
}

export const RangeSliderFilter: React.FC<RangeSliderFilterProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  minQueryKey,
  maxQueryKey,
}) => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const getSafeNumber = (val: any, fallback: number) => {
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  // Only use query params if they exist, otherwise undefined
  const paramMin = searchParams.get(minQueryKey);
  const paramMax = searchParams.get(maxQueryKey);

  const initialMin =
    value?.[0] !== undefined
      ? value[0]
      : paramMin !== null
        ? getSafeNumber(paramMin, min)
        : min;
  const initialMax =
    value?.[1] !== undefined
      ? value[1]
      : paramMax !== null
        ? getSafeNumber(paramMax, max)
        : max;

  const [inputMin, setInputMin] = useState(initialMin);
  const [inputMax, setInputMax] = useState(initialMax);

  // Popover state
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    if (!popoverOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popoverOpen]);

  const [modalMin, setModalMin] = useState(inputMin);
  const [modalMax, setModalMax] = useState(inputMax);

  // Double click detection
  const lastClickRef = useRef<number>(0);

  // Sync with value prop
  useEffect(() => {
    if (value && Array.isArray(value) && value.length === 2) {
      setInputMin(value[0]);
      setInputMax(value[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.[0], value?.[1]]);

  // Sync with query params if they change externally
  useEffect(() => {
    if (paramMin !== null) {
      const qMin = getSafeNumber(paramMin, inputMin);
      if (qMin !== inputMin) setInputMin(qMin);
    }
    if (paramMax !== null) {
      const qMax = getSafeNumber(paramMax, inputMax);
      if (qMax !== inputMax) setInputMax(qMax);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramMin, paramMax]);

  // Sync popover modalMin/modalMax with slider when popover opens or slider changes
  useEffect(() => {
    if (popoverOpen) {
      setModalMin(inputMin);
      setModalMax(inputMax);
    }
  }, [popoverOpen, inputMin, inputMax]);

  // Only set params if user has interacted (not on mount/default)
  const setParams = useMemo(
    () =>
      debounce((minValue: number, maxValue: number) => {
        // Only set if not default
        const params = { ...Object.fromEntries(searchParams) };
        let changed = false;
        if (minValue !== min) {
          params[minQueryKey] = minValue.toString();
          changed = true;
        } else {
          delete params[minQueryKey];
        }
        if (maxValue !== max) {
          params[maxQueryKey] = maxValue.toString();
          changed = true;
        } else {
          delete params[maxQueryKey];
        }
        if (changed) setSearchParams(params);
        onChange?.(minValue, maxValue);
      }, 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setSearchParams, minQueryKey, maxQueryKey, min, max],
  );

  // Track slider dragging state
  const [isSliding, setIsSliding] = useState(false);
  const sliderValueRef = useRef<[number, number]>([inputMin, inputMax]);

  const handleSliderChange = (val: [number, number]) => {
    setInputMin(val[0]);
    setInputMax(val[1]);
    sliderValueRef.current = val;
    // Don't set params here, wait for afterChange
  };

  const handleSliderAfterChange = (val: [number, number]) => {
    setParams(val[0], val[1]);
  };

  // Double click handler for slider
  const handleSliderClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 400) {
      setModalMin(inputMin);
      setModalMax(inputMax);
      setPopoverOpen(true);
    }
    lastClickRef.current = now;
  };

  // Apply popover values to slider and state
  const handleApply = () => {
    setInputMin(modalMin);
    setInputMax(modalMax);
    setParams(modalMin, modalMax);
    setPopoverOpen(false);
  };

  // Handlers for popover inputs
  const handleModalMinChange = (e: any) => {
    let v =
      typeof e === "object" && e !== null && "value" in e
        ? Number(e.value)
        : Number(e?.target?.value ?? e);
    if (isNaN(v)) v = 0;
    setModalMin(v);
    // Only update min, don't auto-update max
  };

  const handleModalMaxChange = (e: any) => {
    let v =
      typeof e === "object" && e !== null && "value" in e
        ? Number(e.value)
        : Number(e?.target?.value ?? e);
    if (isNaN(v)) v = 0;
    setModalMax(v);
    // Only update max, don't auto-update min
  };

  // Show clear icon only if params are set and not default
  const hasParams =
    (paramMin !== null && getSafeNumber(paramMin, min) !== min) ||
    (paramMax !== null && getSafeNumber(paramMax, max) !== max);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputMin(min);
    setInputMax(max);
    setParams(min, max);
    setSearchParams((prev) => {
      const params = { ...Object.fromEntries(prev) };
      delete params[minQueryKey];
      delete params[maxQueryKey];
      return params;
    });
  };

  useEffect(() => {
    if (paramMin === null && paramMax === null) {
      setInputMin(min);
      setInputMax(max);
    }
  }, [paramMin, paramMax, min, max]);

  const popoverContent = (
    <div ref={popoverRef} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <NumberInput
          min={min}
          max={modalMax}
          value={modalMin}
          onChange={handleModalMinChange}
          style={{ width: 100 }}
          placeholder="Min"
          formatter={(value: any) =>
            value !== undefined && value !== null && value !== ""
              ? Number(value).toLocaleString("ru-RU")
              : ""
          }
        />
        <NumberInput
          min={modalMin}
          max={max}
          value={modalMax}
          onChange={handleModalMaxChange}
          style={{ width: 100 }}
          placeholder="Max"
          formatter={(value: any) =>
            value !== undefined && value !== null && value !== ""
              ? Number(value).toLocaleString("ru-RU")
              : ""
          }
        />
      </div>
      <Button
        type="primary"
        onClick={handleApply}
        disabled={modalMin > modalMax}
        block
      >
        {t("common.button.apply")}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-dark text-xs font-normal">{label}</span>}
      <div className="rounded-lg bg-gray-800 px-2">
        <Popover
          content={popoverContent}
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          trigger={[]}
          placement="bottom"
        >
          <div
            className="relative flex w-full items-center gap-1"
            onClick={handleSliderClick}
          >
            <Slider
              range
              max={max}
              min={min}
              value={[inputMin, inputMax]}
              onChange={handleSliderChange}
              onAfterChange={handleSliderAfterChange}
              style={{ flex: 1 }}
            />
            {hasParams && (
              <CloseOutlined
                className="cursor-pointer rounded-full text-xs text-gray-400 transition-all duration-300 hover:rotate-90 hover:text-red"
                onClick={handleClear}
              />
            )}
          </div>
        </Popover>
      </div>
    </div>
  );
};
