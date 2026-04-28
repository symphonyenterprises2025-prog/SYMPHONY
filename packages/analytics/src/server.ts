export class AnalyticsServer {
  static trackEvent(event: string, properties?: Record<string, any>) {
    console.log('Server event:', event, properties)
  }

  static identify(userId: string, properties?: Record<string, any>) {
    console.log('Identify user:', userId, properties)
  }
}
