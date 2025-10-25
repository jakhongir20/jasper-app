import { Button, Popover } from "antd";
import { NumberInput } from "@/shared/ui";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { formattedPrice } from "@/shared/helpers";

interface RangeSliderFilterProps {
  label?: string;
  min?: number;
  max?: number;
  value?: [number, number];
  onChange?: (min: number, max: number) => void;
  minQueryKey: string;
  maxQueryKey: string;
}

export const RangeFilter: React.FC<RangeSliderFilterProps> = ({
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

  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [inputMin, setInputMin] = useState(initialMin);
  const [inputMax, setInputMax] = useState(initialMax);

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

  useEffect(() => {
    if (value && Array.isArray(value) && value.length === 2) {
      setInputMin(value[0]);
      setInputMax(value[1]);
    } else {
      setInputMin(min);
      setInputMax(max);
    }
  }, [value, min, max]);

  useEffect(() => {
    if (paramMin !== null) {
      const qMin = getSafeNumber(paramMin, min);
      if (qMin !== inputMin) setInputMin(qMin);
    } else {
      if (inputMin !== min) setInputMin(min);
    }

    if (paramMax !== null) {
      const qMax = getSafeNumber(paramMax, max);
      if (qMax !== inputMax) setInputMax(qMax);
    } else {
      if (inputMax !== max) setInputMax(max);
    }
  }, [paramMin, paramMax, min, max]);

  const setParams = debounce((minValue: number, maxValue: number) => {
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
  }, 400);

  const handleApply = () => {
    setParams(inputMin, inputMax);
    setPopoverOpen(false);
  };

  const handleMinChange = (e: any) => {
    let v = Number(e?.value ?? e?.target?.value ?? e);
    if (isNaN(v)) v = 0;
    setInputMin(v);
  };

  const handleMaxChange = (e: any) => {
    let v = Number(e?.value ?? e?.target?.value ?? e);
    if (isNaN(v)) v = 0;
    setInputMax(v);
  };

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

  const hasParams =
    (paramMin !== null && getSafeNumber(paramMin, min) !== min) ||
    (paramMax !== null && getSafeNumber(paramMax, max) !== max);

  const popoverContent = (
    <div ref={popoverRef} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div>
          <p className={"mb-1 text-xs"}> {t("common.input.min")}</p>
          <NumberInput
            min={min}
            max={inputMax}
            value={inputMin}
            onChange={handleMinChange}
            style={{ width: "100px" }}
            formatter={(value: any) =>
              value !== undefined && value !== null && value !== ""
                ? Number(value).toLocaleString("ru-RU")
                : ""
            }
          />
        </div>
        <div>
          <p className={"mb-1 text-xs"}> {t("common.input.max")}</p>
          <NumberInput
            min={inputMin}
            max={max}
            value={inputMax}
            style={{ width: "100px" }}
            onChange={handleMaxChange}
            formatter={(value: any) =>
              value !== undefined && value !== null && value !== ""
                ? Number(value).toLocaleString("ru-RU")
                : ""
            }
          />
        </div>
      </div>
      <Button
        type="primary"
        onClick={handleApply}
        disabled={inputMin > inputMax}
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
          trigger={["click"]}
          placement="bottom"
        >
          <div
            className="relative flex w-full cursor-pointer items-center justify-between gap-2 py-1.5"
            onClick={() => setPopoverOpen(true)}
          >
            <span className="text-sm">
              {inputMin === min && inputMax === max
                ? t("common.input.placeholder.amounts")
                : `${formattedPrice(inputMin)} - ${
                    inputMax !== max ? formattedPrice(inputMax) : "∞"
                  }`}
            </span>

            {hasParams && (
              <CloseOutlined
                className="cursor-pointer text-gray-400 hover:text-violet"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear(e);
                }}
              />
            )}
          </div>
        </Popover>
      </div>
    </div>
  );
};
