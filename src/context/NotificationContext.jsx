import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGamification } from './GamificationContext';
import { NotificationService } from '../services/NotificationService';
import { useToast } from './ToastContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { session, userProfile } = useGamification();
    const { showToast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const refreshNotifications = async () => {
        // Fallback to local ID if session missing (for testing)
        // If mocked, we use a fake ID
        const userId = session?.user?.id || localStorage.getItem('merchboy_client_id') || 'anon';

        const data = await NotificationService.fetchNotifications(userId);
        setNotifications(data);

        // Count unread
        const unread = data.filter(n => !n.read).length;
        // Don't toast on initial load to avoid annoyance, just update badge
        setUnreadCount(unread);
    };

    const markRead = async (id) => {
        await NotificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const sendChallenge = async (toProfile, gameId, score) => {
        if (!toProfile || !toProfile.id) {
            showToast("Can't challenge a ghost agent! (Needs Real ID)", "error");
            return false;
        }

        // Add ID if missing from session
        const sender = {
            ...userProfile,
            id: session?.user?.id || 'anon-sender'
        };

        const result = await NotificationService.sendChallenge(sender, toProfile, gameId, score);
        if (result.success) {
            showToast(`Challenge Sent to ${toProfile.name}!`, "success");
            return true;
        } else {
            showToast("Failed to send challenge.", "error");
            return false;
        }
    };

    // Poll
    useEffect(() => {
        refreshNotifications();
        const interval = setInterval(refreshNotifications, 15000); // 15s poll
        return () => clearInterval(interval);
    }, [session]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, refreshNotifications, markRead, sendChallenge }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
