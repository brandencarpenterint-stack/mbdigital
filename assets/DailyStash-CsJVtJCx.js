import{b as s,j as e}from"./vendor-DOnSWrFG.js";import{a as D,u as L,b as h,t as u}from"./index-BR8rYDtf.js";import"./supabase-DhDedaeW.js";const M=({onClose:d})=>{const{addCoins:b}=D(),{playClick:y,playFanfare:k,playCoin:v}=L(),[t,l]=s.useState("LOCKED"),[j,w]=s.useState(null),[S,C]=s.useState(""),[c,I]=s.useState(parseInt(localStorage.getItem("dailyStreak"))||0);s.useEffect(()=>{f();const o=setInterval(f,6e4);return()=>clearInterval(o)},[]);const f=()=>{const o=localStorage.getItem("dailyStashClaim");if(o){const x=new Date(parseInt(o)),n=(new Date-x)/(1e3*60*60);if(n<24){l("CLAIMED");const a=24-n,r=Math.floor(a),i=Math.floor((a-r)*60);C(`${r}h ${i}m`);return}}t==="CLAIMED"&&l("LOCKED")},E=()=>{y(),l("OPENING");let o=parseInt(localStorage.getItem("dailyStreak"))||0;const x=parseInt(localStorage.getItem("dailyStashClaim"))||0,g=Date.now(),m=1440*60*1e3;g-x>m*2&&(o=0);const n=o+1;localStorage.setItem("dailyStreak",n),I(n);const a=Math.random();let r=50,i=!1;a>.95?(r=500,i=!0):a>.85?(r=250,i=!0):a>.6&&(r=100),setTimeout(()=>{const p=Math.floor(r*(1+(n-1)*.1));w({amount:p,label:`${p} COINS`,isBigWin:i}),l("OPENED"),i?(k(),u()):(v(),u()),b(p),localStorage.setItem("dailyStashClaim",Date.now().toString())},2e3)};return e.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"rgba(0,0,0,0.85)",zIndex:6e3,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",fontFamily:'"Orbitron", sans-serif'},children:e.jsxs("div",{className:"glass-panel",style:{background:"linear-gradient(135deg, #1a0b2e 0%, #2b003e 100%)",width:"90%",maxWidth:"450px",padding:"40px 20px",borderRadius:"20px",textAlign:"center",border:"1px solid var(--neon-pink)",boxShadow:"0 0 50px rgba(255, 0, 85, 0.2)",position:"relative",overflow:"hidden"},children:[e.jsx("button",{onClick:d,style:{position:"absolute",top:"15px",right:"15px",background:"transparent",border:"none",color:"#ff0055",cursor:"pointer",zIndex:20,padding:"4px",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})}),e.jsxs("div",{style:{position:"relative",zIndex:10},children:[e.jsx("h1",{style:{color:"white",letterSpacing:"4px",fontSize:"2rem",textShadow:"0 0 10px var(--neon-pink)",margin:"0 0 10px 0"},children:"NEON STASH"}),e.jsxs("div",{style:{background:"rgba(255, 0, 85, 0.1)",color:"var(--neon-pink)",display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 16px",borderRadius:"4px",fontWeight:"bold",fontSize:"0.9rem",border:"1px solid var(--neon-pink)",marginBottom:"20px"},children:[e.jsx("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M12 23c-4.97 0-9-3.8-9-8.5 0-3.37 2.1-6.7 4.77-8.8.44-.35 1.09-.16 1.25.38.64 2.15 1.83 3.67 3.03 4.54.27.2.65.1.78-.2.53-1.2.97-3.07.97-5.42 0-.6.64-1 1.14-.66C17.5 5.9 21 10.3 21 14.5 21 19.2 16.97 23 12 23z"})}),"STREAK: ",c," DAY",c!==1?"S":""," (+",Math.round(c*.1*100),"%)"]}),e.jsxs("div",{style:{perspective:"800px",height:"300px",display:"flex",alignItems:"center",justifyContent:"center",margin:"20px 0"},children:[e.jsxs("div",{className:`loot-box ${t==="OPENING"?"shaking":""} ${t==="OPENED"?"opened":""}`,children:[e.jsx("div",{className:"face front",children:e.jsx("div",{className:"lock-icon",style:{display:"flex",alignItems:"center",justifyContent:"center"},children:t==="CLAIMED"?e.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"#ef4444",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"4.93",y1:"4.93",x2:"19.07",y2:"19.07"})]}):e.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"#00f0ff",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})})}),e.jsx("div",{className:"face back"}),e.jsx("div",{className:"face right"}),e.jsx("div",{className:"face left"}),e.jsx("div",{className:"face top"}),e.jsx("div",{className:"face bottom"}),e.jsxs("div",{className:`reward-item ${t==="OPENED"?"visible":""}`,children:[e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",filter:"drop-shadow(0 0 20px gold)",animation:"spinCoin 3s infinite linear"},children:e.jsxs("svg",{width:"72",height:"72",viewBox:"0 0 24 24",fill:"none",stroke:"#ffd700",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("ellipse",{cx:"12",cy:"7",rx:"8",ry:"4",fill:"rgba(255,215,0,0.3)"}),e.jsx("path",{d:"M4 7v5c0 2.21 3.58 4 8 4s8-1.79 8-4V7"}),e.jsx("path",{d:"M4 12v5c0 2.21 3.58 4 8 4s8-1.79 8-4v-5"})]})}),e.jsx("div",{style:{fontSize:"2.5rem",fontWeight:"900",color:"gold",textShadow:"0 0 10px gold",marginTop:"10px"},children:j?.amount}),e.jsx("div",{style:{color:"white",fontSize:"1rem",letterSpacing:"2px"},children:"CREDITS"})]})]}),t==="CLAIMED"&&e.jsxs("div",{style:{position:"absolute",background:"rgba(0,0,0,0.9)",padding:"30px",border:"1px solid #333",borderRadius:"15px",boxShadow:"0 0 30px black"},children:[e.jsx("p",{style:{color:"#888",textTransform:"uppercase",fontSize:"0.8rem",margin:0},children:"Next Supply Drop"}),e.jsx("div",{style:{fontSize:"2.5rem",color:"var(--neon-blue)",fontWeight:"bold",textShadow:"0 0 10px var(--neon-blue)",marginTop:"5px"},children:S})]})]}),e.jsx("style",{children:`
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
                    `}),t==="LOCKED"&&e.jsxs(h,{onClick:E,style:{width:"100%",padding:"20px",background:"var(--neon-pink)",color:"white",fontSize:"1.2rem",textTransform:"uppercase",boxShadow:"0 0 20px var(--neon-pink)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px"},children:[e.jsx("span",{children:"DECRYPT LOOT"}),e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 9.9-1"})]})]}),t==="OPENED"&&e.jsx(h,{onClick:d,style:{width:"100%",padding:"20px",background:"var(--neon-blue)",color:"black",fontSize:"1.2rem",textTransform:"uppercase",boxShadow:"0 0 20px var(--neon-blue)"},children:"COLLECT & CLOSE"}),t==="CLAIMED"&&e.jsx(h,{onClick:d,style:{width:"100%",padding:"15px",background:"rgba(255,255,255,0.1)",color:"white",fontSize:"1rem"},children:"RETURN TO BASE"})]})]})})};export{M as default};
