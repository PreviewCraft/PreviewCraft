import { GitPullRequest, Check, ExternalLink, Clock } from "lucide-react";
import Reveal from "./Reveal";

export default function PreviewCard() {
    return (
        <section className="px-6 py-28">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <Reveal>
                    <span className="text-xs font-mono text-pink tracking-widest uppercase">In the PR</span>
                    <h2 className="mt-4 font-display text-4xl text-ink2 font-semibold tracking-tight leading-tight">
                        Reviewers click a link.
                        <br />
                        They don't pull a branch.
                    </h2>
                    <p className="mt-6 text-muted leading-relaxed max-w-md">
                        PreviewCraft comments directly on the pull request with a live
                        environment, build status, and deploy time — so design, product,
                        and QA can review the real thing before a single line gets
                        approved.
                    </p>
                </Reveal>

                <Reveal delay={0.15} className="bg-surface border border-line rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-line">
                        <GitPullRequest className="w-4 h-4 text-muted" />
                        <span className="text-sm text-ink2 font-medium">
                            Redesign checkout summary layout
                        </span>
                        <span className="ml-auto text-xs font-mono text-muted">#482</span>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-green/10 border border-green/30 flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-green" />
                            </div>
                            <div className="text-sm">
                                <span className="text-ink2 font-medium">previewcraft</span>
                                <span className="text-muted"> bot commented</span>
                            </div>
                        </div>

                        <div className="bg-surface2 border border-line rounded-lg p-5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono text-green flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" /> Build succeeded
                                </span>
                                <span className="text-xs font-mono text-muted flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> 12.4s
                                </span>
                            </div>

                            <a
                                href="#"
                                className="flex items-center justify-between bg-ink border border-line rounded-md px-4 py-3 hover:border-pink/40 transition-colors group"
                            >
                                <span className="text-sm font-mono text-pink truncate">
                                    checkout-summary-482.previewcraft.dev
                                </span>
                                <ExternalLink className="w-4 h-4 text-muted group-hover:text-pink transition-colors shrink-0 ml-3" />
                            </a>

                            <p className="mt-4 text-xs text-muted font-mono">
                                commit 7a3f21c · deployed 2 minutes ago · expires on merge
                            </p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}