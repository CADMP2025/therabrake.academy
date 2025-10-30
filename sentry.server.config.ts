import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: false,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
  
  beforeSend(event) {
    // Remove sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.data?.password) delete breadcrumb.data.password;
        if (breadcrumb.data?.token) delete breadcrumb.data.token;
        if (breadcrumb.data?.apiKey) delete breadcrumb.data.apiKey;
        return breadcrumb;
      });
    }
    
    // Remove sensitive request data
    if (event.request?.data) {
      const raw = event.request.data as unknown;
      if (raw && typeof raw === 'object') {
        const data = raw as Record<string, unknown>;
        delete (data as any).password;
        delete (data as any).token;
        delete (data as any).apiKey;
        delete (data as any).secret;
        event.request.data = data as any;
      }
    }
    
    return event;
  },
});
