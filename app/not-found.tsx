import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      {/* SVG Illustration */}
      <div className="mb-8 w-full max-w-[400px]">
        <svg
          viewBox="0 0 800 600"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{ stopColor: "#0d9488", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#14b8a6", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="800" height="600" fill="none" />

          {/* Background Elements */}
          <circle cx="400" cy="300" r="250" fill="#f0fdfa" opacity="0.5" />
          <circle cx="400" cy="300" r="200" fill="#ccfbf1" opacity="0.4" />
          <circle cx="400" cy="300" r="150" fill="#99f6e4" opacity="0.3" />

          {/* 404 Text */}
          <text
            x="400"
            y="300"
            fontSize="120"
            fontWeight="bold"
            fill="url(#grad)"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            404
          </text>

          {/* Decorative Elements */}
          <path
            d="M 300 200 Q 400 100 500 200"
            stroke="#0d9488"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M 300 400 Q 400 500 500 400"
            stroke="#0d9488"
            strokeWidth="4"
            fill="none"
          />

          {/* Small Circles */}
          <circle cx="300" cy="200" r="8" fill="#0d9488" />
          <circle cx="500" cy="200" r="8" fill="#0d9488" />
          <circle cx="300" cy="400" r="8" fill="#0d9488" />
          <circle cx="500" cy="400" r="8" fill="#0d9488" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Page not found
          </h1>
          <p className="text-lg text-muted-foreground max-w-[500px]">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been removed or the link might be broken.
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/home">
              <Home className="size-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/support">
              Contact Support
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Need assistance? Our{" "}
          <Link
            href="/help"
            className="text-teal-600 hover:text-teal-700 hover:underline"
          >
            help center
          </Link>{" "}
          is always available.
        </p>
      </div>
    </div>
  );
}
