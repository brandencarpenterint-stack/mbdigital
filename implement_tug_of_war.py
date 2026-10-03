import re

filepath = 'src/games/CrazyFishing/CrazyFishing.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update startBattle initialization
start_target = """        gameStateRef.current = 'BATTLE'; setGameState('BATTLE'); setCaughtFish(fish);
        stateRef.current.battleFish = fish; stateRef.current.barPos = 0; stateRef.current.catchPercent = 25;"""
start_replacement = """        gameStateRef.current = 'BATTLE'; setGameState('BATTLE'); setCaughtFish(fish);
        stateRef.current.battleFish = fish; 
        stateRef.current.catchPercent = 10;
        stateRef.current.lineTension = 0;
        stateRef.current.fishState = 'CALM';
        stateRef.current.fishTimer = 0;
        stateRef.current.fishPos = GAME_WIDTH / 2;
        stateRef.current.fishY = GAME_HEIGHT / 2 + 50;"""
content = content.replace(start_target, start_replacement)

# 2. Replace the BATTLE logic block in gameLoop
battle_logic_pattern = re.compile(r"// BATTLE\n\s*if \(mode === 'BATTLE'.*?// WIN / LOSE\n\s*if \(state\.catchPercent >= 100\) \{[^\}]+\}\s*else if \(state\.catchPercent <= 0\) \{[^\}]+\}\s*\}", re.DOTALL)

new_battle_logic = """// BATTLE (Tug of War Mechanic)
        if (mode === 'BATTLE' && state.battleFish) {
            state.fishTimer++;
            const f = state.battleFish;
            const speed = (f.speed || 1) * 1.0;
            const difficultyMod = Math.min((f.score || 10) * 0.0005, 0.4); 

            const baseStruggleInterval = 120 - (speed * 10);
            const struggleInterval = Math.max(40, baseStruggleInterval);
            
            if (state.fishState === 'CALM' && state.fishTimer > struggleInterval) {
                state.fishState = 'STRUGGLING';
                state.fishTimer = 0;
                for(let i=0; i<5; i++) {
                    state.particles.push({
                        x: state.fishPos + (Math.random()-0.5)*40,
                        y: state.fishY + 20,
                        dx: (Math.random()-0.5)*5,
                        dy: -2 - Math.random()*3,
                        life: 1, char: '💧', color: 'cyan'
                    });
                }
            } else if (state.fishState === 'STRUGGLING' && state.fishTimer > 60 + (speed * 10)) {
                state.fishState = 'CALM';
                state.fishTimer = 0;
            }

            const isReeling = isMouseDown.current;

            if (isReeling) {
                if (state.fishState === 'STRUGGLING') {
                    // Reeling while struggling: Tension spikes, progress drops slightly
                    state.lineTension += 2.0 + difficultyMod;
                    state.catchPercent -= 0.1;
                    state.fishPos += (Math.random() - 0.5) * 20;
                } else {
                    // Reeling while calm: Good progress!
                    state.catchPercent += 0.4;
                    state.lineTension += 0.2;
                    state.fishPos += (GAME_WIDTH / 2 - state.fishPos) * 0.1;
                }
            } else {
                if (state.fishState === 'STRUGGLING') {
                    // Letting it run: Tension drops, but fish gets away
                    state.lineTension -= 1.0;
                    state.catchPercent -= (0.2 + difficultyMod);
                    state.fishPos += (Math.random() > 0.5 ? 1 : -1) * speed * 2;
                } else {
                    // Resting: Tension drops fast
                    state.lineTension -= 1.5;
                    state.catchPercent -= 0.1;
                }
            }

            // Keep fish on screen visually
            if (state.fishPos < 100) state.fishPos = 100;
            if (state.fishPos > GAME_WIDTH - 100) state.fishPos = GAME_WIDTH - 100;

            if (state.lineTension < 0) state.lineTension = 0;
            if (state.catchPercent < 0) state.catchPercent = 0;

            // WIN / LOSE
            if (state.catchPercent >= 100) {
                startReelUp();
            } else if (state.lineTension >= 100 || state.catchPercent <= 0) {
                if (state.lineTension >= 100) {
                     state.particles.push({
                        x: GAME_WIDTH/2, y: GAME_HEIGHT/2 - 50,
                        dx: 0, dy: -2, life: 2, char: 'SNAP!', color: 'red', size: 40
                     });
                     playCrash();
                }
                loseBattle();
            }
        }"""
