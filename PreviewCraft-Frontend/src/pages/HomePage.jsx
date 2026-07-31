import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiGitBranch, FiLogOut, FiUser, FiMail, FiTerminal } from "react-icons/fi";
import { getCurrentUser, logoutUser } from "../api/authApi.js";

export default function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => setUser(res?.data?.data))
            .catch(() => {
                toast.error("Session expired, please sign in again.");
                navigate("/user-login");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success("Logged out");
        } catch {
            // clear client-side regardless of API result
        } finally {
            navigate("/user-login");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-ink font-mono text-sm text-muted">
                → loading workspace...
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-ink font-body text-ink2">
            <header className="flex items-center justify-between border-b border-line px-8 py-5">
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink/15 text-pink">
                        <FiGitBranch size={15} />
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight">PreviewCraft</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-md border border-line bg-surface2 px-3.5 py-2 text-sm text-ink2 transition-colors hover:border-muted"
                >
                    <FiLogOut size={14} />
                    Sign out
                </button>
            </header>

            <main className="mx-auto max-w-3xl px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
                >
                    <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-pink" />
                        <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green" />
                        <span className="ml-3 font-mono text-[12px] text-muted">dashboard — previewcraft</span>
                    </div>

                    <div className="p-8">
                        <div className="flex items-center gap-4">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.fullname}
                                    className="h-14 w-14 rounded-full border border-line object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface2 text-muted">
                                    <FiUser size={22} />
                                </div>
                            )}
                            <div>
                                <h1 className="font-display text-xl font-semibold text-ink2">
                                    Welcome back, {user?.fullname || user?.username}
                                </h1>
                                <p className="flex items-center gap-1.5 text-sm text-muted">
                                    <FiMail size={13} />
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 rounded-lg border border-line bg-ink px-4 py-3.5 font-mono text-[12px] text-muted">
                            <p className="flex items-center gap-2 text-green">
                                <FiTerminal size={12} /> session active
                            </p>
                            <p className="mt-1.5">username: {user?.username}</p>
                            <p className="mt-1.5">verified: {String(user?.isEmailVerified)}</p>
                        </div>

                        <p className="mt-8 text-sm text-muted">
                            This is a placeholder home screen. Hook up repo connections and preview environments
                            here.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}