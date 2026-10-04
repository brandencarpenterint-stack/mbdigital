import re

filepath = 'src/components/OnboardingModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add URL parsing for inviteCode
init_target = """    useEffect(() => {
        if (!userProfile?.name && !session) {
            setVisible(true);
        } else if (session && !userProfile?.name) {
            // Wait for cloud sync to finish, if still no name, show
            const timer = setTimeout(() => {
                if (!userProfile?.name) setVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [userProfile, session]);"""

init_replacement = """    useEffect(() => {
        // Parse invite from URL
        const params = new URLSearchParams(window.location.search);
        const inviteParam = params.get('invite');
        if (inviteParam) {
            setInviteCode(inviteParam.toUpperCase());
        }

        if (!userProfile?.name && !session) {
            setVisible(true);
        } else if (session && !userProfile?.name) {
            // Wait for cloud sync to finish, if still no name, show
            const timer = setTimeout(() => {
                if (!userProfile?.name) setVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [userProfile, session]);"""

content = content.replace(init_target, init_replacement)

# 2. Update handleComplete to award inviter
complete_target = """                if (data) {
                    bonusCoins += 5000;
                    alert(`REFERRAL ACCEPTED: +5000 COINS! Welcome bro of ${data.name}!`);
                } else {
                    alert("INVALID INVITE CODE. PROCEEDING WITHOUT REFERRAL.");
                }"""

complete_replacement = """                if (data) {
                    bonusCoins += 5000;
                    alert(`REFERRAL ACCEPTED: +5000 COINS! Welcome bro of ${data.name}!`);
                    
                    // Award the inviter! Since we don't have an RPC, we will fetch their profile and upsert.
                    // (Assuming RLS allows this in this prototype environment)
                    try {
                        const { data: inviterData } = await supabase.from('profiles').select('*').eq('id', data.id).single();
                        if (inviterData) {
                            await supabase.from('profiles').upsert({
                                ...inviterData,
                                coins: (inviterData.coins || 0) + 5000
                            });
                        }
                    } catch (err) {
                        console.error("Failed to reward inviter", err);
                    }
                } else {
                    alert("INVALID INVITE CODE. PROCEEDING WITHOUT REFERRAL.");
                }"""

content = content.replace(complete_target, complete_replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Onboarding updated")
