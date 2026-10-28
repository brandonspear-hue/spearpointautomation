import { Link } from "@tanstack/react-router";
import { Container } from "~/components/container";
import { NAV } from "~/components/nav";
import { PendingDetail } from "~/components/pending-detail";
import { site } from "~/lib/site";
import { Wordmark } from "~/components/wordmark";

/**
 * Footer (blueprint §1.2): wordmark and promise, the pages, contact details, and
 * small print. Contact sits in the same place here as in the header, on every
 * page. Details the founder has not supplied are shown as marked gaps.
 */
export function SiteFooter({ inert = false }: { inert?: boolean }) {
  return (
    <footer inert={inert} className="bg-navy-900 text-white on-navy">
      <Container>
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:py-20">
          <div>
            <Wordmark onNavy />
            <p className="type-body mt-4 max-w-xs text-white/70">{site.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="type-eyebrow text-white/60">Pages</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="type-small text-white underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="type-eyebrow text-white/60">Contact</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="type-small text-white/70">
                Email:{" "}
                {site.contactEmail ? (
                  <a href={`mailto:${site.contactEmail}`} className="text-white underline underline-offset-4">
                    {site.contactEmail}
                  </a>
                ) : (
                  <PendingDetail onNavy>public email address</PendingDetail>
                )}
              </li>
              <li className="type-small text-white/70">
                Service area:{" "}
                {site.serviceRegion ? (
                  <span className="text-white">{site.serviceRegion}</span>
                ) : (
                  <PendingDetail onNavy>service region</PendingDetail>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 py-8">
          <p className="type-small flex flex-wrap items-center gap-x-4 gap-y-2 text-white/70">
            <span>
              © {site.year}{" "}
              {site.legalName ? (
                site.legalName
              ) : (
                <PendingDetail onNavy>registered legal name</PendingDetail>
              )}
            </span>
            <span>
              Privacy:{" "}
              <PendingDetail onNavy>privacy note not yet written</PendingDetail>
            </span>
          </p>
          <p className="type-small mt-3 text-white/70">
            No client work appears on this site, and no client data is used anywhere in it.
          </p>
        </div>
      </Container>
    </footer>
  );
}
