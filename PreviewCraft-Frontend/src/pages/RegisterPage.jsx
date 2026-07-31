import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiGitBranch,
    FiTerminal,
    FiCheck,
} from "react-icons/fi";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { registerUser, getGithubAuthUrl, googleLogin } from "../api/authApi.js";
import { GoogleLogin } from "@react-oauth/google";

const INITIAL_LOGS = [
    { text: "$ previewcraft account --create", tone: "cmd" },
    { text: "→ waiting for account details...", tone: "muted" },
];

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

function scorePassword(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
}

const STRENGTH_LABEL = ["weak", "weak", "fair", "strong", "solid"];

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [status, setStatus] = useState("idle");
    const loggedFocus = useRef({ name: false, username: false, email: false, password: false });
    const logRef = useRef(null);
    const navigate = useNavigate();

    const strength = useMemo(() => scorePassword(password), [password]);

    const pushLog = (text, tone = "muted") =>
        setLogs((prev) => [...prev, { text, tone }]);

    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    }, [logs]);

    const handleFocus = (field) => {
        if (loggedFocus.current[field]) return;
        loggedFocus.current[field] = true;
        const copy = {
            name: "→ reading account name...",
            username: "→ reading username...",
            email: "→ reading email input...",
            password: "→ reading password input...",
        };
        pushLog(copy[field], "muted");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !username || !email || !password || !confirm) {
            pushLog("✗ missing required fields", "error");
            setStatus("error");
            toast.error("Please fill in all fields");
            return;
        }
        if (password !== confirm) {
            pushLog("✗ password confirmation does not match", "error");
            setStatus("error");
            toast.error("Passwords don't match");
            return;
        }
        if (!agreed) {
            pushLog("✗ terms of service not accepted", "error");
            setStatus("error");
            toast.error("Please accept the terms to continue");
            return;
        }

        setStatus("loading");
        pushLog("→ validating credentials...", "muted");

        try {
            const res = await registerUser({
                fullname: name,
                username,
                email,
                password,
            });
            pushLog("✓ workspace provisioned", "ok");
            pushLog(`✓ account created for ${email}`, "ok");
            setStatus("ok");
            toast.success(res?.data?.message || "Account created! Check your email to verify it.");
            navigate("/verify-email", {
                state: {
                    email,
                },
            });
        } catch (err) {
            const message =
                err?.response?.data?.message || "Registration failed. Please try again.";
            pushLog(`✗ ${message}`, "error");
            setStatus("error");
            toast.error(message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential;

            if (!idToken) {
                throw new Error("Google did not return an ID token");
            }

            setStatus("loading");

            pushLog(
                "$ previewcraft account --create --provider=google",
                "cmd"
            );

            pushLog(
                "→ verifying google credentials...",
                "muted"
            );

            const res = await googleLogin(idToken);

            pushLog(
                "✓ google authentication successful",
                "ok"
            );

            setStatus("ok");

            toast.success(
                res?.data?.message ||
                "Google authentication successful"
            );

            navigate("/home-previewcraft");

        } catch (err) {
            console.error("GOOGLE AUTH ERROR:", err);

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Google authentication failed";

            pushLog(`✗ ${message}`, "error");

            setStatus("error");

            toast.error(message);
        }
    };

    const handleGithubAuth = () => {
        pushLog("$ previewcraft auth --provider=github", "cmd");
        pushLog("→ opening github oauth handshake...", "muted");
        window.location.href = getGithubAuthUrl();
    };

    const handleGoogleAuth = () => {
        toast("Google sign-up isn't wired up yet", { icon: "🚧" });
    };

    return (
        <div className="min-h-screen w-full bg-ink font-body text-ink2 flex">
            <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden border-r border-line bg-surface px-14 py-12 lg:flex">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                    }}
                />

                <div className="relative z-10 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink/15 text-pink">
                        <FiGitBranch size={15} />
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight">
                        PreviewCraft
                    </span>
                </div>

                <div className="relative z-10">
                    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-dim bg-green/10 px-3 py-1 font-mono text-[11px] text-green">
                        <FiTerminal size={12} />
                        self-hosted preview environments
                    </span>

                    <h1 className="font-display text-[42px] font-semibold leading-[1.05] tracking-tight text-ink2">
                        Spin up your
                        <br />
                        workspace.
                        <br />
                        <span className="text-pink">No shared staging.</span>
                    </h1>

                    <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
                        Create an account to connect a repo and get a live preview URL
                        for every push — built, deployed, and torn down on your own
                        infrastructure.
                    </p>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 rounded-lg border border-line bg-surface2 p-4 font-mono text-[11px]"
                >
                    <div className="mb-3 flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-pink" />
                        <span className="h-2 w-2 rounded-full bg-muted/40" />
                        <span className="h-2 w-2 rounded-full bg-green" />
                    </div>
                    <p className="flex items-center gap-2 text-green">
                        <FiCheck size={12} /> create account
                    </p>
                    <p className="mt-1.5 text-muted">→ connect a GitHub repo</p>
                    <p className="mt-1.5 text-muted">→ push to get your first preview</p>
                </motion.div>
            </div>
            <div className="flex w-full items-center justify-center px-6 py-16 lg:w-[56%]">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="w-full max-w-110 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
                >
                    <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-pink" />
                        <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green" />
                        <span className="ml-3 font-mono text-[12px] text-muted">
                            register — previewcraft
                        </span>
                    </div>

                    <div className="p-8">
                        <h2 className="font-display text-2xl font-semibold text-ink2">
                            Create your account
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            Free while self-hosted. Always open-core.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <FieldShell label="$ full name">
                                <div className="flex items-center gap-2 rounded-md border border-line bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink">
                                    <FiUser size={15} className="text-muted" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onFocus={() => handleFocus("name")}
                                        placeholder="Rohan Kumar"
                                        autoComplete="name"
                                        className="w-full bg-transparent text-sm text-ink2 outline-none placeholder:text-muted/60"
                                    />
                                </div>
                            </FieldShell>

                            <FieldShell label="$ username">
                                <div className="flex items-center gap-2 rounded-md border border-line bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink">
                                    <FiUser size={15} className="text-muted" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => handleFocus("username")}
                                        placeholder="rohankumar"
                                        autoComplete="username"
                                        className="w-full bg-transparent text-sm text-ink2 outline-none placeholder:text-muted/60"
                                    />
                                </div>
                            </FieldShell>

                            <FieldShell label="$ email">
                                <div className="flex items-center gap-2 rounded-md border border-line bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink">
                                    <FiMail size={15} className="text-muted" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => handleFocus("email")}
                                        placeholder="you@company.com"
                                        autoComplete="email"
                                        className="w-full bg-transparent text-sm text-ink2 outline-none placeholder:text-muted/60"
                                    />
                                </div>
                            </FieldShell>

                            <FieldShell label="$ password">
                                <div className="flex items-center gap-2 rounded-md border border-line bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink">
                                    <FiLock size={15} className="text-muted" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => handleFocus("password")}
                                        placeholder="••••••••••"
                                        autoComplete="new-password"
                                        className="w-full bg-transparent text-sm text-ink2 outline-none placeholder:text-muted/60"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="text-muted transition-colors hover:text-ink2"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                    </button>
                                </div>

                                {password.length > 0 && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex flex-1 gap-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <span
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${i < strength
                                                        ? strength <= 1
                                                            ? "bg-pink"
                                                            : "bg-green"
                                                        : "bg-line"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-mono text-[10px] text-muted">
                                            {STRENGTH_LABEL[strength]}
                                        </span>
                                    </div>
                                )}
                            </FieldShell>

                            <FieldShell label="$ confirm password">
                                <div
                                    className={`flex items-center gap-2 rounded-md border bg-ink px-3.5 py-2.5 transition-colors focus-within:border-pink ${confirm && confirm !== password
                                        ? "border-pink"
                                        : "border-line"
                                        }`}
                                >
                                    <FiLock size={15} className="text-muted" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="••••••••••"
                                        autoComplete="new-password"
                                        className="w-full bg-transparent text-sm text-ink2 outline-none placeholder:text-muted/60"
                                    />
                                </div>
                            </FieldShell>

                            <label className="flex items-start gap-2 font-mono text-[11px] text-muted">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-0.5 h-3.5 w-3.5 rounded-sm border border-line bg-ink accent-pink"
                                />
                                <span>
                                    I agree to the{" "}
                                    <a href="#terms" className="text-pink hover:underline">
                                        terms of service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#privacy" className="text-pink hover:underline">
                                        privacy policy
                                    </a>
                                </span>
                            </label>

                            <motion.button
                                type="submit"
                                whileTap={{ scale: 0.98 }}
                                disabled={status === "loading"}
                                className="group flex w-full items-center justify-center gap-2 rounded-md bg-pink px-4 py-2.5 font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
                            >
                                {status === "loading" ? "Provisioning..." : "Provision account"}
                                {status !== "loading" && (
                                    <FiArrowRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-0.5"
                                    />
                                )}
                            </motion.button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <span className="h-px flex-1 bg-line" />
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                                or continue with
                            </span>
                            <span className="h-px flex-1 bg-line" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleGithubAuth}
                                className="flex items-center justify-center gap-2 rounded-md border border-line bg-surface2 py-2.5 text-sm text-ink2 transition-colors hover:border-muted"
                            >
                                <FaGithub size={16} />
                                GitHub
                            </button>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="pointer-events-none flex w-full items-center justify-center gap-2 rounded-md border border-line bg-surface2 py-2.5 text-sm text-ink2 transition-colors"
                                >
                                    <FaGoogle size={16} />
                                    Google
                                </button>
                                <div className="absolute inset-0 overflow-hidden opacity-0">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => {
                                            pushLog(
                                                "✗ google authentication failed",
                                                "error"
                                            );
                                            setStatus("error");
                                            toast.error(
                                                "Google authentication failed"
                                            );
                                        }}
                                        useOneTap={false}
                                        width="500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            ref={logRef}
                            className="mt-6 h-24 space-y-1 overflow-y-auto rounded-md border border-line bg-ink px-3.5 py-3"
                        >
                            <AnimatePresence initial={false}>
                                {logs.map((log, i) => (
                                    <LogLine key={i} text={log.text} tone={log.tone} />
                                ))}
                            </AnimatePresence>
                            <span className="inline-block h-3 w-1.5 animate-pulse bg-muted/60 align-middle" />
                        </div>

                        <p className="mt-6 text-center text-sm text-muted">
                            Already have an account?{" "}
                            <Link to="/user-login" className="text-pink hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}