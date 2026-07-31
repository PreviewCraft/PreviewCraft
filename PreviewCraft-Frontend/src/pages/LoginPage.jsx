import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiGitBranch,
    FiTerminal,
} from "react-icons/fi";
import { FaGithub, FaGoogle } from "react-icons/fa";


const INITIAL_LOGS = [
    { text: "$ previewcraft auth --init", tone: "cmd" },
    { text: "→ waiting for credentials...", tone: "muted" },
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

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [status, setStatus] = useState("idle"); 
    const loggedFocus = useRef({ email: false, password: false });
    const logRef = useRef(null);

    const pushLog = (text, tone = "muted") =>
        setLogs((prev) => [...prev, { text, tone }]);

    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    }, [logs]);

    const handleFocus = (field) => {
        if (loggedFocus.current[field]) return;
        loggedFocus.current[field] = true;
        pushLog(
            field === "email" ? "→ reading email input..." : "→ reading password input...",
            "muted"
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            pushLog("✗ missing credentials", "error");
            setStatus("error");
            return;
        }
        setStatus("loading");
        pushLog("→ verifying credentials...", "muted");
        setTimeout(() => {
            pushLog("✓ session authenticated", "ok");
            pushLog(`✓ redirecting to dashboard as ${email}`, "ok");
            setStatus("ok");
            setTimeout(() => navigate("/"), 500);
        }, 1100);
    };

    const handleOAuth = (provider) => {
        pushLog(`$ previewcraft auth --provider=${provider}`, "cmd");
        pushLog(`→ opening ${provider} oauth handshake...`, "muted");
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

                <Link to="/" className="relative z-10 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink/15 text-pink">
                        <FiGitBranch size={15} />
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight">
                        PreviewCraft
                    </span>
                </Link>

                <div className="relative z-10">
                    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-dim bg-green/10 px-3 py-1 font-mono text-[11px] text-green">
                        <FiTerminal size={12} />
                        self-hosted preview environments
                    </span>

                    <h1 className="font-display text-[42px] font-semibold leading-[1.05] tracking-tight text-ink2">
                        Authenticate.
                        <br />
                        Ship the preview.
                        <br />
                        <span className="text-pink">Every single time.</span>
                    </h1>

                    <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
                        Sign in to spin up isolated, full-stack preview environments for
                        every branch — built, deployed, and torn down on your own
                        infrastructure.
                    </p>
                </div>

                {/* mini animated deploy strip, echoes the landing-page terminal */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 rounded-lg border border-line bg-surface2 p-4 font-mono text-[11px] text-muted"
                >
                    <div className="mb-3 flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-pink" />
                        <span className="h-2 w-2 rounded-full bg-muted/40" />
                        <span className="h-2 w-2 rounded-full bg-green" />
                    </div>
                    <p className="text-ink2">$ git push origin main</p>
                    <p className="mt-1 text-green">✓ preview live at pr-142.previewcraft.dev</p>
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
                            login — previewcraft
                        </span>
                    </div>

                    <div className="p-8">
                        <h2 className="font-display text-2xl font-semibold text-ink2">
                            Sign in
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            Pick up where your last deploy left off.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
                                        autoComplete="current-password"
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
                            </FieldShell>

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 font-mono text-[11px] text-muted">
                                    <input
                                        type="checkbox"
                                        className="h-3.5 w-3.5 rounded-sm border border-line bg-ink accent-pink"
                                    />
                                    remember this device
                                </label>
                                <a
                                    href="#forgot-password"
                                    className="font-mono text-[11px] text-pink hover:underline"
                                >
                                    forgot password?
                                </a>
                            </div>

                            <motion.button
                                type="submit"
                                whileTap={{ scale: 0.98 }}
                                disabled={status === "loading"}
                                className="group flex w-full items-center justify-center gap-2 rounded-md bg-pink px-4 py-2.5 font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
                            >
                                {status === "loading" ? "Authenticating..." : "Deploy session"}
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
                                or authenticate with
                            </span>
                            <span className="h-px flex-1 bg-line" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleOAuth("github")}
                                className="flex items-center justify-center gap-2 rounded-md border border-line bg-surface2 py-2.5 text-sm text-ink2 transition-colors hover:border-muted"
                            >
                                <FaGithub size={16} />
                                GitHub
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuth("google")}
                                className="flex items-center justify-center gap-2 rounded-md border border-line bg-surface2 py-2.5 text-sm text-ink2 transition-colors hover:border-muted"
                            >
                                <FaGoogle size={15} />
                                Google
                            </button>
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
                            No account yet?{" "}
                            <Link to="/user-register" className="text-pink hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}