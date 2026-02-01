import { Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Layout from './components/Layout';
const Home = lazy(() => import('./pages/Home'));
const Coloring = lazy(() => import('./pages/Coloring'));
const ArcadeHub = lazy(() => import('./pages/ArcadeHub'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const BeatLab = lazy(() => import('./pages/BeatLab'));
const PocketBro = lazy(() => import('./pages/PocketBro'));
const SubSlayer = lazy(() => import('./pages/SubSlayer'));
const HustleMode = lazy(() => import('./pages/HustleMode'));
const BroCard = lazy(() => import('./pages/BroCard'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// GAMES
const SnakeGame = lazy(() => import('./games/Snake/SnakeGame'));
const WhackAMoleGame = lazy(() => import('./games/WhackAMole/WhackAMoleGame'));
const MemoryMatchGame = lazy(() => import('./games/MemoryMatch/MemoryMatchGame'));
const GalaxyDefender = lazy(() => import('./games/GalaxyDefender/GalaxyDefender'));
const NeonBrickBreaker = lazy(() => import('./games/NeonBrickBreaker/NeonBrickBreaker'));
const FlappyMascot = lazy(() => import('./games/FlappyMascot/FlappyMascot'));
const CrazyFishing = lazy(() => import('./games/CrazyFishing/CrazyFishing'));
const FaceRunner = lazy(() => import('./games/FaceRunner/FaceRunner'));
const MerchJump = lazy(() => import('./games/MerchJump/MerchJump'));
const CosmicSlots = lazy(() => import('./games/CosmicSlots/CosmicSlots'));
const SubHunterGame = lazy(() => import('./games/SubHunter/SubHunterGame'));
const BroCannon = lazy(() => import('./games/BroCannon/BroCannon'));

import CosmicBackground from './components/CosmicBackground';

function App() {
  return (
    <>
      <CosmicBackground />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.4
      }} />
      <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>LOADING GAME...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="coloring" element={<Coloring />} />
            <Route path="beatlab" element={<BeatLab />} />
            <Route path="pocketbro" element={<PocketBro />} />
            <Route path="subslayer" element={<SubSlayer />} />
            <Route path="hustle" element={<HustleMode />} />
            <Route path="profile" element={<BroCard />} />
            <Route path="arcade" element={<ArcadeHub />} />
            <Route path="shop" element={<ShopPage />} />

            {/* Game Routes Placeholders */}
            <Route path="arcade/snake" element={<SnakeGame />} />
            <Route path="arcade/whack" element={<WhackAMoleGame />} />
            <Route path="arcade/memory" element={<MemoryMatchGame />} />
            <Route path="arcade/galaxy" element={<GalaxyDefender />} />
            <Route path="arcade/brick" element={<NeonBrickBreaker />} />
            <Route path="arcade/flappy" element={<FlappyMascot />} />
            <Route path="arcade/fishing" element={<CrazyFishing />} />
            <Route path="arcade/face-runner" element={<FaceRunner />} />
            <Route path="arcade/merch-jump" element={<MerchJump />} />
            <Route path="arcade/slots" element={<CosmicSlots />} />
            <Route path="arcade/sub-hunter" element={<SubHunterGame />} />
            <Route path="arcade/bro-cannon" element={<BroCannon />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