content = battle_logic_pattern.sub(new_battle_logic, content)

# 3. Replace drawBattle
draw_battle_pattern = re.compile(r"const drawBattle = \(ctx, state\) => \{.*?^\s*};\s*const drawShowcase", re.DOTALL | re.MULTILINE)

new_draw_battle = """const drawBattle = (ctx, state) => {
        ctx.fillStyle = 'rgba(0,0,10,0.4)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        const cx = GAME_WIDTH / 2;
        const cy = GAME_HEIGHT / 2 + 50;

        ctx.beginPath();
        ctx.moveTo(cx, 0);
        
        const isHighTension = state.lineTension > 75;
        let lineEndX = state.fishPos;
        let lineEndY = state.fishY;

        if (isHighTension) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 4;
            lineEndX += (Math.random() - 0.5) * 10;
        } else if (state.lineTension > 40) {
            ctx.strokeStyle = 'orange';
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
        }
        
        if (state.fishState === 'STRUGGLING') {
             ctx.lineTo(cx + (lineEndX - cx)/2 + (Math.random()-0.5)*20, lineEndY/2);
        }
        ctx.lineTo(lineEndX, lineEndY);
        ctx.stroke();

        ctx.save();
        if (state.fishState === 'STRUGGLING') {
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 15;
            ctx.fillStyle = 'red'; ctx.font = 'bold 24px monospace'; ctx.textAlign='center';
            ctx.fillText("FISH PULLING! DON'T REEL!", cx, 150);
        } else {
            ctx.fillStyle = '#00ff00'; ctx.font = 'bold 24px monospace'; ctx.textAlign='center';
            ctx.fillText("FISH CALM! REEL IN! (HOLD)", cx, 150);
        }
        drawFish(ctx, state.battleFish, lineEndX, lineEndY, 60);
        ctx.restore();

        const barWidth = 400;
        const barHeight = 25;
        const startX = cx - barWidth / 2;
        
        // Progress Bar
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(startX, cy + 80, barWidth, barHeight);
        ctx.strokeStyle = 'gold'; ctx.strokeRect(startX, cy + 80, barWidth, barHeight);
        const catchW = (state.catchPercent / 100) * barWidth;
        ctx.fillStyle = 'cyan'; ctx.fillRect(startX + 2, cy + 82, Math.max(0, catchW - 4), barHeight - 4);
        
        ctx.fillStyle = 'white'; ctx.font = '16px monospace'; ctx.textAlign='left';
        ctx.fillText("DISTANCE TO BOAT (FILL TO CATCH)", startX, cy + 75);

        // Tension Bar
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(startX, cy + 130, barWidth, barHeight);
        ctx.strokeStyle = 'red'; ctx.strokeRect(startX, cy + 130, barWidth, barHeight);
        const tensionW = (state.lineTension / 100) * barWidth;
        
        let tColor = '#00ff00';
        if (state.lineTension > 50) tColor = 'orange';
        if (state.lineTension > 80) tColor = 'red';

        ctx.fillStyle = tColor; ctx.fillRect(startX + 2, cy + 132, Math.max(0, tensionW - 4), barHeight - 4);
        
        ctx.fillStyle = 'white'; ctx.fillText("LINE TENSION (DON'T LET IT SNAP)", startX, cy + 125);
        
        if (isHighTension) {
            ctx.fillStyle = 'red'; ctx.textAlign='right';
            ctx.fillText("WARNING! SNAP IMMINENT!", startX + barWidth, cy + 125);
        }
    };

    const drawShowcase"""
content = draw_battle_pattern.sub(new_draw_battle, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced!")
