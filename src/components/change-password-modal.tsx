import type { FormEvent } from "react";
import { useState } from "react";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  allowEmptyCurrentPassword: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  infoMessage: string | null;
}

export function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
  allowEmptyCurrentPassword,
  isLoading,
  errorMessage,
  infoMessage,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Change password</div>
            <div className="modal-copy">Update your account password on the backend.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>
              {allowEmptyCurrentPassword ? "Current password (optional)" : "Current password"}
            </span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              required={!allowEmptyCurrentPassword}
            />
          </label>

          <label className="auth-field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          <label className="auth-field">
            <span>Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          {newPassword && confirmPassword && newPassword !== confirmPassword ? (
            <div className="auth-error">Passwords do not match.</div>
          ) : null}

          {errorMessage ? <div className="auth-error">{errorMessage}</div> : null}
          {infoMessage ? <div className="auth-info">{infoMessage}</div> : null}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
