import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { IconClose, IconMenu } from "~/components/icons";
import { NAV, PRIMARY_CTA } from "~/components/nav";
import { Wordmark } from "~/components/wordmark";

/**
 * Site header (blueprint §1.2, §2.8).
 *
 * Desktop shows the five pages and one filled "Book a consultation" button. Below
 * `lg` the pages move into a panel that opens beneath the header — not a
 * full-screen takeover, so the visitor keeps their place. The panel closes on a
 * tap, on `Escape`, on an outside tap and on navigation, and focus returns to the
 * menu button. While it is open, `<main>` and the footer are made `inert` by the
 * root layout, so the keyboard cannot wander into content hidden behind it.
 */
export function SiteHeader({
  menuOpen,
  onMenuOpenChange,
}: {
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}) {
  const { pathname } = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when the visitor navigates somewhere new.
  useEffect(() => {
    onMenuOpenChange(false);
  }, [pathname, onMenuOpenChange]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onMenuOpenChange(false);
        buttonRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      onMenuOpenChange(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen, onMenuOpenChange]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory-50">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
          <Wordmark />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      className={`type-body inline-block py-2 font-medium text-navy-900 transition-colors duration-[120ms] ease-out hover:text-blue-700 ${
                        active
                          ? "underline decoration-blue-700 decoration-2 underline-offset-8"
                          : "no-underline"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <Button to={PRIMARY_CTA.to}>{PRIMARY_CTA.label}</Button>
          </div>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => onMenuOpenChange(!menuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-card border border-line bg-white text-navy-900 lg:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="panel-enter border-t border-line bg-white shadow-overlay lg:hidden"
        >
          <Container className="py-4">
            <nav aria-label="Main (mobile)">
              <ul className="flex flex-col">
                {NAV.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-12 items-center type-lead text-navy-900 ${
                          active ? "font-medium text-blue-700" : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <Button to={PRIMARY_CTA.to} className="mt-4 w-full">
              {PRIMARY_CTA.label}
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
