/**
 * The one place the booking address is written down.
 *
 * The founder supplied this Microsoft Bookings page. If the address ever
 * changes, change it here and every button, embed and fallback on the site
 * follows — nothing else needs editing.
 *
 * Two forms of the same page:
 *  - BOOKING_URL is the ordinary link, opened in a new tab.
 *  - BOOKING_EMBED_URL is the variant Microsoft supplies for embedding in an
 *    iframe (`?ismsaljsauthenabled=true`), used inside the card on /book.
 */
export const BOOKING_URL =
  "https://bookings.cloud.microsoft/book/SpearpointAutomation1@spearpointautomation.com/";

export const BOOKING_EMBED_URL = `${BOOKING_URL}?ismsaljsauthenabled=true`;
