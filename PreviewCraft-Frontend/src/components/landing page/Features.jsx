import { motion } from "framer-motion";
import { Zap, Server, Boxes, RefreshCw, Terminal, GitBranch } from "lucide-react";
import Reveal from "./Reveal";

const FEATURES = [
    {
        icon: Zap,
        title: "Instant preview URLs",
        desc: "Every push spins up a live, shareable URL in seconds — no manual deploy step, no waiting on a shared staging slot.",
        accent: "pink",
    },
    {
        icon: Server,
        title: "Runs on your infrastructure",
        desc: "Self-hosted by design. PreviewCraft deploys inside your own cloud or bare metal — your code never leaves your network.",
        accent: "green",
    },
    {
        icon: Boxes,
        title: "Framework-agnostic builds",
        desc: "Auto-detects Next.js, Vite, Django, Rails, and more. If it builds in a container, PreviewCraft can preview it.",
        accent: "pink",
    },
    {
        icon: RefreshCw,
        title: "Ephemeral by default",
        desc: "Preview environments tear themselves down automatically once a branch merges or goes stale — nothing to clean up.",
        accent: "green",
    },
    {
        icon: Terminal,
        title: "Full build logs, live",
        desc: "Stream build and runtime logs in real time, right where your team already looks — the PR itself.",
        accent: "pink",
    },
    {
        icon: GitBranch,
        title: "Branch-based routing",
        desc: "Every branch gets a predictable subdomain. Point custom domains at any preview when a stakeholder needs the real thing.",
        accent: "green",
    },
];

export default function Features() {
    return (
        <section id="features" className="px-6 py-28">
            <div className="max-w-6xl mx-auto">
                <Reveal className="max-w-xl mb-16">
                    <span className="text-xs font-mono text-pink tracking-widest uppercase">Product</span>
                    <h2 className="mt-4 font-display text-4xl text-ink2 font-semibold tracking-tight">
                        Everything a preview needs, nothing you have to babysit.
                    </h2>
                </Reveal>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-line rounded-xl overflow-hidden border border-line"
                >
                    {FEATURES.map(({ icon: Icon, title, desc, accent }) => (
                        <motion.div
                            key={title}
                            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                            transition={{ duration: 0.5 }}
                            className="bg-surface p-8 hover:bg-surface2 transition-colors"
                        >
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${accent === "pink" ? "bg-pink/10 text-pink" : "bg-green/10 text-green"
                                    }`}
                            >
                                <Icon className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <h3 className="font-display text-lg text-ink2 font-medium mb-2">{title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}