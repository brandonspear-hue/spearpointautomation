import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { useCallback, useState, type ReactNode } from "react";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import appCss from "~/styles/app.css?url";

const DEFAULT_DESCRIPTION =
  "Spearpoint Automation builds custom AI applications and automations on the accounting, email, CRM and commerce systems a small business already runs. We build it, you own it, and support is optional.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Spearpoint Automation — custom AI solutions for small businesses" },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { property: "og:site_name", content: "Spearpoint Automation" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Spearpoint Automation — custom AI solutions for small businesses" },
      { property: "og:description", content: DEFAULT_DESCRIPTION },
    ],
    links: [
      // Space Grotesk (blueprint §2.2). Preconnected and swapped, so a slow font
      // never blocks the page and the fallback stack keeps it legible if it fails.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Stable identity: the header closes itself on navigation, and a callback that
  // was recreated on every render would re-run that effect and shut the menu
  // again the moment it opened.
  const handleMenuOpenChange = useCallback((open: boolean) => setMenuOpen(open), []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col bg-ivory-50 text-navy-900">
        {/* First in tab order, visible when focused (blueprint §2.7). */}
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader menuOpen={menuOpen} onMenuOpenChange={handleMenuOpenChange} />
        <main id="content" tabIndex={-1} inert={menuOpen} className="flex-1">
          {children}
        </main>
        <SiteFooter inert={menuOpen} />
        <Scripts />
      </body>
    </html>
  );
}

/** 404 (blueprint §2.10): honest, short, and it offers real ways onward. */
function NotFoundPage() {
  return (
    <div className="bg-navy-900 text-white on-navy">
      <Container className="py-24 lg:py-32">
        <p className="type-eyebrow text-white/60">Page not found</p>
        <h1 className="type-h1 mt-4 max-w-2xl">That page isn&apos;t here.</h1>
        <p className="type-lead measure mt-4 text-white/80">
          The link may be out of date, or the page may have moved. Nothing is broken on your
          side.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button to="/" variant="onNavy">
            Home
          </Button>
          <Button to="/showcase" variant="onNavy">
            Solutions
          </Button>
          <Button to="/contact" variant="onNavy">
            Contact
          </Button>
        </div>
      </Container>
    </div>
  );
}

/** Error boundary (blueprint §2.10): plain apology, no stack trace. */
function ErrorPage() {
  return (
    <Container className="py-24 lg:py-32">
      <p className="type-eyebrow text-ink-muted">Something went wrong</p>
      <h1 className="type-h1 mt-4 max-w-2xl">This page didn&apos;t load.</h1>
      <p className="type-lead measure mt-4 text-ink-muted">
        Sorry — that is our fault, not yours. Nothing you typed was sent anywhere. You can try
        again, or write to us from the contact page.
      </p>
      <p className="mt-8">
        <Link to="/contact" className="text-link type-body">
          Go to the contact page
        </Link>
      </p>
    </Container>
  );
}
