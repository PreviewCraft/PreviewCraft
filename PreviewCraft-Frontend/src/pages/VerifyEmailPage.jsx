import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FiCheckCircle,
    FiXCircle,
    FiGitBranch,
    FiLoader,
    FiMail,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { verifyEmail, resendVerificationOtp } from "../api/authApi.js";

function LogLine({ text, tone }) {
    const color =
        tone === "cmd"
            ? "text-ink2"
            : tone === "ok"
                ? "text-green"
                : tone === "error"
                    ? "text-pink"
                    : "text-muted";

    return (
        <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`font-mono text-[12px] leading-relaxed ${color}`}
        >
            {text}
        </motion.p>
    );
}

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email ||
        sessionStorage.getItem("verificationEmail") ||
        "";

    const [otp, setOtp] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [resending, setResending] = useState(false);

    const [logs, setLogs] = useState([
        { text: "$ previewcraft account --verify", tone: "cmd" },
        { text: "→ waiting for verification code...", tone: "muted" },
    ]);

    const logRef = useRef(null);

    const pushLog = (text, tone = "muted") => {
        setLogs((prev) => [...prev, { text, tone }]);
    };

    useEffect(() => {
        logRef.current?.scrollTo({
            top: logRef.current.scrollHeight,
        });
    }, [logs]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!email) {
            setStatus("error");
            setMessage("Email address is missing.");
            pushLog("✗ verification email not found", "error");
            toast.error("Please register again.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setStatus("error");
            setMessage("Enter the 6-digit verification code.");
            pushLog("✗ invalid OTP format", "error");
            toast.error("Enter a valid 6-digit code.");
            return;
        }

        try {
            setStatus("loading");
            setMessage("");
            pushLog("→ verifying code...", "muted");

            const res = await verifyEmail({
                email,
                otp,
            });

            const successMessage =
                res?.data?.message || "Email verified successfully.";

            setStatus("success");
            setMessage(successMessage);

            pushLog("✓ verification code accepted", "ok");
            pushLog("✓ email verified", "ok");

            sessionStorage.removeItem("verificationEmail");

            toast.success(successMessage);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Verification failed. The code may be invalid or expired.";

            setStatus("error");
            setMessage(msg);

            pushLog(`✗ ${msg}`, "error");
            toast.error(msg);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error("Email address is missing. Please register again.");
            return;
        }

        try {
            setResending(true);

            pushLog("→ requesting new verification code...", "muted");

            const res = await resendVerificationOtp({
                email,
            });

            pushLog("✓ new verification code sent", "ok");

            toast.success(
                res?.data?.message || "A new verification code was sent."
            );
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Could not resend verification code.";

            pushLog(`✗ ${msg}`, "error");
            toast.error(msg);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-ink font-body text-ink2 flex items-center justify-center px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full max-w-110 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
                {/* Terminal Header */}

                <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink" />
                    <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green" />

                    <span className="ml-3 font-mono text-[12px] text-muted">
                        verify-email — previewcraft
                    </span>
                </div>

                <div className="p-8 text-center">
                    <div className="mx-auto mb-5 flex h-7 w-7 items-center justify-center rounded-md bg-pink/15 text-pink">
                        <FiGitBranch size={15} />
                    </div>

                    <AnimatePresence mode="wait">
                        {/* OTP FORM */}

                        {status !== "success" && (
                            <motion.div
                                key="verify"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <FiMail
                                    className="mx-auto mb-4 text-pink"
                                    size={30}
                                />

                                <h2 className="font-display text-xl font-semibold text-ink2">
                                    Verify your email
                                </h2>

                                <p className="mt-2 text-sm text-muted">
                                    Enter the 6-digit verification code sent to
                                </p>

                                <p className="mt-1 text-sm text-ink2">
                                    {email || "your email address"}
                                </p>

                                <form
                                    onSubmit={handleVerify}
                                    className="mt-6"
                                >
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6);

                                            setOtp(value);

                                            if (status === "error") {
                                                setStatus("idle");
                                                setMessage("");
                                            }
                                        }}
                                        placeholder="000000"
                                        className="w-full rounded-md border border-line bg-ink px-4 py-3 text-center font-mono text-2xl tracking-[0.45em] text-ink2 outline-none transition-colors placeholder:text-muted/30 focus:border-pink"
                                    />

                                    {status === "error" && message && (
                                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-pink">
                                            <FiXCircle size={14} />
                                            {message}
                                        </div>
                                    )}

                                    <motion.button
                                        type="submit"
                                        whileTap={{ scale: 0.98 }}
                                        disabled={
                                            status === "loading" ||
                                            otp.length !== 6
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-pink px-4 py-2.5 font-medium text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <FiLoader
                                                    className="animate-spin"
                                                    size={16}
                                                />
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify email"
                                        )}
                                    </motion.button>
                                </form>

                                <p className="mt-5 text-sm text-muted">
                                    Didn't receive the code?{" "}
                                    <button
                                        type="button"
                                        disabled={resending}
                                        onClick={handleResend}
                                        className="text-pink hover:underline disabled:opacity-50"
                                    >
                                        {resending
                                            ? "Sending..."
                                            : "Resend code"}
                                    </button>
                                </p>

                                {!email && (
                                    <p className="mt-4 text-xs text-pink">
                                        Verification email missing. Please
                                        register again.
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {/* SUCCESS */}

                        {status === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <FiCheckCircle
                                    className="mx-auto mb-4 text-green"
                                    size={32}
                                />

                                <h2 className="font-display text-xl font-semibold text-ink2">
                                    Email verified
                                </h2>

                                <p className="mt-1 text-sm text-muted">
                                    {message}
                                </p>

                                <button
                                    onClick={() => navigate("/user-login")}
                                    className="mt-6 inline-flex items-center justify-center rounded-md bg-pink px-4 py-2.5 font-medium text-ink transition-opacity hover:opacity-90"
                                >
                                    Continue to sign in
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* LOGS */}

                    <div
                        ref={logRef}
                        className="mt-6 h-20 space-y-1 overflow-y-auto rounded-md border border-line bg-ink px-3.5 py-3 text-left"
                    >
                        <AnimatePresence initial={false}>
                            {logs.map((log, i) => (
                                <LogLine
                                    key={i}
                                    text={log.text}
                                    tone={log.tone}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {status !== "success" && (
                        <Link
                            to="/user-register"
                            className="mt-5 inline-block text-sm text-muted hover:text-ink2"
                        >
                            Back to registration
                        </Link>
                    )}
                </div>
            </motion.div>
        </div>
    );
}