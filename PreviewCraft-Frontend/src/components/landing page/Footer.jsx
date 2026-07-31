import { MessageSquare, Boxes } from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const COLUMNS = [
    {
        title: "Project",
        links: [
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Tech Stack", href: "#tech-stack" },
        ],
    },
    {
        title: "Explore",
        links: [
            {
                label: "GitHub Repository",
                href: "https://github.com/PreviewCraft/PreviewCraft",
            },
            { label: "Documentation", href: "https://github.com/PreviewCraft/PreviewCraft" },
            { label: "Deployments", href: "https://github.com/PreviewCraft/PreviewCraft" },
            { label: "Roadmap", href: "https://github.com/PreviewCraft/PreviewCraft" },
        ],
    },
    {
        title: "Developers",
        links: [
            { label: "Radhika Gupta", href: "https://radhika-gupta-portfolio.vercel.app/" },
            { label: "Khushi Goel", href: "KHUSHI_PORTFOLIO_URL" },
            { label: "Our Contributions", href: "https://github.com/PreviewCraft/PreviewCraft" },
        ],
    },
    {
        title: "Connect",
        links: [
            {
                label: "GitHub — Radhika Gupta",
                href: "https://github.com/Radhikagupta25",
            },
            {
                label: "LinkedIn — Radhika Gupta",
                href: "https://www.linkedin.com/in/radhika-gupta-596296290",
            },
            {
                label: "GitHub — Khushi Goel",
                href: "https://github.com/khushigoel44-afk",
            },
            {
                label: "LinkedIn — Khushi Goel",
                href: "https://www.linkedin.com/in/radhika-gupta-596296290",
            },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="px-6 pt-20 pb-10 border-t border-line">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-[1.5fr_repeat(4,1fr)] gap-10 pb-14">
                    <div>
                        <a
                            href="#"
                            className="flex items-center gap-2 font-display font-semibold text-ink2 text-lg"
                        >
                            <span className="w-7 h-7 rounded-md bg-pink/10 border border-pink/30 flex items-center justify-center">
                                <Boxes
                                    className="w-4 h-4 text-pink"
                                    strokeWidth={2.2}
                                />
                            </span>
                            PreviewCraft
                        </a>

                        <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
                            A self-hosted deployment platform built to turn GitHub pushes
                            into live preview deployments.
                        </p>

                        <div className="flex items-center gap-4 mt-6">
                            <a
                                href="https://github.com/PreviewCraft/PreviewCraft"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted hover:text-ink2 transition-colors"
                                aria-label="GitHub"
                            >
                                <FaGithub className="w-4 h-4" />
                            </a>
                            <a
                                href="#contributions"
                                className="text-muted hover:text-ink2 transition-colors"
                                aria-label="Contact"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xs font-mono text-muted tracking-widest uppercase mb-4">
                                {col.title}
                            </h4>

                            <ul className="flex flex-col gap-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            target={
                                                link.href.startsWith("http")
                                                    ? "_blank"
                                                    : undefined
                                            }
                                            rel={
                                                link.href.startsWith("http")
                                                    ? "noopener noreferrer"
                                                    : undefined
                                            }
                                            className="text-sm text-muted hover:text-ink2 transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-line pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted font-mono">
                        © {new Date().getFullYear()} PreviewCraft. Built by Radhika Gupta & Khushi Goel.
                    </p>
                </div>
            </div>
        </footer>
    );
}