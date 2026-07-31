import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, GitBranch } from "lucide-react";

const LOG_LINES = [
    { text: "$ git push origin feature/checkout-redesign", type: "cmd" },
    { text: "→ Detected Next.js project", type: "info" },
    { text: "→ Building container...", type: "info" },
    { text: "✓ Build complete in 12.4s", type: "ok" },
    { text: "✓ Preview environment deployed", type: "ok" },
    { text: "https://checkout-redesign-a3f2.previewcraft.dev", type: "url" },
];

export default function Hero() {
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        if (visibleLines >= LOG_LINES.length) {
            const reset = setTimeout(() => setVisibleLines(0), 2600);
            return () => clearTimeout(reset);
        }
        const t = setTimeout(() => setVisibleLines((v) => v + 1), visibleLines === 0 ? 500 : 550);
        return () => clearTimeout(t);
    }, [visibleLines]);

    return (
        <section className="relative pt-40 pb-28 px-6 overflow-hidden bg-grid-fade">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-green bg-green/10 border border-green/20 px-3 py-1 rounded-full mb-6">
                        <GitBranch className="w-3.5 h-3.5" />
                        Self-hosted preview environments
                    </div>

                    <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight text-ink2 font-semibold">
                        Push code.
                        <br />
                        Get a live URL.
                        <br />
                        <span className="text-pink">Every single time.</span>
                    </h1>

                    <p className="mt-6 text-lg text-muted max-w-md leading-relaxed">
                        PreviewCraft builds, deploys, and tears down a full preview
                        environment for every GitHub push — running entirely on your own
                        infrastructure. No shared staging. No waiting your turn.
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row gap-4">
                        <a
                            href="#"
                            className="group flex items-center justify-center gap-2 bg-pink text-ink font-medium px-6 py-3 rounded-md hover:bg-pink/90 transition-colors"
                        >
                            Deploy your first preview
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                        <a
                            href="#"
                            className="flex items-center justify-center gap-2 border border-line text-ink2 font-medium px-6 py-3 rounded-md hover:border-muted transition-colors"
                        >
                            Self-host in 5 minutes
                        </a>
                    </div>

                    <p className="mt-5 text-xs text-muted font-mono">
                        open-core · runs on your infra · no vendor lock-in
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="relative"
                >
                    <div className="absolute -inset-6 bg-pink/5 blur-3xl rounded-full pointer-events-none" />
                    <div className="relative bg-surface border border-line rounded-xl shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-line bg-surface2">
                            <span className="w-2.5 h-2.5 rounded-full bg-pink/40" />
                            <span className="w-2.5 h-2.5 rounded-full bg-muted/30" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green/40" />
                            <span className="ml-3 text-xs text-muted font-mono">deploy — previewcraft</span>
                        </div>
                        <div className="p-6 font-mono text-sm min-h-65 flex flex-col gap-2.5">
                            {LOG_LINES.slice(0, visibleLines).map((line, i) => (
                                <div
                                    key={i}
                                    className={
                                        line.type === "cmd"
                                            ? "text-ink2"
                                            : line.type === "ok"
                                                ? "text-green flex items-center gap-2"
                                                : line.type === "url"
                                                    ? "text-pink underline underline-offset-4"
                                                    : "text-muted"
                                    }
                                >
                                    {line.type === "ok" && <Check className="w-3.5 h-3.5 shrink-0" />}
                                    {line.text}
                                </div>
                            ))}
                            <span className="w-2 h-4 bg-pink/70 animate-pulse mt-1" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}