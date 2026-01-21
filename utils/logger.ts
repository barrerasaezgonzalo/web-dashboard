import * as Sentry from "@sentry/nextjs";

export const trackError = (error: unknown, context: string) => {
  if (!Sentry.getClient()) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      debug: false,
    });
  }
  Sentry.captureException(error, {
    tags: { context },
  });
};
