import { Rules } from "@/models/project/Rules";

export const validateField = async (
  value: string | number | Date | null,
  rules: Rules
): Promise<boolean> => {
  // Se è di tipo null, ma ha un valore minimo, allora ritorno false
  if (value === null && rules.min) return false;
  if (value === null && rules.minLength) return false;

  // Se è una string convalido la lunghezza e regex
  if (typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength) {
      return false;
    }
    if (rules.maxLength && value.length > rules.maxLength) return false;
    if (rules.regex && !new RegExp(rules.regex).test(value)) return false;
  }

  // Se è un numero convalido il minimo e massimo
  if (typeof value === "number") {
    if (rules.min && value < rules.min) return false;
    if (rules.max && value > rules.max) return false;
  }

  return true;
};
