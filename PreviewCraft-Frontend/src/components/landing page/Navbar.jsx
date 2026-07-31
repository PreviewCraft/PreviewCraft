import { useState, useEffect } from "react";
import { Menu, X, Boxes } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const LINKS = [
    { label: "Product", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Docs", href: "/docs" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const goTo = (path) => {
        setOpen(false);
        navigate(path);
    };

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? "bg-ink/90 backdrop-blur-0 border-b border-line" : "bg-transparent border-b border-transparent"
                }`}
        >
            <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
                <Link to="/" className="flex items-center gap-2 font-display font-semibold text-ink2 text-lg tracking-tight">
                    <span className="w-7 h-7 rounded-md bg-pink/10 border border-pink/30 flex items-center justify-center">
                        <Boxes className="w-4 h-4 text-pink" strokeWidth={2.2} />
                    </span>
                    PreviewCraft
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {LINKS.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            className="text-sm text-muted hover:text-ink2 transition-colors"
                        >
                            {l.label}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="https://github.com/PreviewCraft/PreviewCraft"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-muted hover:text-ink2 transition-colors"
                    >
                        <FaGithub className="w-4 h-4" />
                        Star on GitHub
                    </a>
                    <button
                        onClick={() => {
                            console.log("SIGN IN CLICKED");
                            navigate("/user-login")
                        }}
                        className="text-sm text-ink2 border border-line hover:border-muted px-4 py-2 rounded-md transition-colors"
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => navigate("/user-register")}
                        className="text-sm font-medium text-ink bg-pink hover:bg-pink/90 px-4 py-2 rounded-md transition-colors"
                    >
                        Get started
                    </button>
                </div>

                <button
                    className="md:hidden text-ink2"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {open && (
                <div className="md:hidden bg-ink border-t border-line px-6 py-4 flex flex-col gap-4">
                    {LINKS.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="text-sm text-muted hover:text-ink2"
                        >
                            {l.label}
                        </a>
                    ))}
                    <button
                        onClick={() => goTo("/user-login")}
                        className="text-sm text-ink2 border border-line px-4 py-2 rounded-md text-center"
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => goTo("/user-register")}
                        className="text-sm font-medium text-ink bg-pink px-4 py-2 rounded-md text-center"
                    >
                        Get started
                    </button>
                </div>
            )}
        </header>
    );
}