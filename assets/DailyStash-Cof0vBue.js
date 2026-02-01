import{b as D,c as N,r as s,j as e,S as f,t as b}from"./index-DKzGAutY.js";const O=({onClose:d})=>{const{addCoins:u}=D(),{playClick:S,playFanfare:k,playCoin:v}=N(),[t,l]=s.useState("LOCKED"),[y,w]=s.useState(null),[j,C]=s.useState(""),[c,E]=s.useState(parseInt(localStorage.getItem("dailyStreak"))||0);s.useEffect(()=>{m();const o=setInterval(m,6e4);return()=>clearInterval(o)},[]);const m=()=>{const o=localStorage.getItem("dailyStashClaim");if(o){const p=new Date(parseInt(o)),r=(new Date-p)/(1e3*60*60);if(r<24){l("CLAIMED");const n=24-r,a=Math.floor(n),i=Math.floor((n-a)*60);C(`${a}h ${i}m`);return}}t==="CLAIMED"&&l("LOCKED")},I=()=>{S(),l("OPENING");let o=parseInt(localStorage.getItem("dailyStreak"))||0;const p=parseInt(localStorage.getItem("dailyStashClaim"))||0,g=Date.now(),h=1440*60*1e3;g-p>h*2&&(o=0);const r=o+1;localStorage.setItem("dailyStreak",r),E(r);const n=Math.random();let a=50,i=!1;n>.95?(a=500,i=!0):n>.85?(a=250,i=!0):n>.6&&(a=100),setTimeout(()=>{const x=Math.floor(a*(1+(r-1)*.1));w({amount:x,label:`${x} COINS`,isBigWin:i}),l("OPENED"),i?(k(),b()):(v(),b()),u(x),localStorage.setItem("dailyStashClaim",Date.now().toString())},2e3)};return e.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"rgba(0,0,0,0.85)",zIndex:6e3,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",fontFamily:'"Orbitron", sans-serif'},children:e.jsxs("div",{className:"glass-panel",style:{background:"linear-gradient(135deg, #1a0b2e 0%, #2b003e 100%)",width:"90%",maxWidth:"450px",padding:"40px 20px",borderRadius:"20px",textAlign:"center",border:"1px solid var(--neon-pink)",boxShadow:"0 0 50px rgba(255, 0, 85, 0.2)",position:"relative",overflow:"hidden"},children:[e.jsx("button",{onClick:d,style:{position:"absolute",top:"15px",right:"15px",background:"transparent",border:"none",color:"#ff0055",fontSize:"1.5rem",cursor:"pointer",zIndex:20},children:"✕"}),e.jsxs("div",{style:{position:"relative",zIndex:10},children:[e.jsx("h1",{style:{color:"white",letterSpacing:"4px",fontSize:"2rem",textShadow:"0 0 10px var(--neon-pink)",margin:"0 0 10px 0"},children:"NEON STASH"}),e.jsxs("div",{style:{background:"rgba(255, 0, 85, 0.1)",color:"var(--neon-pink)",display:"inline-block",padding:"5px 15px",borderRadius:"4px",fontWeight:"bold",fontSize:"0.9rem",border:"1px solid var(--neon-pink)",marginBottom:"20px"},children:["🔥 STREAK: ",c," DAY",c!==1?"S":""," (+",Math.round(c*.1*100),"%)"]}),e.jsxs("div",{style:{perspective:"800px",height:"300px",display:"flex",alignItems:"center",justifyContent:"center",margin:"20px 0"},children:[e.jsxs("div",{className:`loot-box ${t==="OPENING"?"shaking":""} ${t==="OPENED"?"opened":""}`,children:[e.jsx("div",{className:"face front",children:e.jsx("div",{className:"lock-icon",children:t==="CLAIMED"?"🚫":"🔒"})}),e.jsx("div",{className:"face back"}),e.jsx("div",{className:"face right"}),e.jsx("div",{className:"face left"}),e.jsx("div",{className:"face top"}),e.jsx("div",{className:"face bottom"}),e.jsxs("div",{className:`reward-item ${t==="OPENED"?"visible":""}`,children:[e.jsx("div",{style:{fontSize:"5rem",filter:"drop-shadow(0 0 20px gold)",animation:"spinCoin 3s infinite linear"},children:"💰"}),e.jsx("div",{style:{fontSize:"2.5rem",fontWeight:"900",color:"gold",textShadow:"0 0 10px gold",marginTop:"10px"},children:y?.amount}),e.jsx("div",{style:{color:"white",fontSize:"1rem",letterSpacing:"2px"},children:"CREDITS"})]})]}),t==="CLAIMED"&&e.jsxs("div",{style:{position:"absolute",background:"rgba(0,0,0,0.9)",padding:"30px",border:"1px solid #333",borderRadius:"15px",boxShadow:"0 0 30px black"},children:[e.jsx("p",{style:{color:"#888",textTransform:"uppercase",fontSize:"0.8rem",margin:0},children:"Next Supply Drop"}),e.jsx("div",{style:{fontSize:"2.5rem",color:"var(--neon-blue)",fontWeight:"bold",textShadow:"0 0 10px var(--neon-blue)",marginTop:"5px"},children:j})]})]}),e.jsx("style",{children:`
                        .loot-box {
                            width: 150px; height: 150px;
                            position: relative;
                            transform-style: preserve-3d;
                            transform: rotateX(-20deg) rotateY(30deg);
                            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                        }
                        .loot-box.shaking { animation: shakeBox 0.5s infinite; }
                        .loot-box.opened { transform: rotateX(-20deg) rotateY(30deg) translateY(60px); }
                        .loot-box.opened .top { transform: rotateX(130deg) translateZ(75px); } 
                        
                        .face {
                            position: absolute;
                            width: 150px; height: 150px;
                            background: rgba(20, 10, 30, 0.95);
                            border: 2px solid var(--neon-pink);
                            display: flex; alignItems: center; justifyContent: center;
                            box-shadow: inset 0 0 30px rgba(255, 0, 85, 0.2);
                        }
                        .front { transform: translateZ(75px); }
                        .back  { transform: rotateY(180deg) translateZ(75px); }
                        .right { transform: rotateY(90deg) translateZ(75px); border-color: #aa0033; }
                        .left  { transform: rotateY(-90deg) translateZ(75px); border-color: #aa0033; }
                        .top   { transform: rotateX(90deg) translateZ(75px); background: var(--neon-pink); border-color: white; transform-origin: top; transition: transform 0.5s ease-out; }
                        .bottom { transform: rotateX(-90deg) translateZ(75px); background: #000; }

                        .lock-icon { font-size: 3rem; filter: drop-shadow(0 0 10px var(--neon-pink)); }

                        .reward-item {
                            position: absolute;
                            top: 50%; left: 50%;
                            transform: translate(-50%, 0) scale(0);
                            opacity: 0;
                            display: flex; flexDirection: column; alignItems: center; justify-content: center;
                            text-align: center;
                            width: 200px;
                            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                            pointer-events: none;
                        }
                        .reward-item.visible {
                            transform: translate(-50%, -200%) scale(1);
                            opacity: 1;
                        }

                        @keyframes shakeBox {
                            0% { transform: rotateX(-20deg) rotateY(25deg); }
                            50% { transform: rotateX(-20deg) rotateY(35deg); }
                            100% { transform: rotateX(-20deg) rotateY(25deg); }
                        }
                        @keyframes spinCoin {
                            0% { transform: rotateY(0deg); }
                            100% { transform: rotateY(360deg); }
                        }
                    `}),t==="LOCKED"&&e.jsx(f,{onClick:I,style:{width:"100%",padding:"20px",background:"var(--neon-pink)",color:"white",fontSize:"1.2rem",textTransform:"uppercase",boxShadow:"0 0 20px var(--neon-pink)"},children:"DECRYPT LOOT 🔓"}),t==="OPENED"&&e.jsx(f,{onClick:d,style:{width:"100%",padding:"20px",background:"var(--neon-blue)",color:"black",fontSize:"1.2rem",textTransform:"uppercase",boxShadow:"0 0 20px var(--neon-blue)"},children:"COLLECT & CLOSE"}),t==="CLAIMED"&&e.jsx(f,{onClick:d,style:{width:"100%",padding:"15px",background:"rgba(255,255,255,0.1)",color:"white",fontSize:"1rem"},children:"RETURN TO BASE"})]})]})})};export{O as default};
