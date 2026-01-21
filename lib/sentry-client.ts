import * as Sentry from "@sentry/nextjs";

export const initSentry = () => {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  if (!Sentry.getClient()) {
    Sentry.init({
      dsn: dsn,
      tracesSampleRate: 1.0,
      debug: false,
    });
  }
};
