const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.jsx', 'utf8');

const target = `<Link to="/leaderboard" style={{ textDecoration: 'none', flex: 1 }}>`;
const injection = `
                    <Link to="/pocketbro" style={{ textDecoration: 'none', flex: 1 }}>
                        <TiltCard className="bento-card" style={{ background: 'linear-gradient(135deg, #ff0055 0%, #ff00ff 100%)', color: '#fff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', transform: 'translateZ(20px)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👾</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>POCKET BRO</h3>
                            </div>
                        </TiltCard>
                    </Link>
                    
                    <Link to="/leaderboard" style={{ textDecoration: 'none', flex: 1 }}>`;

if (!code.includes('/pocketbro')) {
    code = code.replace(target, injection);
    fs.writeFileSync('src/pages/Home.jsx', code, 'utf8');
    console.log('Added Pocket Bro back to Home screen!');
} else {
    console.log('Pocket Bro already on Home screen');
}
