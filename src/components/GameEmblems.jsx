import React from 'react';

/**
 * GameEmblems.jsx
 * Official Cute Character Mascot Icons for all 27 MBDigital Arcade games.
 * Features official transparent character faces with luminous neon drop-shadows.
 */

export const BaseCharacterIcon = ({ src, alt = 'Cute Mascot', color = '#00f0ff', size = 58 }) => (
    <div style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 14px ${color}99)`
    }}>
        <img
            src={src}
            alt={alt}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))'
            }}
            loading="lazy"
        />
    </div>
);

// Backward compatibility wrapper
export const BaseEmblem = ({ color = '#00f0ff', children }) => (
    <div style={{
        position: 'relative',
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 16px ${color}88)`
    }}>
        {children}
    </div>
);

// --- 27 CUTE CHARACTER MASCOT ICONS ---

// 1. MERCH JUMP - Our Signature Jumper Guy Mascot!
export const EmblemMerchJump = () => (
    <BaseCharacterIcon src="/assets/skins/jump_guy.png" alt="Merch Jump Jumper" color="#66a6ff" />
);

// 2. CYBER CRASH - Cute Rocket Dino Mascot!
export const EmblemCrash = () => (
    <BaseCharacterIcon src="/assets/skins/face_dino.png" alt="Cyber Crash Dino" color="#ff0055" />
);

// 3. CYBER MINES - Cute Blue Bunny Gem Seeker!
export const EmblemMines = () => (
    <BaseCharacterIcon src="/assets/skins/face_bunny_blue.png" alt="Cyber Mines Bunny" color="#00ff66" />
);

// 4. CYBER HI-LO - Cute High Roller Bunny!
export const EmblemHiLo = () => (
    <BaseCharacterIcon src="/assets/skins/face_bunny.png" alt="Cyber Hi-Lo Bunny" color="#00e5ff" />
);

// 5. CYBER SCRATCHERS - Cute Money Eyes Jackpot Mascot!
export const EmblemScratchers = () => (
    <BaseCharacterIcon src="/assets/skins/face_money.png" alt="Cyber Scratchers Money" color="#ffd700" />
);

// 6. CYBER 21 BLACKJACK - Cute High Roller Money Face!
export const EmblemBlackjack = () => (
    <BaseCharacterIcon src="/assets/skins/face_money.png" alt="Cyber Blackjack Money" color="#00ff66" />
);

// 7. CYBER ROULETTE - Cute Lucky Frog Mascot!
export const EmblemRoulette = () => (
    <BaseCharacterIcon src="/assets/skins/face_frog.png" alt="Cyber Roulette Frog" color="#00e5ff" />
);

// 8. CYBER DERBY - Cute Racing Dino Jockey!
export const EmblemDerby = () => (
    <BaseCharacterIcon src="/assets/skins/face_dino.png" alt="Cyber Derby Dino" color="#00ff66" />
);

// 9. COSMIC SLOTS - Cute Cosmic Star 777 Mascot!
export const EmblemSlots = () => (
    <BaseCharacterIcon src="/assets/skins/face_star.png" alt="Cosmic Slots Star" color="#ffd700" />
);

// 10. THE UNDERWORLD - Cute Mystery Hoodie Broker!
export const EmblemUnderworld = () => (
    <BaseCharacterIcon src="/assets/skins/face_hoodie.png" alt="The Underworld Hoodie" color="#c084fc" />
);

// 11. CYBER COIN DOZER - Cute Neon Star Mascot!
export const EmblemDozer = () => (
    <BaseCharacterIcon src="/assets/skins/face_star.png" alt="Cyber Coin Dozer Star" color="#00f0ff" />
);

// 12. CYBER PINBALL 2088 - Cute Cosmic Space Mascot!
export const EmblemPinball = () => (
    <BaseCharacterIcon src="/assets/skins/face_space.png" alt="Cyber Pinball Space" color="#ff007f" />
);

// 13. CYBER PLINKO - Cute Hoodie Bunny Bouncer!
export const EmblemPlinko = () => (
    <BaseCharacterIcon src="/assets/skins/face_bunny_hoodie.png" alt="Cyber Plinko Bunny" color="#a855f7" />
);

// 14. NEON DRIFT: 2088 - Cute Cyber Racer Gamer!
export const EmblemDrift = () => (
    <BaseCharacterIcon src="/assets/skins/face_gamer.png" alt="Neon Drift Gamer" color="#ff007f" />
);

// 15. MERCH DEFENSE - Cute Space Cadet Astro Defender!
export const EmblemDefense = () => (
    <BaseCharacterIcon src="/assets/skins/face_astro.png" alt="Merch Defense Astro" color="#00c6ff" />
);

// 16. GALAXY DEFENDER - Cute Starfighter Astro Mascot!
export const EmblemGalaxy = () => (
    <BaseCharacterIcon src="/assets/skins/face_space.png" alt="Galaxy Defender Astro" color="#00f0ff" />
);

// 17. FLAPPY BRO - Cute OG Mascot Bro!
export const EmblemFlappy = () => (
    <BaseCharacterIcon src="/assets/skins/face_default.png" alt="Flappy Bro OG" color="#ffd700" />
);

// 18. CYBER WHEEL - Cute Golden Money Mascot!
export const EmblemWheel = () => (
    <BaseCharacterIcon src="/assets/skins/face_money.png" alt="Cyber Wheel Money" color="#ffd700" />
);

// 19. NEON BRICKS - Cute Retro Brick Gamer!
export const EmblemBricks = () => (
    <BaseCharacterIcon src="/assets/skins/face_gamer.png" alt="Neon Bricks Gamer" color="#da22ff" />
);

// 20. NEON SNAKE - Cute Neon Dino Snake Charmer!
export const EmblemSnake = () => (
    <BaseCharacterIcon src="/assets/skins/face_dino.png" alt="Neon Snake Dino" color="#38ef7d" />
);

// 21. HYPE DROP - Cute Spooky Pumpkin Crate Mascot!
export const EmblemUnboxing = () => (
    <BaseCharacterIcon src="/assets/skins/face_pumpkin.png" alt="Hype Drop Pumpkin" color="#ff007f" />
);

// 22. THE ARENA - Cute Tactical Gamer Champion!
export const EmblemArena = () => (
    <BaseCharacterIcon src="/assets/skins/face_gamer.png" alt="The Arena Gamer" color="#ff0844" />
);

// 23. FACE WARP (FACE RUNNER) - Cute Hyper-Speed Rainbow Mascot!
export const EmblemFaceRunner = () => (
    <BaseCharacterIcon src="/assets/skins/face_rainbow.png" alt="Face Warp Rainbow" color="#00f260" />
);

// 24. BRO CANNON - Cute High-Flying Bear Mascot!
export const EmblemBroCannon = () => (
    <BaseCharacterIcon src="/assets/skins/face_bear.png" alt="Bro Cannon Bear" color="#FF512F" />
);

// 25. CRAZY FISHING - Cute Angling Kitty Mascot!
export const EmblemFishing = () => (
    <BaseCharacterIcon src="/assets/merchboy_cat.png" alt="Crazy Fishing Cat" color="#00C6FF" />
);

// 26. WHACK-A-MOLE - Cute Playful Mascot Bear!
export const EmblemWhack = () => (
    <BaseCharacterIcon src="/assets/skins/face_bear.png" alt="Whack-A-Mole Bear" color="#FF416C" />
);

// 27. MEMORY MATCH - Cute Pastel Memory Kitty!
export const EmblemMemory = () => (
    <BaseCharacterIcon src="/assets/skins/face_cat.png" alt="Memory Match Kitty" color="#64f38c" />
);
