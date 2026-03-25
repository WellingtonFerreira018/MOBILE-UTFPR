type EventProperties = Record<string, string | number | boolean>;

class AnalyticsService {
  private isEnabled: boolean = true;

  enable(): void {
    this.isEnabled = true;
    console.log("[Analytics] Service enabled");
  }

  disable(): void {
    this.isEnabled = false;
    console.log("[Analytics] Service disabled");
  }

  logEvent(eventName: string, properties?: EventProperties): void {
    if (!this.isEnabled) {
      return;
    }

    const timestamp = new Date().toISOString();
    const eventData = {
      event: eventName,
      timestamp,
      properties: properties || {},
    };

    console.log("[Analytics] Event logged:", JSON.stringify(eventData, null, 2));
  }

  logScreenView(screenName: string): void {
    this.logEvent("screen_view", { screen_name: screenName });
  }

  logUserAction(action: string, details?: EventProperties): void {
    this.logEvent("user_action", { action, ...details });
  }

  logError(errorMessage: string, errorCode?: string): void {
    this.logEvent("error", {
      message: errorMessage,
      code: errorCode || "unknown",
    });
  }
}

export const analyticsService = new AnalyticsService();
