import { s as supabase } from "./index-CRAV8IaB.js";
class FeedService {
  constructor() {
    this.listeners = [];
  }
  addEventListener(event, callback) {
    this.listeners.push({ event, callback });
  }
  removeEventListener(event, callback) {
    this.listeners = this.listeners.filter((l) => l.event !== event || l.callback !== callback);
  }
  async publish(message, type, user = "Operator") {
    const eventData = new CustomEvent("feed-message", { detail: { message, type, user, local: true } });
    this.listeners.forEach((l) => {
      if (l.event === "feed-message") l.callback(eventData);
    });
    if (supabase) {
      try {
        await supabase.from("feed_events").insert({
          player_name: user,
          message,
          type
        });
      } catch (e) {
        console.error("Feed Publish Error", e);
      }
    }
  }
}
const feedService = new FeedService();
export {
  feedService
};
