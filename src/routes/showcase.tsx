import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The old address for the examples page.
 *
 * The page moved to /examples when it stopped being a catalogue of products.
 * This route exists only to send an old link onward, so nobody lands on a 404.
 * Nothing links here.
 */
export const Route = createFileRoute("/showcase")({
  beforeLoad: () => {
    throw redirect({ to: "/examples" });
  },
});
