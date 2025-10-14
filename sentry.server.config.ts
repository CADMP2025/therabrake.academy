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
      const data = event.request.data;
      if (typeof data === 'object') {
        delete data.password;
        delete data.token;
        delete data.apiKey;
        delete data.secret;
      }
    }
    
    return event;
  },
});
