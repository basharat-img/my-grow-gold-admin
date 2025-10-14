export const cn = (...classes) =>
  classes
    .flatMap((value) => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value.filter(Boolean);
      }
      if (typeof value === "string") {
        return value.split(" ").filter(Boolean);
      }
      if (typeof value === "object") {
        return Object.entries(value)
          .filter(([, condition]) => Boolean(condition))
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(" ");

export default cn;
