import { RuleObject, StoreValue } from "rc-field-form/lib/interface";

/**
 * Ant Design validator for Uzbek phone numbers in formatted form: +998 XX XXX XX XX
 */
type Validator = (
  rule: RuleObject,
  value: StoreValue,
  callback: (error?: string) => void,
) => Promise<void | boolean | unknown> | void;

export const validatePhone: Validator = (
  rule: RuleObject,
  value: StoreValue,
  callback: (error?: string) => void,
) => {
  if (!value || typeof value !== "string") {
    callback();
    return;
  }

  const regex = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

  if (regex.test(value.replace(/\s+/g, " ").trim())) {
    return Promise.resolve();
  } else {
    return Promise.reject(
      "Введите корректный номер телефона в формате +998 XX XXX XX XX",
    );
  }
};
