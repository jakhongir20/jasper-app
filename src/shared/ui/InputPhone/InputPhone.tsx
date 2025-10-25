import { FC } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/shared/helpers";

type Props = {
  placeholder?: string;
  labelClassName?: string;
  type?: string;
  inputClassName?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  label?: string;
  name?: string;
  value?: string; // Add value to control form state
  onChange?: (value: string) => void; // Add onChange for updating form state
};

export const InputPhone: FC<Props> = ({
  name = "input", // Default name
  inputClassName,
  label,
  labelClassName,
  value, // Use the value prop for controlled input
  onChange, // Use the onChange prop for updating the form
  ...rest
}) => {
  const cleanPhoneNumber = (phone: string) => {
    const cleanedPhone = phone.replace(/[^\d+ ]/g, ""); // Keep only digits, '+' and spaces
    return cleanedPhone.slice(0, 17); // Enforce maximum length
  };

  const handlePhoneChange = (phone: string) => {
    const cleanedPhone = cleanPhoneNumber(phone);

    if (onChange) {
      onChange(cleanedPhone); // Call the onChange prop to update the form state
    }
  };

  return (
    <div className="w-full">
      {label && <h2 className={cn("label", labelClassName)}>{label}</h2>}

      <div
        className={cn(
          "transition-300 h-10 w-full gap-3 rounded-lg bg-gray-600 focus-within:border-gray-700 hover:border-black [&_.react-international-phone-country-selector-button]:!h-10 [&_.react-international-phone-country-selector-button]:!border-none [&_.react-international-phone-country-selector-button]:!bg-transparent [&_.react-international-phone-country-selector-button]:!pl-2 [&_.react-international-phone-country-selector-button]:!pr-0 [&_.react-international-phone-input-container]:!rounded-lg [&_.react-international-phone-input-container]:!transition-all [&_.react-international-phone-input-container]:!duration-200 [&_.react-international-phone-input-container]:hover:bg-black-200 [&_.react-international-phone-input]:!h-10 [&_.react-international-phone-input]:w-full [&_.react-international-phone-input]:!border-none [&_.react-international-phone-input]:!bg-transparent [&_.react-international-phone-input]:!text-sm [&_.react-international-phone-input]:!font-medium [&_.react-international-phone-input]:!text-black",
          inputClassName,
        )}
      >
        <PhoneInput
          name={name}
          value={value || ""}
          onChange={handlePhoneChange}
          defaultCountry="uz"
          {...rest}
        />
      </div>
    </div>
  );
};
