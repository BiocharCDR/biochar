import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="flex h-16 items-center justify-between border-b px-4 lg:px-8">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <img src="/logo-2.png" alt="GreenA" className="h-8 w-auto" />
          <nav className="hidden gap-6 text-sm lg:flex">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground"
            >
              About
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center lg:px-8">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Simplify Your{" "}
            <span className="  text-brand-primary">Green Building</span>{" "}
            Certification
          </h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">
            Streamline your sustainability consulting workflow with automated
            documentation, real-time progress tracking, and AI-powered insights.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="h-12 px-8">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </div>
          <p>© {new Date().getFullYear()} GreenA. All rights reserved.</p>
          <p className="text-xs">
            Powered by{" "}
            <span className="font-medium text-teal-600">sustAIn</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
