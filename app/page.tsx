import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import ToolSection from "./components/landing/ToolSection";
import Dashboard from "./components/landing/Dashboard";
import Footer from "./components/landing/Footer";
import AuthRedirect from "./components/landing/AuthRedirect";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AuthRedirect />
      <Navbar />
      <main>
        <Hero />  
        <Dashboard />
        <ToolSection />
      </main>
      <Footer />
    </div>
  );
}
