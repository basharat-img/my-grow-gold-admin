class ValidationError extends Error {
  constructor(errors) {
    const [firstError] = errors;
    super(firstError?.message ?? "Validation error");
    this.name = "ValidationError";
    this.inner = errors;
  }
}

class YupString {
  constructor() {
    this.tests = [];
  }

  required(message = "This field is required") {
    this.tests.push({
      name: "required",
      message,
      test: (value) => {
        if (value === undefined || value === null) {
          return false;
        }
        if (typeof value === "string") {
          return value.trim() !== "";
        }
        return String(value).trim() !== "";
      },
    });
    return this;
  }

  email(message = "Enter a valid email address") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.tests.push({
      name: "email",
      message,
      test: (value) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return emailRegex.test(String(value));
      },
    });
    return this;
  }

  async _validate(value, path, options = {}) {
    const { abortEarly = true } = options;
    const errors = [];
    for (const test of this.tests) {
      const result = await test.test(value);
      if (!result) {
        errors.push({ path, message: test.message });
        if (abortEarly) {
          break;
        }
      }
    }
    return errors;
  }
}

class YupObject {
  constructor(shape) {
    this.shape = shape ?? {};
  }

  async validate(values, options = {}) {
    const { abortEarly = true } = options;
    const candidate = values ?? {};
    const aggregatedErrors = [];

    for (const [path, schema] of Object.entries(this.shape)) {
      const fieldErrors = await schema._validate(candidate[path], path, { abortEarly });
      if (fieldErrors.length > 0) {
        aggregatedErrors.push(...fieldErrors);
        if (abortEarly) {
          break;
        }
      }
    }

    if (aggregatedErrors.length > 0) {
      throw new ValidationError(abortEarly ? [aggregatedErrors[0]] : aggregatedErrors);
    }

    return candidate;
  }
}

export const string = () => new YupString();
export const object = (shape) => new YupObject(shape);
export { ValidationError };

export default {
  string,
  object,
  ValidationError,
};
