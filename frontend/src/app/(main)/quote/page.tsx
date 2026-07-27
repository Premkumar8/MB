"use client";

import React, { useState } from "react";
import { Send, Upload, CheckCircle, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

type QuoteField =
  | "clientName"
  | "clientEmail"
  | "clientPhone"
  | "stoneName"
  | "quantity"
  | "dimensions"
  | "finish"
  | "budget"
  | "notes"
  | "drawingFile"
  | "roomFile";

type FormErrors = Partial<Record<QuoteField, string>>;

export default function QuotePage() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    stoneName: "Carrara Gold",
    quantity: "",
    dimensions: "",
    finish: "Polished",
    budget: "$5k - $10k",
    notes: "",
  });

  const [drawingFile, setDrawingFile] = useState<File | null>(null);
  const [roomFile, setRoomFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");

  const stoneOptions = ["Carrara Gold", "Nero Marquina", "Emerald Onyx", "Calacatta Viola", "Taj Mahal"];
  const finishOptions = ["Polished", "Honed", "Brushed", "Leathered"];
  const budgetOptions = ["Under $5k", "$5k - $10k", "$10k - $25k", "$25k - $50k", "$50k+"];

  const inputClass = (field: QuoteField) =>
    `w-full bg-white/5 border px-4 py-3 text-xs focus:outline-none focus:border-gold-500/60 rounded-none text-black dark:text-white ${
      errors[field] ? "border-red-500/70" : "border-black/10 dark:border-white/10"
    }`;

  const errorText = (field: QuoteField) =>
    errors[field] ? <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500">{errors[field]}</p> : null;

  const validateFile = (file: File | null, kind: "drawing" | "room") => {
    if (!file) return "";
    if (file.size > MAX_UPLOAD_SIZE) return "File must be 10MB or less.";
    if (kind === "drawing" && file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      return "Attach a PDF or image file.";
    }
    if (kind === "room" && !file.type.startsWith("image/")) {
      return "Attach an image file.";
    }
    return "";
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = formData.clientPhone.replace(/\D/g, "");

    if (formData.clientName.trim().length < 2) nextErrors.clientName = "Enter your full name.";
    if (!emailPattern.test(formData.clientEmail.trim())) nextErrors.clientEmail = "Enter a valid email address.";
    if (phoneDigits.length < 10) nextErrors.clientPhone = "Enter a valid phone number.";
    if (!formData.stoneName.trim()) nextErrors.stoneName = "Select a material.";
    if (formData.quantity && Number(formData.quantity) <= 0) nextErrors.quantity = "Quantity must be greater than 0.";
    if (formData.notes.length > 1000) nextErrors.notes = "Keep notes under 1000 characters.";

    const drawingError = validateFile(drawingFile, "drawing");
    const roomError = validateFile(roomFile, "room");
    if (drawingError) nextErrors.drawingFile = drawingError;
    if (roomError) nextErrors.roomFile = roomError;

    return nextErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "drawing" | "room") => {
    const file = e.target.files?.[0] || null;
    const field = type === "drawing" ? "drawingFile" : "roomFile";
    const message = validateFile(file, type);

    if (type === "drawing") setDrawingFile(file);
    else setRoomFile(file);

    setErrors((prev) => ({ ...prev, [field]: message || undefined }));
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("client_name", formData.clientName.trim());
      payload.append("client_email", formData.clientEmail.trim());
      payload.append("client_phone", formData.clientPhone.trim());
      payload.append("stone_name", formData.stoneName.trim());
      if (formData.quantity) payload.append("quantity", formData.quantity);
      if (formData.dimensions) payload.append("dimensions", formData.dimensions.trim());
      if (formData.finish) payload.append("finish", formData.finish);
      if (formData.budget) payload.append("budget", formData.budget);
      if (formData.notes) payload.append("notes", formData.notes.trim());

      if (drawingFile) payload.append("drawing", drawingFile);
      if (roomFile) payload.append("room_image", roomFile);

      const res = await fetch(`${API_URL}/api/quotes`, {
        method: "POST",
        body: payload,
      });

      if (res.ok) {
        setErrors({});
        setSuccess(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#ffffff", "#000000"],
        });
      } else {
        const error = await res.json().catch(() => null);
        setSubmitError(error?.detail || "Quote could not be saved. Please check the details and try again.");
      }
    } catch (err) {
      console.error("Quote submission failed", err);
      setSubmitError("Could not reach the quote server. Your request was not saved. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 page-fade-in">
      {/* Header */}
      <div className="space-y-4 text-center">
        <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-bold">
          Signature Estimation
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide">
          Request A <span className="font-bold text-gold-gradient">Custom Quote</span>
        </h1>
        <p className="text-xs text-black/50 dark:text-white/40 max-w-xl mx-auto leading-relaxed">
          Provide your project specs, upload floor layouts or architectural plans, and select your stone finishes. Our curators will compile a detailed pricing lot report within 24 hours.
        </p>
      </div>

      {success ? (
        <div className="glass-premium p-12 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500 flex items-center justify-center mx-auto text-gold-500 animate-pulse">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl text-black dark:text-white">Estimate Request Received</h3>
            <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed">
              Thank you for choosing Aurelia Marmi. A dedicated stone curator has been assigned to your request and will contact you via email shortly.
            </p>
          </div>
          <div className="border-t border-black/5 dark:border-white/5 pt-6 grid grid-cols-2 gap-4 text-left text-[10px] uppercase tracking-wider text-black/50 dark:text-white/40">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Response in &lt; 24h</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Full confidentiality</span>
            </div>
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                clientName: "",
                clientEmail: "",
                clientPhone: "",
                stoneName: "Carrara Gold",
                quantity: "",
                dimensions: "",
                finish: "Polished",
                budget: "$5k - $10k",
                notes: "",
              });
              setDrawingFile(null);
              setRoomFile(null);
              setErrors({});
              setSubmitError("");
            }}
            className="btn-gold-solid inline-block text-xs"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-premium p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {submitError && (
            <div className="md:col-span-2 border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-500">
              {submitError}
            </div>
          )}

          {/* Client Details */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Full Name *
            </label>
            <input
              type="text"
              name="clientName"
              required
              value={formData.clientName}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.clientName)}
              placeholder="E.g., Julian Sterling"
              className={inputClass("clientName")}
            />
            {errorText("clientName")}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Email Address *
            </label>
            <input
              type="email"
              name="clientEmail"
              required
              value={formData.clientEmail}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.clientEmail)}
              placeholder="E.g., julian@sterlinginteriors.com"
              className={inputClass("clientEmail")}
            />
            {errorText("clientEmail")}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Phone Number *
            </label>
            <input
              type="tel"
              name="clientPhone"
              required
              value={formData.clientPhone}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.clientPhone)}
              placeholder="E.g., +1 (310) 555-0199"
              className={inputClass("clientPhone")}
            />
            {errorText("clientPhone")}
          </div>

          {/* Stone Select */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Select Lot / Stone *
            </label>
            <select
              name="stoneName"
              value={formData.stoneName}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.stoneName)}
              className={inputClass("stoneName").replace("bg-white/5", "bg-transparent")}
            >
              {stoneOptions.map((opt) => (
                <option key={opt} value={opt} className="dark:bg-black">
                  {opt}
                </option>
              ))}
            </select>
            {errorText("stoneName")}
          </div>

          {/* Quantity & Dimensions */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Quantity Needed (sqft)
            </label>
            <input
              type="number"
              name="quantity"
              min="0"
              step="0.01"
              value={formData.quantity}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.quantity)}
              placeholder="E.g., 180"
              className={inputClass("quantity")}
            />
            {errorText("quantity")}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Dimensions (e.g. 120&quot; x 65&quot;)
            </label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
              placeholder="E.g., Waterfall island 124x60"
              className={inputClass("dimensions")}
            />
          </div>

          {/* Finish & Budget */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Required Finish
            </label>
            <select
              name="finish"
              value={formData.finish}
              onChange={handleInputChange}
              className={inputClass("finish").replace("bg-white/5", "bg-transparent")}
            >
              {finishOptions.map((opt) => (
                <option key={opt} value={opt} className="dark:bg-black">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Project Budget Limit
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className={inputClass("budget").replace("bg-white/5", "bg-transparent")}
            >
              {budgetOptions.map((opt) => (
                <option key={opt} value={opt} className="dark:bg-black">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Architectural Drawing upload */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold flex items-center space-x-1">
              <span>Architectural Drawings / Blueprints</span>
              <span title="PDF or image of elevations">
                <HelpCircle className="w-3.5 h-3.5 text-gold-500" />
              </span>
            </label>
            <div className="border border-dashed border-black/20 dark:border-white/10 p-4 text-center cursor-pointer relative hover:border-gold-500 transition-colors">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => handleFileChange(e, "drawing")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center space-x-2 text-[10px] text-black/60 dark:text-white/60">
                <Upload className="w-4 h-4 text-gold-500" />
                <span>{drawingFile ? `Attached: ${drawingFile.name}` : "Click to attach architectural plans (PDF/IMG)"}</span>
              </div>
            </div>
            {errorText("drawingFile")}
          </div>

          {/* Room photo upload */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Current Room Photo (Optional - for AI Visualizer support)
            </label>
            <div className="border border-dashed border-black/20 dark:border-white/10 p-4 text-center cursor-pointer relative hover:border-gold-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "room")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center space-x-2 text-[10px] text-black/60 dark:text-white/60">
                <Upload className="w-4 h-4 text-gold-500" />
                <span>{roomFile ? `Attached: ${roomFile.name}` : "Click to attach room image (JPG/PNG)"}</span>
              </div>
            </div>
            {errorText("roomFile")}
          </div>

          {/* Notes */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/50 font-semibold">
              Additional Design Notes / Custom Cuts
            </label>
            <textarea
              name="notes"
              rows={4}
              maxLength={1000}
              value={formData.notes}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.notes)}
              placeholder="Detail edge details (e.g. mitered apron), bookmatching, or structural support parameters..."
              className={inputClass("notes")}
            />
            {errorText("notes")}
          </div>

          {/* Submit */}
          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gold-solid text-center flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Submitting Portfolio Specs..." : "Submit Estimate Request"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
