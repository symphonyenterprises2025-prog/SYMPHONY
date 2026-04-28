'use client'

export class AnalyticsClient {
  static track(event: string, properties?: Record<string, any>) {
    // TODO: Implement client-side analytics (PostHog, GA4, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', event, properties)
    }
  }

  static identify(userId: string, properties?: Record<string, any>) {
    // TODO: Implement user identification
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('set', 'user_id', userId)
    }
  }

  static pageView(path: string) {
    this.track('page_view', { path })
  }
}
