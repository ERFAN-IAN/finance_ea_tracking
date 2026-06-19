export const hasDetail = (data: unknown): data is { detail: string } => {
  return typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    typeof data.detail === "string"
    ? true
    : false;
};
