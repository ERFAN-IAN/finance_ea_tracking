import { Path, UseFormSetError } from "react-hook-form";

type formError = {
  readonly success: false;
  readonly fieldErrors: Record<string, string[]> | undefined;
  readonly formError: string | undefined;
};

export const parseFormError = (data: unknown): formError => {
  const fieldErrors: Record<string, string[]> = {};
  let formError: string | undefined;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
        if (key === "non_field_errors") {
          formError = value.join(" ");
        } else {
          fieldErrors[key] = value;
        }
      } else if (key === "detail" && typeof value === "string") {
        formError = value;
      }
    }
  }

  return {
    success: false,
    fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
    formError,
  } as const;
};

export const setFormError = <T extends object>(
  res: formError,
  setError: UseFormSetError<T>,
) => {
  if (res.fieldErrors) {
    for (const [field, message] of Object.entries(res.fieldErrors)) {
      setError(field as Path<T>, {
        message: message[0],
      });
    }
  }
  if (res.formError) {
    setError("root", {
      message: res.formError,
    });
  }
};
