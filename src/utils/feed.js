
import { supabase } from '../lib/supabaseClient';

class FeedService extends EventTarget {
    async publish(message, type, user = 'Operator') {
        // Dispatch Local Event (for immediate feedback)
        this.dispatchEvent(new CustomEvent('feed-message', { detail: { message, type, user, local: true } }));

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
