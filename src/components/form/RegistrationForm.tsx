"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { defaultPlatformConfig, CustomFieldConfig } from "@/config/platform.config";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export function RegistrationForm() {
  const router = useRouter();
  const { registration, event } = defaultPlatformConfig;

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  // Submission & UI feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<{
    referenceId: string;
    whatsappUrl: string;
  } | null>(null);

  const handleCustomFieldChange = (id: string, value: any) => {
    setCustomFields((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const validateClientSide = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (minimum 2 characters)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      newErrors.phone = "Please enter a valid phone or WhatsApp number";
    }

    if (registration.requireConsent && !consentGiven) {
      newErrors.consentGiven = "You must agree to the privacy and event terms";
    }

    // Validate required custom fields
    registration.customFields.forEach((field) => {
      if (field.required) {
        const val = customFields[field.id];
        if (!val || (typeof val === "string" && val.trim() === "")) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setDuplicateNotice(null);

    if (!validateClientSide()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          consentGiven,
          customFields,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const flatErrors: Record<string, string> = {};
          for (const [key, val] of Object.entries(data.errors)) {
            flatErrors[key] = Array.isArray(val) ? val[0] : (val as string);
          }
          setErrors(flatErrors);
        }
        setGeneralError(
          data.message || "Failed to submit registration. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      if (data.alreadyRegistered) {
        setDuplicateNotice({
          referenceId: data.referenceId,
          whatsappUrl: data.whatsappUrl,
        });
        setIsSubmitting(false);
        return;
      }

      // Success! Redirect to confirmation screen
      router.push(`/confirmation/${data.referenceId}`);
    } catch (err: any) {
      console.error("Submission network error:", err);
      setGeneralError(
        "A network connection error occurred. Please check your connection and tap Submit again."
      );
      setIsSubmitting(false);
    }
  };

  if (!registration.isOpen) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900/50 dark:bg-amber-950/20">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-600 mb-3" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Registrations are Currently Paused
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          We have reached maximum capacity or registrations have closed for this
          session. Stay tuned for future editions.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      {duplicateNotice ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 sm:p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20 animate-in fade-in">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            You Are Already Registered!
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            We found an active registration under your details with reference:
          </p>
          <div className="my-4 inline-block rounded-xl bg-white px-5 py-2.5 font-mono text-lg font-extrabold text-slate-900 shadow-xs border border-emerald-300 dark:bg-slate-800 dark:text-white">
            {duplicateNotice.referenceId}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="whatsapp"
              size="lg"
              onClick={() => window.open(duplicateNotice.whatsappUrl, "_blank")}
              className="w-full sm:w-auto"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Join WhatsApp Group
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(`/confirmation/${duplicateNotice.referenceId}`)}
              className="w-full sm:w-auto"
            >
              View Pass
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Event Registration
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Complete your details below to receive your digital pass and official WhatsApp community invitation.
            </p>
          </div>

          {generalError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">Notice</p>
                <p className="text-xs mt-0.5">{generalError}</p>
              </div>
            </div>
          )}

          {/* Full Name */}
          <Input
            label="Full Name"
            name="fullName"
            placeholder="e.g. Alex Johnson"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) {
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.fullName;
                  return n;
                });
              }
            }}
            error={errors.fullName}
            autoComplete="name"
          />

          {/* Email */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="alex.johnson@example.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.email;
                  return n;
                });
              }
            }}
            error={errors.email}
            helperText="Your registration pass and confirmation will be sent here."
            autoComplete="email"
          />

          {/* Mobile / WhatsApp Number */}
          <Input
            label="WhatsApp Mobile Number"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) {
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.phone;
                  return n;
                });
              }
            }}
            error={errors.phone}
            helperText="Used for official community coordination and session alerts."
            autoComplete="tel"
          />

          {/* Dynamic Custom Fields */}
          {registration.customFields.map((field: CustomFieldConfig) => {
            if (field.type === "select") {
              return (
                <Select
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  required={field.required}
                  options={field.options || []}
                  placeholderOption={`Select ${field.label}...`}
                  value={customFields[field.id] || ""}
                  onChange={(e) =>
                    handleCustomFieldChange(field.id, e.target.value)
                  }
                  error={errors[field.id]}
                  helperText={field.helperText}
                />
              );
            }

            return (
              <Input
                key={field.id}
                id={field.id}
                label={field.label}
                required={field.required}
                placeholder={field.placeholder}
                value={customFields[field.id] || ""}
                onChange={(e) =>
                  handleCustomFieldChange(field.id, e.target.value)
                }
                error={errors[field.id]}
                helperText={field.helperText}
              />
            );
          })}

          {/* Turnstile Bot Protection */}
          <TurnstileWidget
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken("")}
          />

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => {
                  setConsentGiven(e.target.checked);
                  if (errors.consentGiven) {
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.consentGiven;
                      return n;
                    });
                  }
                }}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {registration.consentText}{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.consentGiven && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.consentGiven}
              </p>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full text-base font-bold shadow-lg shadow-blue-600/25 py-4"
            >
              <span>Confirm Registration & Get Pass</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instant Confirmation • No Password Required</span>
          </div>
        </form>
      )}
    </div>
  );
}
