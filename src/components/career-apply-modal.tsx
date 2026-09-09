import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { submitCareerApplication } from "@/lib/careers-api";

interface CareerApplyModalProps {
  open: boolean;
  roleId: string;
  roleTitle: string;
  onClose: () => void;
}

const MAX_RESUME_BYTES = 500 * 1024; // 500KB — matches the backend's server-side limit
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s-]{7,15}$/;
const URL_RE = /^https?:\/\/.+/i;

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
}

type FieldErrors = Partial<Record<keyof FormState | "resume", string>>;

const EMPTY_FORM: FormState = { fullName: "", email: "", phone: "", linkedinUrl: "" };

function validateFile(file: File | null): string | undefined {
  if (!file) return "Attach your resume";
  if (!ALLOWED_RESUME_TYPES.includes(file.type)) return "Resume must be a PDF or Word document";
  if (file.size > MAX_RESUME_BYTES) return "Resume must be under 500KB";
  return undefined;
}

function fileExt(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

function formatFileSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

export function CareerApplyModal({ open, roleId, roleTitle, onClose }: CareerApplyModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function validateAll(): FieldErrors {
    const next: FieldErrors = {};
    if (form.fullName.trim().length < 2) next.fullName = "Enter your full name";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!PHONE_RE.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (form.linkedinUrl.trim() && !URL_RE.test(form.linkedinUrl.trim())) {
      next.linkedinUrl = "Enter a valid URL (starting with http:// or https://)";
    }
    const fileError = validateFile(resume);
    if (fileError) next.resume = fileError;
    return next;
  }

  function handleFileSelect(file: File | null) {
    setResume(file);
    setErrors((prev) => ({ ...prev, resume: file ? validateFile(file) : prev.resume }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    handleFileSelect(e.target.files?.[0] ?? null);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files?.[0] ?? null);
  }

  function removeFile() {
    setResume(null);
    setErrors((prev) => ({ ...prev, resume: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function resetAndClose() {
    onClose();
    setTimeout(() => {
      setForm(EMPTY_FORM);
      setResume(null);
      setErrors({});
      setSubmitError(null);
      setSuccess(false);
      setDragActive(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 200);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateAll();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !resume) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitCareerApplication(roleId, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        resume,
      });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ckm-overlay" onClick={resetAndClose}>
      <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ckm-head">
          <div className="ckm-head-title">Apply — {roleTitle}</div>
          <button type="button" className="ckm-close" onClick={resetAndClose} aria-label="Close">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="apply-modal-success">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#1f8f52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-6" />
            </svg>
            <p className="apply-modal-success-title">Application submitted</p>
            <p className="apply-modal-success-sub">Thanks for applying — we'll be in touch if it's a fit.</p>
            <button type="button" className="lbtn-primary" onClick={resetAndClose}>Close</button>
          </div>
        ) : (
          <form className="apply-modal-form" onSubmit={handleSubmit} noValidate>
            <div className="apply-field">
              <label htmlFor="apply-name">Full name</label>
              <input
                id="apply-name"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className={`apply-input${errors.fullName ? " error" : ""}`}
                placeholder="Jane Doe"
              />
              {errors.fullName && <span className="apply-error">{errors.fullName}</span>}
            </div>

            <div className="apply-field-row">
              <div className="apply-field">
                <label htmlFor="apply-email">Email</label>
                <input
                  id="apply-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className={`apply-input${errors.email ? " error" : ""}`}
                  placeholder="jane@email.com"
                />
                {errors.email && <span className="apply-error">{errors.email}</span>}
              </div>
              <div className="apply-field">
                <label htmlFor="apply-phone">Phone</label>
                <input
                  id="apply-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className={`apply-input${errors.phone ? " error" : ""}`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <span className="apply-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="apply-field">
              <label htmlFor="apply-linkedin">LinkedIn or portfolio <span className="apply-optional">(optional)</span></label>
              <input
                id="apply-linkedin"
                value={form.linkedinUrl}
                onChange={(e) => setForm((p) => ({ ...p, linkedinUrl: e.target.value }))}
                className={`apply-input${errors.linkedinUrl ? " error" : ""}`}
                placeholder="https://linkedin.com/in/..."
              />
              {errors.linkedinUrl && <span className="apply-error">{errors.linkedinUrl}</span>}
            </div>

            <div className="apply-field">
              <label htmlFor="apply-resume">Resume <span className="apply-hint">(PDF or Word, max 500KB)</span></label>
              <input
                ref={fileInputRef}
                id="apply-resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="apply-file-input-hidden"
              />
              {!resume ? (
                <div
                  className={`apply-dropzone${dragActive ? " active" : ""}${errors.resume ? " error" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  <svg
                    className="apply-dropzone-icon"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 18a4 4 0 01-.6-7.96A5.5 5.5 0 0117 8.5a4.5 4.5 0 01-.5 8.98" />
                    <path d="M12 12v6M9.5 14.5L12 12l2.5 2.5" />
                  </svg>
                  <p className="apply-dropzone-text">Choose a file or drag &amp; drop it here</p>
                  <button
                    type="button"
                    className="apply-browse-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Browse File
                  </button>
                </div>
              ) : (
                <div className={`apply-file-card${errors.resume ? " error" : ""}`}>
                  <span className={`apply-file-badge ${fileExt(resume.name)}`}>{fileExt(resume.name).toUpperCase()}</span>
                  <div className="apply-file-meta">
                    <span className="apply-file-name">{resume.name}</span>
                    <span className="apply-file-size">{formatFileSize(resume.size)}</span>
                  </div>
                  <button type="button" className="apply-file-remove" onClick={removeFile} aria-label="Remove file">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="11" height="11">
                      <path d="M1 1l10 10M11 1L1 11" />
                    </svg>
                  </button>
                </div>
              )}
              {errors.resume && <span className="apply-error">{errors.resume}</span>}
            </div>

            {submitError && <p className="apply-submit-error">{submitError}</p>}

            <button type="submit" className="lbtn-primary apply-submit-btn" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
