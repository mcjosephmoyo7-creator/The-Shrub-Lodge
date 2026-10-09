"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  email: z.string().min(1, "Please enter your email").email("Enter a valid email address"),
  message: z.string().min(1, "Please tell us a little about your plans"),
});

type FormValues = z.infer<typeof schema>;

const fieldClass =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-900 placeholder:text-forest-800/40 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(_values: FormValues) {
    // Demo handler. Wire this up to your email/CRM endpoint (e.g. a Route Handler).
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSent(true);
    reset();
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-sand-200 bg-sand-100/60 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-forest-600" />
        <p className="font-display text-2xl text-forest-900">
          Thank You, We&rsquo;ll Contact You Soon!
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-sm font-semibold text-gold-700 underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="text-sm font-medium text-forest-900">
            First Name
          </label>
          <input
            id="firstName"
            className={cn(fieldClass, errors.firstName && "border-red-400")}
            placeholder="Jane"
            {...register("firstName")}
          />
          {errors.firstName ? (
            <span className="text-xs text-red-600">{errors.firstName.message}</span>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className="text-sm font-medium text-forest-900">
            Last Name
          </label>
          <input
            id="lastName"
            className={cn(fieldClass, errors.lastName && "border-red-400")}
            placeholder="Doe"
            {...register("lastName")}
          />
          {errors.lastName ? (
            <span className="text-xs text-red-600">{errors.lastName.message}</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-forest-900">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={cn(fieldClass, errors.email && "border-red-400")}
          placeholder="jane@example.com"
          {...register("email")}
        />
        {errors.email ? (
          <span className="text-xs text-red-600">{errors.email.message}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-forest-900">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className={cn(fieldClass, "resize-y", errors.message && "border-red-400")}
          placeholder="Tell us about your trip and what you would like to do..."
          {...register("message")}
        />
        {errors.message ? (
          <span className="text-xs text-red-600">{errors.message.message}</span>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
