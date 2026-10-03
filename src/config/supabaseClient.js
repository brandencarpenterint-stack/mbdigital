export const supabase = {
    auth: {
        getUser: async () => ({ data: { user: { id: 'mock-user-123', email: 'test@example.com' } }, error: null }),
        signInWithOAuth: async () => {},
        signOut: async () => {},
        onAuthStateChange: (cb) => {
            // cb('SIGNED_IN', { user: { id: 'mock-user-123' }});
            return { data: { subscription: { unsubscribe: () => {} } } };
        }
    },
    from: (table) => {
        const chain = {
            select: () => chain,
            eq: () => chain,
            order: () => chain,
            limit: () => chain,
            single: async () => ({ data: null, error: null }),
            insert: async () => ({ data: null, error: null }),
            update: () => chain,
            upsert: async () => ({ data: null, error: null }),
            delete: () => chain,
            then: (resolve) => resolve({ data: [], error: null })
        };
        return chain;
    },
    channel: (topic) => {
        const chan = {
            on: () => chan,
            subscribe: (cb) => { if(cb) cb('SUBSCRIBED'); return chan; },
            send: async () => {},
            unsubscribe: async () => {}
        };
        return chan;
    },
    rpc: async () => ({ data: null, error: null }),
    removeChannel: async () => {}
};
