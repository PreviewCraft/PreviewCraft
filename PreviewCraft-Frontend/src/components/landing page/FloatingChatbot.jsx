import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, ArrowUpRight } from "lucide-react";

const SUGGESTIONS = [
    "How does self-hosting work?",
    "Which frameworks do you support?",
    "What happens when I merge a PR?",
];

const CANNED_REPLIES = [
    "PreviewCraft runs entirely on your own infrastructure — install the CLI, point it at your cluster, and every push starts getting a preview URL.",
    "It auto-detects your framework at build time — Next.js, Vite, Django, Rails, and most containerized stacks work out of the box, no config needed.",
    "The moment a branch merges or closes, its environment tears itself down automatically. Nothing lingers, nothing to clean up manually.",
];

export default function FloatingChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hey — I'm the PreviewCraft assistant. Ask me anything about how preview environments work.",
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, typing]);

    const sendMessage = (text) => {
        if (!text.trim()) return;
        setMessages((m) => [...m, { role: "user", text }]);
        setInput("");
        setTyping(true);

        setTimeout(() => {
            const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
            setTyping(false);
            setMessages((m) => [...m, { role: "bot", text: reply }]);
        }, 1100);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="w-88 sm:w-96 h-120 bg-surface border border-line rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-surface2">
                            <div className="w-8 h-8 rounded-lg bg-pink/10 border border-pink/30 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-pink" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-ink2 font-medium">PreviewCraft AI</p>
                                <p className="text-xs text-green flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green inline-block" />
                                    Online
                                </p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-muted hover:text-ink2 transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`max-w-[85%] text-sm leading-relaxed rounded-lg px-4 py-2.5 ${m.role === "bot"
                                            ? "bg-surface2 text-ink2 self-start rounded-tl-sm"
                                            : "bg-pink text-ink self-end rounded-tr-sm font-medium"
                                        }`}
                                >
                                    {m.text}
                                </div>
                            ))}

                            {typing && (
                                <div className="bg-surface2 self-start rounded-lg rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }}
                                        />
                                    ))}
                                </div>
                            )}

                            {messages.length === 1 && !typing && (
                                <div className="flex flex-col gap-2 mt-1">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => sendMessage(s)}
                                            className="text-left text-xs text-muted hover:text-pink border border-line hover:border-pink/40 rounded-md px-3 py-2 transition-colors flex items-center justify-between gap-2"
                                        >
                                            {s}
                                            <ArrowUpRight className="w-3 h-3 shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage(input);
                            }}
                            className="border-t border-line p-3 flex items-center gap-2"
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about PreviewCraft..."
                                className="flex-1 bg-surface2 border border-line focus:border-pink/40 rounded-lg px-3 py-2.5 text-sm text-ink2 placeholder:text-muted outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-9 h-9 rounded-lg bg-pink text-ink flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink/90 transition-colors shrink-0"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setOpen((v) => !v)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-14 h-14 rounded-full bg-pink text-ink flex items-center justify-center shadow-lg shadow-pink/20"
                aria-label={open ? "Close chat" : "Open chat"}
            >
                {!open && (
                    <span className="absolute inset-0 rounded-full bg-pink animate-ping opacity-20" />
                )}
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <X className="w-5 h-5" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Sparkles className="w-5 h-5" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}