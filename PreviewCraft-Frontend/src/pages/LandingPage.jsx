import Navbar from "../components/landing page/navbar";
import Hero from "../components/landing page/Hero";
import Features from "../components/landing page/Features";
import HowItWorks from "../components/landing page/Howitworks";
import PreviewCard from "../components/landing page/Previewcard";
import CTA from "../components/landing page/Cta";
import Footer from "../components/landing page/Footer";
import TechStack from "../components/landing page/TechStack";
import FloatingChatbot from "../components/landing page/FloatingChatbot";

export default function LandingPage() {
    return (
        <div className="bg-ink font-body min-h-screen selection:bg-pink/30 selection:text-ink2">
            <Navbar />
            <main>
                <Hero />
                <TechStack/>
                <Features />
                <HowItWorks />
                <PreviewCard />
                <CTA />
            </main>
            <Footer />
            <FloatingChatbot />
        </div>
    );
}