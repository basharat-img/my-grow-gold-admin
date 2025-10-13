import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const FormikContext = createContext(null);

export const useFormikContext = () => {
  const context = useContext(FormikContext);
  if (!context) {
    throw new Error("useFormikContext must be used within a <Formik> component");
  }
  return context;
};

const buildErrorMap = (errorList = []) => {
  const map = {};
  errorList.forEach((error) => {
    if (error?.path && !map[error.path]) {
      map[error.path] = error.message;
    }
  });
  return map;
};

export const Formik = ({ initialValues, validationSchema, onSubmit, children }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const runValidation = useCallback(
    async (nextValues, markTouched = false) => {
      if (!validationSchema) {
        setErrors({});
        return {};
      }

      try {
        await validationSchema.validate(nextValues, { abortEarly: false });
        setErrors({});
        return {};
      } catch (error) {
        const errorList = error?.inner ?? [];
        const mapped = buildErrorMap(errorList);
        if (markTouched) {
          setTouched((prev) => ({
            ...prev,
            ...Object.keys(mapped).reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {}),
          }));
        }
        setErrors(mapped);
        return mapped;
      }
    },
    [validationSchema],
  );

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleBlur = useCallback(
    async (event) => {
      const { name } = event.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const nextValues = { ...values };
      await runValidation(nextValues);
    },
    [runValidation, values],
  );

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldTouched = useCallback((name, value = true) => {
    setTouched((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(
    (nextState = { values: initialValues }) => {
      setValues(nextState.values ?? initialValues);
      setErrors(nextState.errors ?? {});
      setTouched(nextState.touched ?? {});
      setStatus(nextState.status ?? null);
      setIsSubmitting(false);
    },
    [initialValues],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const validationErrors = await runValidation(values, true);
      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values, {
          setSubmitting: setIsSubmitting,
          setStatus,
          setErrors,
          resetForm,
          setFieldValue,
          setFieldTouched,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, resetForm, runValidation, setFieldTouched, setFieldValue, setStatus, values],
  );

  const contextValue = useMemo(
    () => ({
      values,
      errors,
      touched,
      isSubmitting,
      status,
      setStatus,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      resetForm,
    }),
    [errors, handleBlur, handleChange, handleSubmit, isSubmitting, resetForm, setFieldTouched, setFieldValue, status, touched, values],
  );

  return (
    <FormikContext.Provider value={contextValue}>
      {typeof children === "function" ? children(contextValue) : children}
    </FormikContext.Provider>
  );
};

export const Form = React.forwardRef(({ children, onSubmit, ...rest }, ref) => {
  const formik = useFormikContext();
  const submitHandler = onSubmit ?? formik.handleSubmit;

  return (
    <form ref={ref} onSubmit={submitHandler} {...rest}>
      {typeof children === "function" ? children(formik) : children}
    </form>
  );
});

Form.displayName = "FormikForm";

export const Field = ({ name, as: Component = "input", children, ...rest }) => {
  const formik = useFormikContext();
  const fieldProps = {
    name,
    value: formik.values[name] ?? "",
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    ...rest,
  };

  if (typeof Component === "string") {
    return React.createElement(Component, fieldProps, children);
  }

  return <Component {...fieldProps}>{children}</Component>;
};

export const ErrorMessage = ({ name, component: Component = "div" }) => {
  const formik = useFormikContext();
  const message = formik.errors[name];
  const show = formik.touched[name];

  if (!message || !show) {
    return null;
  }

  if (typeof Component === "string") {
    return React.createElement(Component, null, message);
  }

  return <Component>{message}</Component>;
};

export default Formik;
