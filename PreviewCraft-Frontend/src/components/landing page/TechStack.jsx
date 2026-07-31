import { motion } from "framer-motion";
import {
    SiNextdotjs,
    SiVite,
    SiDjango,
    SiRubyonrails,
    SiDocker,
    SiNodedotjs,
    SiPython,
    SiGo,
    SiRust,
    SiReact,
    SiVuedotjs,
    SiSvelte,
} from "react-icons/si";

const STACK = [
    { icon: SiNextdotjs, name: "Next.js", tone: "neutral" },
    { icon: SiVite, name: "Vite", tone: "pink" },
    { icon: SiDjango, name: "Django", tone: "green" },
    { icon: SiRubyonrails, name: "Rails", tone: "neutral" },
    { icon: SiDocker, name: "Docker", tone: "pink" },
    { icon: SiNodedotjs, name: "Node.js", tone: "green" },
    { icon: SiPython, name: "Python", tone: "neutral" },
    { icon: SiGo, name: "Go", tone: "pink" },
    { icon: SiRust, name: "Rust", tone: "green" },
    { icon: SiReact, name: "React", tone: "neutral" },
    { icon: SiVuedotjs, name: "Vue", tone: "pink" },
    { icon: SiSvelte, name: "Svelte", tone: "green" },
];

const TONE_CLASSES = {
    neutral: "bg-surface2 text-ink2",
    pink: "bg-pink/10 text-pink",
    green: "bg-green/10 text-green",
};

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

const item = {
    hidden: { opacity: 0, scale: 0.5, y: 12 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function TechStack() {
    return (
        <section className="px-6 py-28 overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
                <span className="text-xs font-mono text-green tracking-widest uppercase">
                    Framework-agnostic
                </span>
                <h2 className="mt-4 font-display text-4xl text-ink2 font-semibold tracking-tight">
                    Whatever your stack, it gets a preview.
                </h2>
                <p className="mt-4 text-muted max-w-md mx-auto">
                    PreviewCraft detects your build automatically. No config files to
                    write, no build commands to guess.
                </p>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    className="mt-16 flex flex-wrap justify-center gap-4 max-w-3xl mx-auto"
                >
                    {STACK.map(({ icon: Icon, name, tone }, i) => (
                        <motion.div key={name} variants={item} className="group">
                            <div
                                className="animate-float"
                                style={{ animationDelay: `${(i % 6) * 0.3}s` }}
                            >
                                <div
                                    className={`w-16 h-16 rounded-xl flex items-center justify-center border border-line group-hover:border-pink/40 group-hover:-rotate-6 transition-all duration-300 ${TONE_CLASSES[tone]}`}
                                    title={name}
                                >
                                    <Icon className="w-7 h-7" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}