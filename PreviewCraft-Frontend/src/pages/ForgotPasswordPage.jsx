import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FiMail,
    FiArrowRight,
    FiGitBranch,
    FiArrowLeft,
} from "react-icons/fi";
import { forgotPassword } from "../api/authApi.js";

function FieldShell({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] tracking-wide text-muted">
                {label}
            </span>
            {children}
        </label>
    );
}

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError("Please enter your email address");
            return;
        }

        setError("");
        setStatus("loading");

        try {
            const res = await forgotPassword({
                email: normalizedEmail,
            });

            toast.success(
                res?.data?.message ||
                "Password reset code sent to your email."
            );

            // Keep it in sessionStorage too so refreshing
            // the reset page doesn't lose the email.
            sessionStorage.setItem(
                "passwordResetEmail",
                normalizedEmail
            );

            navigate("/reset-password", {
                state: {
                    email: normalizedEmail,
                },
            });
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";

            setStatus("idle");
            setError(message);
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen w-full bg-ink font-body text-ink2 flex items-center justify-center px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.45,
                    ease: "easeOut",
                }}
                className="w-full max-w-110 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
                <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink" />
                    <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green" />

                    <span className="ml-3 font-mono text-[12px] text-muted">
                        forgot-password — previewcraft
                    </span>
                </div>

                <div className="p-8">
                    <div className="mb-5 flex h-7 w-7 items-center justify-center rounded-md bg-pink/15 text-pink">
                        <FiGitBranch size={15} />
                    </div>

                    <h2 className="font-display text-2xl font-semibold text-ink2">
                        Reset your password
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Enter the email associated with your account
                        and we'll send you a 6-digit reset code.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-7 space-y-5"
                    >
                        <FieldShell label="$ email">
                            <div className="flex items-center gap-2 rounded-md border border-line bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink">
                                <FiMail
                                    size={15}
                                    className="text-muted"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    className="w-full bg-transparent text-sm text-ink2 outline-none placeholder:text-muted/60"
                                />
                            </div>
                        </FieldShell>

                        {error && (
                            <p className="font-mono text-[12px] text-pink">
                                ✗ {error}
                            </p>
                        )}

                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.98 }}
                            disabled={status === "loading"}
                            className="group flex w-full items-center justify-center gap-2 rounded-md bg-pink px-4 py-2.5 font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
                        >
                            {status === "loading"
                                ? "Sending..."
                                : "Send reset code"}

                            {status !== "loading" && (
                                <FiArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            )}
                        </motion.button>
                    </form>

                    <Link
                        to="/user-login"
                        className="mt-6 inline-flex items-center gap-1.5 font-mono text-[12px] text-pink hover:underline"
                    >
                        <FiArrowLeft size={13} />
                        back to sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}