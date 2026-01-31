import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Coloring from './pages/Coloring';
import ArcadeHub from './pages/ArcadeHub';
import ShopPage from './pages/ShopPage';
import SnakeGame from './games/Snake/SnakeGame';
import WhackAMoleGame from './games/WhackAMole/WhackAMoleGame';
import MemoryMatchGame from './games/MemoryMatch/MemoryMatchGame';
import GalaxyDefender from './games/GalaxyDefender/GalaxyDefender';
import NeonBrickBreaker from './games/NeonBrickBreaker/NeonBrickBreaker';
import FlappyMascot from './games/FlappyMascot/FlappyMascot';
import CrazyFishing from './games/CrazyFishing/CrazyFishing';
import FaceRunner from './games/FaceRunner/FaceRunner';
import MerchJump from './games/MerchJump/MerchJump';
import CosmicSlots from './games/CosmicSlots/CosmicSlots';
import SubHunterGame from './games/SubHunter/SubHunterGame';

import BeatLab from './pages/BeatLab';

import PocketBro from './pages/PocketBro';
import SubSlayer from './pages/SubSlayer';
import HustleMode from './pages/HustleMode';
import BroCard from './pages/BroCard';
import SettingsPage from './pages/SettingsPage';

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
        </Route>
      </Routes>
    </>
  );
}

export default App;
