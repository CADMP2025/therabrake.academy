/**
 * Environment configuration helpers
 */

export interface EnvConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  apiUrl: string
  stripePublishableKey?: string
  sentryDsn?: string
  environment: 'development' | 'staging' | 'production'
}

/**
 * Validate required environment variables
 */
export function validateEnv(config: Partial<EnvConfig>): EnvConfig {
  const required = ['supabaseUrl', 'supabaseAnonKey', 'apiUrl']
  
  for (const key of required) {
    if (!config[key as keyof EnvConfig]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }

  return {
    supabaseUrl: config.supabaseUrl!,
    supabaseAnonKey: config.supabaseAnonKey!,
    apiUrl: config.apiUrl!,
    stripePublishableKey: config.stripePublishableKey,
    sentryDsn: config.sentryDsn,
    environment: config.environment || 'development',
  }
}

/**
 * Get API URL with version
 */
export function getApiUrl(baseUrl: string, version: string = 'v1'): string {
  return `${baseUrl}/api/${version}`
}

/**
 * Check if running in development
 */
export function isDevelopment(env: string): boolean {
  return env === 'development'
}

/**
 * Check if running in production
 */
export function isProduction(env: string): boolean {
  return env === 'production'
}
