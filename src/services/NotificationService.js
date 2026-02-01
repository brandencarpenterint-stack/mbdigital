import { supabase } from '../lib/supabaseClient';

// Mock data for when DB is missing
const MOCK_NOTIFICATIONS = [
    {
        id: 'mock-1',
        type: 'system',
        sender: { name: 'SYSTEM' },
        message: 'Welcome to the Notification System! 🔔',
        read: false,
        created_at: new Date().toISOString()
    },
    {
        id: 'mock-2',
        type: 'challenge',
        sender: { name: 'NeonViper' },
        payload: { game: 'Snake', score: 5000 },
        message: 'NeonViper challenged you to Beat 5000 in Snake!',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString()
    }
];

export const NotificationService = {
    async fetchNotifications(userId) {
        if (!userId || !supabase) return MOCK_NOTIFICATIONS;

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('receiver_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                // If table doesn't exist, we fall back to mock
                console.warn("Notification Fetch Error (using mock):", error.message);
                return MOCK_NOTIFICATIONS;
            }

            return data.map(n => ({
                ...n,
                // Ensure sender name is present or fetched
                // If we joined tables, we'd have it. 
                // For now, we assume payload has senderName or we just use 'Unknown Agent'
                sender: { name: n.payload?.senderName || 'Unknown Agent', avatar: n.payload?.senderAvatar }
            }));
        } catch (e) {
            console.warn("Notification Service Exception:", e);
            return MOCK_NOTIFICATIONS;
        }
    },

    async markAsRead(notificationId) {
        if (!supabase) return;
        try {
            await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
        } catch (e) { }
    },

    async sendChallenge(fromUser, toUser, gameId, score) {
        if (!supabase) {
            console.log("Mock sending challenge to", toUser.name);
            return { success: true, mock: true };
        }

        try {
            // Check if table exists by inserting
            const { error } = await supabase.from('notifications').insert({
                sender_id: fromUser.id || 'mock-sender-id',
                receiver_id: toUser.id, // Only works if we have their REAL ID, not just friend code
                type: 'challenge',
                payload: {
                    game: gameId,
                    score: score,
                    senderName: fromUser.name,
                    senderAvatar: fromUser.avatar
                },
                message: `${fromUser.name} challenged you to beat ${score} in ${gameId}!`,
                read: false
            });

            if (error) throw error;
            return { success: true };
        } catch (e) {
            console.error("Failed to send challenge:", e);
            return { success: false, error: e };
        }
    }
};
