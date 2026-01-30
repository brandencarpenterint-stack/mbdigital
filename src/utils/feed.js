// Simple Event Bus for the Live Feed
class FeedService extends EventTarget {
    publish(message, type) {
        this.dispatchEvent(new CustomEvent('feed-message', { detail: { message, type } }));
    }
}

export const feedService = new FeedService();
