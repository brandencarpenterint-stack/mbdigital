
import { supabase } from '../lib/supabaseClient';

class FeedService {
    constructor() {
        this.listeners = [];
    }

    addEventListener(event, callback) {
        this.listeners.push({ event, callback });
    }

    removeEventListener(event, callback) {
        this.listeners = this.listeners.filter(l => l.event !== event || l.callback !== callback);
    }

    async publish(message, type, user = 'Operator') {
        // Dispatch Local Event (for immediate feedback)
        const eventData = new CustomEvent('feed-message', { detail: { message, type, user, local: true } });

        this.listeners.forEach(l => {
            if (l.event === 'feed-message') l.callback(eventData);
        });

        // Push to Cloud
        if (supabase) {
            try {
                await supabase.from('feed_events').insert({
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

export const feedService = new FeedService();
