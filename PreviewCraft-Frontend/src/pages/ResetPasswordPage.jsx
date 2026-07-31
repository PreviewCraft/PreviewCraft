import { useState } from "react";
import { motion } from "framer-motion";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import {
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiGitBranch,
    FiCheckCircle,
    FiKey,
} from "react-icons/fi";
import { resetPassword } from "../api/authApi.js";

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

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email =
        location.state?.email ||
        sessionStorage.getItem("passwordResetEmail") ||
        "";

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email =
            sessionStorage.getItem("passwordResetEmail");

        if (!email) {
            setError("Reset session expired. Request a new code.");
            return;
        }

        if (!otp || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setError("");
        setStatus("loading");

        const payload = {
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
            password,
            confirmPassword,
        };

        console.log("RESET PAYLOAD:", payload);

        try {
            const res = await resetPassword(payload);

            sessionStorage.removeItem("passwordResetEmail");

            setStatus("success");

            toast.success(
                res?.data?.message ||
                "Password reset successfully"
            );

            setTimeout(() => {
                navigate("/user-login");
            }, 1200);

        } catch (err) {
            console.error(
                "RESET PASSWORD ERROR:",
                err?.response?.data || err
            );

            const message =
                err?.response?.data?.message ||
                "Password reset failed. Please try again.";

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
                        reset-password — previewcraft
                    </span>
                </div>

                <div className="p-8">
                    <div className="mb-5 flex h-7 w-7 items-center justify-center rounded-md bg-pink/15 text-pink">
                        <FiGitBranch size={15} />
                    </div>

                    {status !== "success" ? (
                        <>
                            <h2 className="font-display text-2xl font-semibold text-ink2">
                                Set a new password
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Enter the code sent to{" "}
                                <span className="text-ink2">
                                    {email || "your email"}
                                </span>{" "}
                                and choose a new password.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-7 space-y-5"
                            >
                                {/* OTP */}

                                <FieldShell label="$ reset code">
                                    <div className="flex items-center gap-2 rounded-md border border-line bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink">
                                        <FiKey
                                            size={15}
                                            className="text-muted"
                                        />

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                        .slice(
                                                            0,
                                                            6
                                                        );

                                                setOtp(value);
                                                setError("");
                                            }}
                                            placeholder="000000"
                                            className="w-full bg-transparent font-mono text-sm tracking-[0.3em] text-ink2 outline-none placeholder:text-muted/60"
                                        />
                                    </div>
                                </FieldShell>

                                {/* PASSWORD */}

                                <FieldShell label="$ new password">
                                    <div className="flex items-center gap-2 rounded-md border border-line bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink">
                                        <FiLock
                                            size={15}
                                            className="text-muted"
                                        />

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(
                                                    e.target.value
                                                );
                                                setError("");
                                            }}
                                            placeholder="••••••••••"
                                            autoComplete="new-password"
                                            className="w-full bg-transparent text-sm text-ink2 outline-none placeholder:text-muted/60"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (s) => !s
                                                )
                                            }
                                            className="text-muted transition-colors hover:text-ink2"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <FiEyeOff
                                                    size={15}
                                                />
                                            ) : (
                                                <FiEye
                                                    size={15}
                                                />
                                            )}
                                        </button>
                                    </div>
                                </FieldShell>

                                {/* CONFIRM PASSWORD */}

                                <FieldShell label="$ confirm password">
                                    <div className="flex items-center gap-2 rounded-md border border-line bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink">
                                        <FiLock
                                            size={15}
                                            className="text-muted"
                                        />

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(
                                                    e.target.value
                                                );
                                                setError("");
                                            }}
                                            placeholder="••••••••••"
                                            autoComplete="new-password"
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
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    disabled={
                                        status === "loading"
                                    }
                                    className="group flex w-full items-center justify-center gap-2 rounded-md bg-pink px-4 py-2.5 font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
                                >
                                    {status === "loading"
                                        ? "Resetting..."
                                        : "Reset password"}

                                    {status !== "loading" && (
                                        <FiArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    )}
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <FiCheckCircle
                                className="mx-auto mb-4 text-green"
                                size={32}
                            />

                            <h2 className="font-display text-xl font-semibold text-ink2">
                                Password updated
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Your password has been changed.
                                Redirecting you to sign in...
                            </p>
                        </div>
                    )}

                    {status !== "success" && (
                        <p className="mt-6 text-center text-sm text-muted">
                            Need a new code?{" "}
                            <Link
                                to="/forgot-password"
                                className="text-pink hover:underline"
                            >
                                Request another
                            </Link>
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}