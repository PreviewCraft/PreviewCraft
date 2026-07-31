import Reveal from "./Reveal";

const STEPS = [
    {
        n: "01",
        title: "Push",
        desc: "Open a PR or push a commit. PreviewCraft's GitHub App picks it up instantly — no CI config to write.",
    },
    {
        n: "02",
        title: "Build",
        desc: "Your app is built inside an isolated container on your own infrastructure, using the framework it detects.",
    },
    {
        n: "03",
        title: "Preview",
        desc: "A live URL is posted straight to the pull request. Reviewers click it — no local setup, no guessing.",
    },
    {
        n: "04",
        title: "Merge & teardown",
        desc: "Merge or close the branch and the environment tears itself down automatically. Nothing lingers, nothing to bill.",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="px-6 py-28 bg-surface/40 border-y border-line">
            <div className="max-w-6xl mx-auto">
                <Reveal className="max-w-xl mb-16">
                    <span className="text-xs font-mono text-green tracking-widest uppercase">Pipeline</span>
                    <h2 className="mt-4 font-display text-4xl text-ink2 font-semibold tracking-tight">
                        From push to live preview, on autopilot.
                    </h2>
                </Reveal>

                <div className="grid md:grid-cols-4 gap-8">
                    {STEPS.map((s, i) => (
                        <Reveal key={s.n} delay={i * 0.1} className="relative">
                            <div className="font-mono text-sm text-pink mb-4">{s.n}</div>
                            <h3 className="font-display text-xl text-ink2 font-medium mb-2">{s.title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                            {i < STEPS.length - 1 && (
                                <div className="hidden md:block absolute top-1.5 right-4 w-8 h-px bg-line" />
                            )}
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}