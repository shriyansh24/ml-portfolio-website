"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import { validationRules, useFormValidation } from "@/lib/formValidation";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ErrorFallback from "@/components/error/ErrorFallback";

// Helper function for class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// The actual form component
function ContactFormContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Define validation schema
  const validationSchema = {
    name: [validationRules.required],
    email: [validationRules.required, validationRules.email],
    message: [validationRules.required, validationRules.minLength(10)]
  };

  // Use our custom form validation hook
  const {
    values: formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm
  } = useFormValidation<FormData>(
    {
      name: "",
      email: "",
      message: "",
    },
    validationSchema
  );

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use our validation utility
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Message sent successfully! I'll get back to you soon.",
        });
        // Reset form on success
        resetForm();
      } else {
        setSubmitStatus({
          success: false,
          message: data.error?.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-md">
      {submitStatus.success ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{submitStatus.message}</p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {submitStatus.success === false ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{submitStatus.message}</p>
            </div>
          </div>
        </motion.div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput
          id="name"
          name="name"
          label="Name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          required
        />

        <FormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
          required
          autoComplete="email"
        />

        <FormTextarea
          id="message"
          name="message"
          label="Message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.message}
          touched={touched.message}
          required
          rows={5}
        />

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="primary"
            className="w-full py-6 text-base"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </div>
            ) : (
              "Send Message"
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

// Export the form wrapped with an error boundary
export default function ContactForm() {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback 
          title="Contact Form Error" 
          message="We're having trouble displaying the contact form. Please try again later or contact us directly via email."
        />
      }
    >
      <ContactFormContent />
    </ErrorBoundary>
  );
}