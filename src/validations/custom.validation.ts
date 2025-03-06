export const objectId = (value: string): boolean => {
  if (!value) return false;
  return /^[0-9a-fA-F]{24}$/.test(value);
};

export const validateURL = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const validatePassword = (password: string): boolean => {
  if (!password) return false;
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(password);
};
