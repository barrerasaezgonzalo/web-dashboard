import * as Sentry from "@sentry/nextjs";
import { initSentry } from "@/lib/sentry-client";

export const trackError = (error: unknown, context: string) => {
  initSentry();
  Sentry.captureException(error, {
    tags: { context },
  });
};
