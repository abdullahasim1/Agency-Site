"use client";

import { useId, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { budgetRanges, projectTypes } from "@/data/contact";
import { contactCopy } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

const copy = contactCopy.form;

type FieldName =
  | "fullName"
  | "email"
  | "company"
  | "phone"
  | "projectType"
  | "budget"
  | "message";

type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const initialValues: FormValues = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  projectType: "",
  budget: "",
  message: "",
};

/** Deliberately permissive: rejecting a valid address is worse than accepting a bad one. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = copy.errors.fullName;
  }

  if (values.email.trim() === "") {
    errors.email = copy.errors.emailMissing;
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = copy.errors.emailInvalid;
  }

  if (values.phone.trim() !== "" && values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = copy.errors.phone;
  }

  if (values.projectType === "") {
    errors.projectType = copy.errors.projectType;
  }

  if (values.message.trim().length < 20) {
    errors.message = copy.errors.message;
  }

  return errors;
}

/* text-base below sm is deliberate: mobile Safari zooms the page on focus when a
   control's font-size is under 16px, which leaves the viewport scrolled sideways
   after the field blurs. 15px returns from sm upwards, where no browser zooms. */
const controlBase =
  "block w-full rounded-[0.75rem] border bg-white px-4 py-3 text-base text-ink-900 sm:text-[0.9375rem] " +
  "transition-[border-color,box-shadow] duration-200 placeholder:text-ink-400 " +
  "hover:border-ink-300 focus-visible:border-brand-400 focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-ink-25";

/**
 * Contact form.
 *
 * Validates in the browser, then POSTs JSON to /api/contact. That route is an
 * integration point — it currently validates and logs, so a CRM, inbox or
 * webhook can be wired in without this component changing.
 */
export function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const isSubmitting = status === "submitting";
  const fieldId = (name: FieldName) => `${uid}-${name}`;
  const errorId = (name: FieldName) => `${uid}-${name}-error`;

  function update(name: FieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function controlProps(name: FieldName) {
    return {
      id: fieldId(name),
      name,
      value: values[name],
      disabled: isSubmitting,
      "aria-invalid": errors[name] ? (true as const) : undefined,
      "aria-describedby": errors[name] ? errorId(name) : undefined,
      className: cn(
        controlBase,
        errors[name] ? "border-red-400" : "border-ink-200",
      ),
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(nextErrors) as FieldName[])[0];
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setStatus("success");
      setValues(initialValues);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-panel border border-brand-100 bg-brand-50/60 p-8 text-center sm:p-10"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-brand-600 ring-1 ring-brand-100">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h3 className="type-h3 mt-5">{copy.success.heading}</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
          {copy.success.description}
        </p>
        <div className="mt-7 flex justify-center">
          <Button variant="secondary" size="md" onClick={() => setStatus("idle")}>
            {copy.success.resetLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={`${uid}-form-heading`}
      className="rounded-panel border border-ink-200 bg-white p-6 shadow-soft sm:p-8"
    >
      <h2 id={`${uid}-form-heading`} className="type-h3">
        {copy.heading}
      </h2>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{copy.intro}</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={copy.fullNameLabel} htmlFor={fieldId("fullName")} required error={errors.fullName} errorId={errorId("fullName")}>
          <input
            {...controlProps("fullName")}
            type="text"
            autoComplete="name"
            placeholder={copy.fullNamePlaceholder}
            onChange={(event) => update("fullName", event.target.value)}
          />
        </Field>

        <Field label={copy.emailLabel} htmlFor={fieldId("email")} required error={errors.email} errorId={errorId("email")}>
          <input
            {...controlProps("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            onChange={(event) => update("email", event.target.value)}
          />
        </Field>

        <Field label={copy.companyLabel} htmlFor={fieldId("company")} error={errors.company} errorId={errorId("company")}>
          <input
            {...controlProps("company")}
            type="text"
            autoComplete="organization"
            placeholder={copy.companyPlaceholder}
            onChange={(event) => update("company", event.target.value)}
          />
        </Field>

        <Field label={copy.phoneLabel} htmlFor={fieldId("phone")} error={errors.phone} errorId={errorId("phone")}>
          <input
            {...controlProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={copy.phonePlaceholder}
            onChange={(event) => update("phone", event.target.value)}
          />
        </Field>

        <Field label={copy.projectTypeLabel} htmlFor={fieldId("projectType")} required error={errors.projectType} errorId={errorId("projectType")}>
          <select
            {...controlProps("projectType")}
            onChange={(event) => update("projectType", event.target.value)}
          >
            <option value="">{copy.projectTypePlaceholder}</option>
            {projectTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label={copy.budgetLabel} htmlFor={fieldId("budget")} error={errors.budget} errorId={errorId("budget")}>
          <select
            {...controlProps("budget")}
            onChange={(event) => update("budget", event.target.value)}
          >
            <option value="">{copy.budgetPlaceholder}</option>
            {budgetRanges.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={copy.messageLabel}
          htmlFor={fieldId("message")}
          required
          error={errors.message}
          errorId={errorId("message")}
          className="sm:col-span-2"
        >
          <textarea
            {...controlProps("message")}
            rows={6}
            placeholder={copy.messagePlaceholder}
            onChange={(event) => update("message", event.target.value)}
          />
        </Field>
      </div>

      {status === "error" ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-[0.75rem] border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            {copy.failure.before}{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
            {copy.failure.after}
          </span>
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          leadingIcon={
            isSubmitting ? (
              <Loader2 className="size-[1.125rem] animate-spin" aria-hidden />
            ) : (
              <Send className="size-[1.125rem]" aria-hidden />
            )
          }
        >
          {isSubmitting ? copy.submittingLabel : copy.submitLabel}
        </Button>

        <p className="text-xs leading-relaxed text-ink-500 sm:max-w-xs sm:text-right">
          {siteConfig.contact.responseTime}
        </p>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  errorId: string;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + error message, so every field is wired identically. */
function Field({
  label,
  htmlFor,
  required,
  error,
  errorId,
  className,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-ink-800"
      >
        {label}
        {required ? (
          <span className="text-brand-600" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
        {required ? (
          <span className="sr-only"> {copy.requiredHint}</span>
        ) : null}
      </label>

      <div className="mt-2">{children}</div>

      {error ? (
        <p
          id={errorId}
          className="mt-2 flex items-start gap-1.5 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}
