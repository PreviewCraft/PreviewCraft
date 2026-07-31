import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
    SiDocker,
    SiPython,
    SiGo,
    SiRust,
    SiReact,
    SiNodedotjs,
} from "react-icons/si";

const SCATTERED = [
    { icon: SiDocker, className: "top-2 left-6 md:left-16", tone: "text-pink bg-pink/10" },
    { icon: SiPython, className: "top-10 right-8 md:right-20", tone: "text-green bg-green/10" },
    { icon: SiGo, className: "bottom-6 left-10 md:left-24", tone: "text-green bg-green/10" },
    { icon: SiRust, className: "bottom-2 right-4 md:right-16", tone: "text-pink bg-pink/10" },
    { icon: SiReact, className: "top-1/2 -left-2 hidden md:flex", tone: "text-pink bg-pink/10" },
    { icon: SiNodedotjs, className: "top-1/2 -right-2 hidden md:flex", tone: "text-green bg-green/10" },
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const badge = {
    hidden: { opacity: 0, scale: 0.4 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CTA() {
    return (
        <section className="px-6 py-28">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={container}
                className="max-w-4xl mx-auto text-center bg-surface border border-line rounded-2xl px-10 py-16 relative overflow-hidden"
            >
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink/10 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green/10 blur-3xl rounded-full pointer-events-none" />

                {SCATTERED.map(({ icon: Icon, className, tone }, i) => (
                    <motion.div
                        key={i}
                        variants={badge}
                        className={`absolute w-11 h-11 rounded-lg items-center justify-center border border-line animate-float ${className} ${tone}`}
                        style={{ display: className.includes("hidden") ? undefined : "flex", animationDelay: `${i * 0.4}s` }}
                    >
                        <Icon className="w-5 h-5" />
                    </motion.div>
                ))}

                <h2 className="relative font-display text-4xl md:text-5xl text-ink2 font-semibold tracking-tight leading-tight">
                    Stop waiting on staging.
                    <br />
                    Ship a preview instead.
                </h2>
                <p className="relative mt-5 text-muted max-w-md mx-auto">
                    Self-host PreviewCraft in five minutes, or let us run it for you.
                    Either way, your next push gets its own URL.
                </p>
                <a
                    href="#"
                    className="relative mt-9 inline-flex items-center gap-2 bg-pink text-ink font-medium px-7 py-3 rounded-md hover:bg-pink/90 transition-colors"
                >
                    Deploy your first preview
                    <ArrowRight className="w-4 h-4" />
                </a>
            </motion.div>
        </section>
    );
}