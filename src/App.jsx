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

import BeatLab from './pages/BeatLab';

import PocketBro from './pages/PocketBro';
import SubSlayer from './pages/SubSlayer';
import HustleMode from './pages/HustleMode';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="coloring" element={<Coloring />} />
        <Route path="beatlab" element={<BeatLab />} />
        <Route path="pocketbro" element={<PocketBro />} />
        <Route path="subslayer" element={<SubSlayer />} />
        <Route path="hustle" element={<HustleMode />} />
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
      </Route>
    </Routes>
  );
}

export default App;
