/**
 * Funnel analytics (blueprint §17). Events go to the GTM dataLayer;
 * GA4 tags are configured inside the GTM container (NEXT_PUBLIC_GTM_ID).
 */

export type FunnelEvent =
  | "topic_selected"
  | "calculator_started"
  | "birth_details_completed"
  | "floorplan_uploaded"
  | "report_previewed"
  | "begin_checkout"
  | "add_payment_info"
  | "purchase"
  | "report_generated"
  | "report_opened"
  | "upsell_viewed"
  | "subscription_started"
  | "advisory_requested"
  // engagement
  | "sakhi_opened"
  | "sakhi_message"
  | "sakhi_voice"
  | "wisdom_read"
  | "lamp_lit";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: FunnelEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
