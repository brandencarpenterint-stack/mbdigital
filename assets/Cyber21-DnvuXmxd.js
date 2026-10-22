import { a as useGamification, c as useToast, u as useRetroSound, r as reactExports, j as jsxRuntimeExports, L as Link, b as SquishyButton, t as triggerConfetti, f as feedService } from "./index-9iIJqYUv.js";
import { R as RewardedSponsorModal } from "./RewardedSponsorModal-jhPJrKst.js";
const SUITS = [
  { id: "spades", symbol: "♠", name: "Spades", color: "#00e5ff" },
  { id: "hearts", symbol: "♥", name: "Hearts", color: "#ff007f" },
  { id: "diamonds", symbol: "♦", name: "Diamonds", color: "#ffd700" },
  { id: "clubs", symbol: "♣", name: "Clubs", color: "#00ff66" }
];
const RANKS = [
  { rank: "2", val: 2 },
  { rank: "3", val: 3 },
  { rank: "4", val: 4 },
  { rank: "5", val: 5 },
  { rank: "6", val: 6 },
  { rank: "7", val: 7 },
  { rank: "8", val: 8 },
  { rank: "9", val: 9 },
  { rank: "10", val: 10 },
  { rank: "J", val: 10, isFace: true, faceType: "jack", name: "Cyber Jack" },
  { rank: "Q", val: 10, isFace: true, faceType: "queen", name: "Cyber Queen" },
  { rank: "K", val: 10, isFace: true, faceType: "king", name: "Cyber King" },
  { rank: "A", val: 11, isAce: true, faceType: "ace", name: "Cyber Ace" }
];
const TABLES = {
  STREET: { id: "STREET", name: "STREET VIP", min: 25, max: 500, color: "#00e5ff", desc: "Standard stakes & cyber neon felt" },
  HIGH_ROLLER: { id: "HIGH_ROLLER", name: "HIGH ROLLER", min: 250, max: 2500, color: "#ff007f", desc: "Serious action & double rewards" },
  WHALE: { id: "WHALE", name: "THE WHALE PENTHOUSE", min: 1e3, max: 25e3, color: "#ffd700", desc: "Degen underworld high-stakes" }
};
const createDeck = (deckCount = 4) => {
  const deck = [];
  for (let d = 0; d < deckCount; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          id: `${d}_${suit.id}_${rank.rank}_${Math.random().toString(36).substring(2, 6)}`,
          rank: rank.rank,
          val: rank.val,
          suit: suit.symbol,
          suitId: suit.id,
          suitColor: suit.color,
          isFace: rank.isFace,
          isAce: rank.isAce,
          faceType: rank.faceType,
          name: rank.name || `${rank.rank} of ${suit.name}`
        });
      }
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};
const calculateHandScore = (cards) => {
  let score = 0;
  let aces = 0;
  cards.forEach((card) => {
    if (card.isAce) {
      aces += 1;
      score += 11;
    } else {
      score += card.val;
    }
  });
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }
  const isBust = score > 21;
  const isBlackjack = cards.length === 2 && score === 21;
  const isFiveCardCharlie = cards.length >= 5 && score <= 21;
  return { score, isBust, isBlackjack, isFiveCardCharlie, isSoft: aces > 0 };
};
const Cyber21 = () => {
  const { coins, addCoins, spendCoins, userProfile, updateStat, incrementStat, stats } = useGamification() || {};
  const { showToast } = useToast() || { showToast: () => {
  } };
  const { playAirhorn, playWin, playCrash } = useRetroSound();
  const audioCtxRef = reactExports.useRef(null);
  const [tableTier, setTableTier] = reactExports.useState("STREET");
  const [phase, setPhase] = reactExports.useState("BETTING");
  const [deck, setDeck] = reactExports.useState(() => createDeck(4));
  const [bet, setBet] = reactExports.useState(50);
  const [playerHands, setPlayerHands] = reactExports.useState([{ cards: [], bet: 50, isDone: false, isBusted: false, isBlackjack: false, result: null }]);
  const [currentHandIdx, setCurrentHandIdx] = reactExports.useState(0);
  const [dealerHand, setDealerHand] = reactExports.useState({ cards: [], isDone: false, isBusted: false, isBlackjack: false, score: 0 });
  const [insuranceOffered, setInsuranceOffered] = reactExports.useState(false);
  const [insuranceBet, setInsuranceBet] = reactExports.useState(0);
  const [cyberScanner, setCyberScanner] = reactExports.useState(true);
  const [croupierMsg, setCroupierMsg] = reactExports.useState("Place your bet, bro. The deck is freshly cut.");
  const [roundPayout, setRoundPayout] = reactExports.useState(0);
  const [winStreak, setWinStreak] = reactExports.useState(0);
  const [lostBet, setLostBet] = reactExports.useState(0);
  const [hasClaimedLossInsurance, setHasClaimedLossInsurance] = reactExports.useState(false);
  const [showSponsorModal, setShowSponsorModal] = reactExports.useState(false);
  const activeTable = TABLES[tableTier];
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };
  const playCardSlide = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
    }
  };
  const playChipSound = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
    }
  };
  const playBustSound = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
    }
  };
  const calculateHiLo = () => {
    let count = 0;
    const countCard = (c) => {
      if (!c) return;
      if (c.val >= 2 && c.val <= 6) count++;
      else if (c.val === 10 || c.isAce) count--;
    };
    playerHands.forEach((h) => h.cards.forEach(countCard));
    dealerHand.cards.forEach((c, idx) => {
      if (phase === "DEALER_TURN" || phase === "ROUND_OVER" || idx === 0) {
        countCard(c);
      }
    });
    const decksRemaining = Math.max(1, Math.round(deck.length / 52));
    const trueCount = Math.round(count / decksRemaining * 10) / 10;
    return { count, trueCount, penetration: Math.round((208 - deck.length) / 208 * 100) };
  };
  const handleDeal = () => {
    if (phase !== "BETTING") return;
    if ((coins || 0) < bet) {
      playCrash();
      showToast("Not enough coins to place this bet!", "error");
      return;
    }
    spendCoins(bet);
    setLostBet(0);
    setHasClaimedLossInsurance(false);
    playChipSound();
    let activeDeck = [...deck];
    if (activeDeck.length < 25) {
      activeDeck = createDeck(4);
      setCroupierMsg("Dealer shuffles the 4-deck shoe.");
    }
    const p1 = activeDeck.pop();
    const d1 = activeDeck.pop();
    const p2 = activeDeck.pop();
    const d2 = activeDeck.pop();
    const initialPlayerCards = [p1, p2];
    const initialDealerCards = [d1, d2];
    const pEval = calculateHandScore(initialPlayerCards);
    const newHands = [{
      cards: initialPlayerCards,
      bet,
      isDone: pEval.isBlackjack,
      isBusted: false,
      isBlackjack: pEval.isBlackjack,
      result: null
    }];
    setDeck(activeDeck);
    setPlayerHands(newHands);
    setCurrentHandIdx(0);
    setDealerHand({ cards: initialDealerCards, isDone: false, isBusted: false, isBlackjack: false, score: 0 });
    setInsuranceBet(0);
    setRoundPayout(0);
    playCardSlide();
    if (d1.isAce) {
      setInsuranceOffered(true);
      setPhase("PLAYER_TURN");
      setCroupierMsg("Dealer shows an Ace. Care to buy Insurance, bro?");
    } else if (pEval.isBlackjack) {
      setCroupierMsg("NATURAL BLACKJACK! Pay the player 3:2!");
      setPhase("DEALER_TURN");
      setTimeout(() => runDealerTurn(newHands, initialDealerCards, activeDeck), 600);
    } else {
      setPhase("PLAYER_TURN");
      setCroupierMsg("Your turn! Hit, Stand or Double Down.");
    }
  };
  const handleInsurance = (take) => {
    setInsuranceOffered(false);
    if (take) {
      const insCost = Math.floor(bet / 2);
      if ((coins || 0) < insCost) {
        showToast("Not enough coins for insurance!", "error");
        return;
      }
      spendCoins(insCost);
      setInsuranceBet(insCost);
      setCroupierMsg("Insurance locked in. Checking dealer hole card...");
    } else {
      setCroupierMsg("No insurance. Let's see the dealer hole card.");
    }
    const dScore = calculateHandScore(dealerHand.cards);
    if (dScore.isBlackjack) {
      setPhase("DEALER_TURN");
      setTimeout(() => runDealerTurn(playerHands, dealerHand.cards, deck, take ? Math.floor(bet / 2) : 0), 600);
    } else {
      if (take) {
        showToast("Dealer does not have Blackjack! Insurance lost.", "info");
      }
    }
  };
  const handleHit = () => {
    if (phase !== "PLAYER_TURN") return;
    playCardSlide();
    const activeDeck = [...deck];
    const newCard = activeDeck.pop();
    setDeck(activeDeck);
    const updatedHands = [...playerHands];
    const currentHand = { ...updatedHands[currentHandIdx] };
    currentHand.cards = [...currentHand.cards, newCard];
    const scoreObj = calculateHandScore(currentHand.cards);
    if (scoreObj.isBust) {
      playBustSound();
      currentHand.isBusted = true;
      currentHand.isDone = true;
      setCroupierMsg("BUST! You went over 21.");
    } else if (scoreObj.score === 21 || scoreObj.isFiveCardCharlie) {
      currentHand.isDone = true;
      setCroupierMsg(scoreObj.isFiveCardCharlie ? "5-CARD CHARLIE! AUTOMATIC WIN!" : "21! Perfection.");
    }
    updatedHands[currentHandIdx] = currentHand;
    setPlayerHands(updatedHands);
    if (currentHand.isDone) {
      if (currentHandIdx + 1 < updatedHands.length) {
        setCurrentHandIdx(currentHandIdx + 1);
        setCroupierMsg("Playing split Hand #" + (currentHandIdx + 2));
      } else {
        setPhase("DEALER_TURN");
        setTimeout(() => runDealerTurn(updatedHands, dealerHand.cards, activeDeck), 600);
      }
    }
  };
  const handleStand = () => {
    if (phase !== "PLAYER_TURN") return;
    const updatedHands = [...playerHands];
    updatedHands[currentHandIdx].isDone = true;
    setPlayerHands(updatedHands);
    if (currentHandIdx + 1 < updatedHands.length) {
      setCurrentHandIdx(currentHandIdx + 1);
      setCroupierMsg("Playing split Hand #" + (currentHandIdx + 2));
    } else {
      setPhase("DEALER_TURN");
      setCroupierMsg("Dealer reveals hole card...");
      setTimeout(() => runDealerTurn(updatedHands, dealerHand.cards, deck), 600);
    }
  };
  const handleDouble = () => {
    if (phase !== "PLAYER_TURN") return;
    const currentHand = playerHands[currentHandIdx];
    if (currentHand.cards.length !== 2) return;
    if ((coins || 0) < currentHand.bet) {
      showToast("Not enough coins to double down!", "error");
      return;
    }
    spendCoins(currentHand.bet);
    playChipSound();
    playCardSlide();
    const activeDeck = [...deck];
    const newCard = activeDeck.pop();
    setDeck(activeDeck);
    const updatedHands = [...playerHands];
    const h = { ...currentHand };
    h.bet *= 2;
    h.cards = [...h.cards, newCard];
    h.isDone = true;
    const scoreObj = calculateHandScore(h.cards);
    if (scoreObj.isBust) {
      playBustSound();
      h.isBusted = true;
      setCroupierMsg("Doubled & Busted!");
    } else {
      setCroupierMsg("Doubled down! Standing on " + scoreObj.score);
    }
    updatedHands[currentHandIdx] = h;
    setPlayerHands(updatedHands);
    if (currentHandIdx + 1 < updatedHands.length) {
      setCurrentHandIdx(currentHandIdx + 1);
    } else {
      setPhase("DEALER_TURN");
      setTimeout(() => runDealerTurn(updatedHands, dealerHand.cards, activeDeck), 600);
    }
  };
  const handleSplit = () => {
    if (phase !== "PLAYER_TURN") return;
    const currentHand = playerHands[currentHandIdx];
    if (currentHand.cards.length !== 2) return;
    if (currentHand.cards[0].rank !== currentHand.cards[1].rank && currentHand.cards[0].val !== currentHand.cards[1].val) return;
    if ((coins || 0) < currentHand.bet) {
      showToast("Not enough coins to split!", "error");
      return;
    }
    spendCoins(currentHand.bet);
    playChipSound();
    playCardSlide();
    const activeDeck = [...deck];
    const card1 = currentHand.cards[0];
    const card2 = currentHand.cards[1];
    const extra1 = activeDeck.pop();
    const extra2 = activeDeck.pop();
    setDeck(activeDeck);
    const handA = { cards: [card1, extra1], bet: currentHand.bet, isDone: false, isBusted: false, isBlackjack: false, result: null };
    const handB = { cards: [card2, extra2], bet: currentHand.bet, isDone: false, isBusted: false, isBlackjack: false, result: null };
    const newHands = [...playerHands.slice(0, currentHandIdx), handA, handB, ...playerHands.slice(currentHandIdx + 1)];
    setPlayerHands(newHands);
    setCroupierMsg("Split pairs! Playing Hand #1");
  };
  const runDealerTurn = (pHands, dCards, activeDeck, activeInsurance = 0) => {
    const allBusted = pHands.every((h) => h.isBusted);
    if (allBusted) {
      concludeRound(pHands, dCards, activeInsurance);
      return;
    }
    let curDeck = [...activeDeck];
    let curDealerCards = [...dCards];
    const dealerStep = () => {
      const dScore = calculateHandScore(curDealerCards);
      if (dScore.score < 17) {
        playCardSlide();
        const nextCard = curDeck.pop();
        curDealerCards.push(nextCard);
        setDealerHand({ cards: [...curDealerCards], isDone: false, isBusted: false, isBlackjack: false, score: dScore.score });
        setDeck([...curDeck]);
        setTimeout(dealerStep, 700);
      } else {
        concludeRound(pHands, curDealerCards, activeInsurance);
      }
    };
    dealerStep();
  };
  const concludeRound = (finalHands, finalDealerCards, activeInsurance = 0) => {
    setPhase("ROUND_OVER");
    const dEval = calculateHandScore(finalDealerCards);
    setDealerHand({
      cards: finalDealerCards,
      isDone: true,
      isBusted: dEval.isBust,
      isBlackjack: dEval.isBlackjack,
      score: dEval.score
    });
    let totalWon = 0;
    let anyWin = false;
    let naturalBJ = false;
    if (activeInsurance > 0 && dEval.isBlackjack) {
      totalWon += activeInsurance * 3;
    }
    const resolvedHands = finalHands.map((h) => {
      const pEval = calculateHandScore(h.cards);
      let outcome = "LOSE";
      let handPayout = 0;
      if (pEval.isBust) {
        outcome = "BUST";
      } else if (pEval.isFiveCardCharlie) {
        outcome = "5-CARD CHARLIE (WIN 2:1)";
        handPayout = h.bet + Math.floor(h.bet * 2);
        anyWin = true;
      } else if (pEval.isBlackjack) {
        if (dEval.isBlackjack) {
          outcome = "PUSH (TIE)";
          handPayout = h.bet;
        } else {
          outcome = "BLACKJACK (WIN 3:2)";
          handPayout = h.bet + Math.floor(h.bet * 1.5);
          anyWin = true;
          naturalBJ = true;
        }
      } else if (dEval.isBust) {
        outcome = "DEALER BUST (WIN 1:1)";
        handPayout = h.bet * 2;
        anyWin = true;
      } else if (pEval.score > dEval.score) {
        outcome = "WIN 1:1";
        handPayout = h.bet * 2;
        anyWin = true;
      } else if (pEval.score === dEval.score) {
        outcome = "PUSH (TIE)";
        handPayout = h.bet;
      } else {
        outcome = "DEALER WINS";
      }
      totalWon += handPayout;
      return { ...h, result: outcome, payout: handPayout };
    });
    setPlayerHands(resolvedHands);
    setRoundPayout(totalWon);
    if (incrementStat) {
      incrementStat("blackjackHands", 1);
      incrementStat("gamesPlayedCount", 1);
    }
    if (anyWin) {
      setWinStreak((s) => s + 1);
      if (incrementStat) incrementStat("blackjackWins", 1);
      if (naturalBJ && incrementStat) incrementStat("blackjackBlackjacks", 1);
      const currentHS = stats?.blackjackHighScore || 0;
      if (totalWon > currentHS && updateStat) {
        updateStat("blackjackHighScore", totalWon);
      }
      if (totalWon > 0) addCoins(totalWon);
      if (naturalBJ) {
        playAirhorn();
        triggerConfetti();
        setCroupierMsg("HOT DAMN! BLACKJACK PAYS OUT!");
      } else {
        playWin();
        setCroupierMsg("Winner, winner! Collect your chips.");
      }
      if (totalWon >= 1e3) {
        triggerConfetti();
        feedService.publish(
          "just swept the Cyber 21 table for " + totalWon.toLocaleString() + " CP! 🃏🔥",
          "win",
          userProfile?.name || "Player"
        );
      }
    } else if (totalWon > 0) {
      addCoins(totalWon);
      setCroupierMsg("Push! Your bet is returned.");
    } else {
      setWinStreak(0);
      playBustSound();
      setCroupierMsg("Dealer takes the hand. Re-bet and double down, bro.");
      const totalStaked = finalHands.reduce((acc, h) => acc + (h.bet || 0), 0);
      if (totalStaked > 0) {
        setLostBet(totalStaked);
        setHasClaimedLossInsurance(false);
      }
    }
  };
  const renderCard = (card, isHidden = false, key = "") => {
    if (isHidden) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "80px",
        height: "115px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #0e101f, #1a153b)",
        border: "2px solid #ff007f",
        boxShadow: "0 0 15px rgba(255, 0, 127, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "2px dashed #00e5ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#00e5ff",
        fontSize: "1.2rem",
        fontWeight: "bold"
      }, children: "?" }) }, key);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "80px",
      height: "115px",
      borderRadius: "10px",
      background: "linear-gradient(145deg, #0f101d, #07080f)",
      border: "2px solid " + card.suitColor,
      boxShadow: "0 0 12px " + card.suitColor + "40",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "6px",
      boxSizing: "border-box",
      position: "relative",
      transition: "transform 0.2s",
      fontFamily: '"Orbitron", monospace'
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "3px", color: card.suitColor, fontWeight: "bold", fontSize: "0.9rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: card.rank }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem" }, children: card.suit })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }, children: card.rank === "J" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: "1px solid " + card.suitColor,
        background: card.suitColor + "18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: card.suitColor, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2", fill: card.suitColor + "33" }) }) }) : card.rank === "Q" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: "1px solid " + card.suitColor,
        background: card.suitColor + "18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: card.suitColor, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 19h16l-2-10-4 4-2-7-2 7-4-4-2 10z", fill: card.suitColor + "33" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "6", r: "1.5", fill: card.suitColor })
      ] }) }) : card.rank === "K" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: "1px solid " + card.suitColor,
        background: card.suitColor + "18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: card.suitColor, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 19h20l-3-12-5 6-2-8-2 8-5-6-3 12z", fill: card.suitColor + "33" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "21", x2: "22", y2: "21", strokeWidth: "2" })
      ] }) }) : card.rank === "A" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          width: "36px",
          height: "36px",
          border: "1px solid " + card.suitColor + "66",
          transform: "rotate(45deg)",
          boxShadow: "0 0 10px " + card.suitColor + "33",
          borderRadius: "4px",
          background: card.suitColor + "15"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.7rem", color: card.suitColor, textShadow: "0 0 10px " + card.suitColor, position: "relative", zIndex: 1 }, children: card.suit })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.8rem", color: card.suitColor, textShadow: "0 0 10px " + card.suitColor }, children: card.suit }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "3px", color: card.suitColor, fontWeight: "bold", fontSize: "0.8rem", justifyContent: "flex-end", transform: "rotate(180deg)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: card.rank }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem" }, children: card.suit })
      ] })
    ] }, key);
  };
  const hilo = calculateHiLo();
  const canDouble = phase === "PLAYER_TURN" && playerHands[currentHandIdx]?.cards.length === 2 && (coins || 0) >= playerHands[currentHandIdx]?.bet;
  const canSplit = phase === "PLAYER_TURN" && playerHands[currentHandIdx]?.cards.length === 2 && (playerHands[currentHandIdx]?.cards[0]?.rank === playerHands[currentHandIdx]?.cards[1]?.rank || playerHands[currentHandIdx]?.cards[0]?.val === playerHands[currentHandIdx]?.cards[1]?.val) && (coins || 0) >= playerHands[currentHandIdx]?.bet;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", style: {
    minHeight: "100vh",
    background: "#05070e",
    color: "white",
    fontFamily: '"Orbitron", monospace',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    paddingBottom: "120px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "960px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
      background: "rgba(15, 15, 30, 0.75)",
      padding: "12px 20px",
      borderRadius: "16px",
      border: "1px solid rgba(0, 229, 255, 0.25)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/arcade", style: {
        color: "#00e5ff",
        textDecoration: "none",
        fontWeight: "800",
        fontSize: "0.85rem",
        letterSpacing: "1px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "10px",
        background: "rgba(0, 229, 255, 0.08)",
        border: "1px solid rgba(0, 229, 255, 0.3)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
        "ARCADE HUB"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "16px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontSize: "0.8rem",
          color: "#ff007f",
          fontWeight: "800",
          letterSpacing: "0.5px"
        }, children: [
          "STREAK: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff" }, children: winStreak })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontSize: "0.8rem",
          color: "rgba(255, 255, 255, 0.8)",
          letterSpacing: "0.5px"
        }, children: [
          "BEST WIN: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: "900", color: "#ffd700" }, children: [
            (stats?.blackjackHighScore || 0).toLocaleString(),
            " CP"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          background: "rgba(255, 215, 0, 0.08)",
          border: "1px solid rgba(255, 215, 0, 0.3)",
          padding: "6px 14px",
          borderRadius: "10px",
          fontWeight: "800",
          color: "#ffd700",
          fontSize: "0.9rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#ffd700",
            boxShadow: "0 0 8px #ffd700"
          } }),
          (coins || 0).toLocaleString(),
          " CP"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
        margin: 0,
        fontSize: "2.4rem",
        background: "linear-gradient(135deg, #00ff66, #00e5ff, #ff007f)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textTransform: "uppercase",
        letterSpacing: "2px",
        filter: "drop-shadow(0 0 15px rgba(0, 255, 102, 0.4))"
      }, children: "CYBER 21: HIGH-ROLLER BLACKJACK" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "6px 0 12px", color: "#a0a0c0", fontSize: "0.85rem" }, children: "NATURAL 21 PAYS 3:2 • 5-CARD CHARLIE PAYS 2:1 • SPLIT & DOUBLE DOWN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "10px" }, children: Object.values(TABLES).map((tbl) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          disabled: phase !== "BETTING",
          onClick: () => {
            setTableTier(tbl.id);
            setBet(tbl.min);
          },
          style: {
            background: tableTier === tbl.id ? tbl.color : "rgba(255,255,255,0.05)",
            color: tableTier === tbl.id ? "#000" : "#fff",
            border: "1px solid " + tbl.color,
            borderRadius: "20px",
            padding: "6px 16px",
            fontSize: "0.8rem",
            fontWeight: "bold",
            cursor: phase === "BETTING" ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            boxShadow: tableTier === tbl.id ? "0 0 15px " + tbl.color + "55" : "none"
          },
          children: [
            tbl.name,
            " (",
            tbl.min,
            " - ",
            tbl.max,
            " CP)"
          ]
        },
        tbl.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      maxWidth: "960px",
      background: "radial-gradient(circle at 50% 25%, #0d2818 0%, #06140d 70%, #030805 100%)",
      border: "3px solid " + activeTable.color,
      borderRadius: "24px",
      padding: "30px 20px",
      boxShadow: "0 0 40px " + activeTable.color + "33, inset 0 0 60px rgba(0,0,0,0.8)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "30px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "absolute",
        top: "15px",
        left: "20px",
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(0, 229, 255, 0.3)",
        borderRadius: "8px",
        padding: "6px 12px",
        fontSize: "0.75rem",
        color: "#00e5ff"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "CARD MATRIX COUNT: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { style: { color: hilo.count > 0 ? "#00ff66" : hilo.count < 0 ? "#ff0055" : "#fff" }, children: [
            hilo.count > 0 ? "+" : "",
            hilo.count
          ] }),
          " (TRUE: ",
          hilo.trueCount,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: "0.7rem" }, children: [
          "SHOE: ",
          deck.length,
          " CARDS LEFT (",
          hilo.penetration,
          "%)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #090d16, #1e1b4b)",
            border: "2px solid #ffd700",
            boxShadow: "0 0 16px rgba(255, 215, 0, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#ffd700", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "10", rx: "3", fill: "rgba(255, 215, 0, 0.15)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "5", r: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 7v4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "7", y1: "15", x2: "17", y2: "15", stroke: "#00e5ff", strokeWidth: "2" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              position: "absolute",
              bottom: -2,
              right: -2,
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#00ff66",
              border: "2px solid #000",
              boxShadow: "0 0 6px #00ff66"
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            background: "rgba(0,0,0,0.7)",
            border: "1px solid #ffd700",
            borderRadius: "12px",
            padding: "8px 16px",
            fontSize: "0.85rem",
            color: "#ffd700",
            maxWidth: "400px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00e5ff", fontWeight: "bold", marginRight: "6px" }, children: "[AI CROUPIER]" }),
            croupierMsg
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "12px", minHeight: "115px" }, children: dealerHand.cards.map((c, idx) => {
          const isHoleHidden = phase === "PLAYER_TURN" && idx === 1;
          return renderCard(c, isHoleHidden, "dealer_" + idx);
        }) }),
        dealerHand.cards.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          marginTop: "8px",
          background: "rgba(0,0,0,0.5)",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "0.8rem",
          color: "#ccc"
        }, children: [
          "DEALER SHOWS: ",
          phase === "PLAYER_TURN" ? dealerHand.cards[0]?.val : dealerHand.score,
          dealerHand.isBlackjack && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffd700", marginLeft: "6px" }, children: "👑 BLACKJACK" }),
          dealerHand.isBusted && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ff0055", marginLeft: "6px" }, children: "💥 BUST" })
        ] })
      ] }),
      insuranceOffered && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(255, 0, 127, 0.2)",
        border: "2px solid #ff007f",
        borderRadius: "16px",
        padding: "16px",
        textAlign: "center",
        maxWidth: "480px",
        margin: "0 auto"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", fontWeight: "bold", fontSize: "1rem", marginBottom: "8px" }, children: "🛡️ DEALER SHOWS ACE: BUY INSURANCE?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ff88aa", fontSize: "0.8rem", marginBottom: "14px" }, children: [
          "Cost: ",
          Math.floor(bet / 2),
          " CP • Pays 2:1 if dealer has Blackjack!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "15px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SquishyButton,
            {
              onClick: () => handleInsurance(true),
              style: {
                background: "#00ff66",
                color: "#000",
                fontWeight: "bold",
                padding: "8px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                border: "none"
              },
              children: "ACCEPT INSURANCE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SquishyButton,
            {
              onClick: () => handleInsurance(false),
              style: {
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontWeight: "bold",
                padding: "8px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                border: "1px solid #fff"
              },
              children: "PASS"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap",
        minHeight: "160px"
      }, children: playerHands.map((hand, hIdx) => {
        const hScore = calculateHandScore(hand.cards);
        const isCurrent = phase === "PLAYER_TURN" && currentHandIdx === hIdx;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: isCurrent ? "rgba(0, 229, 255, 0.12)" : "rgba(0,0,0,0.3)",
              border: isCurrent ? "2px solid #00e5ff" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: isCurrent ? "0 0 20px rgba(0,229,255,0.3)" : "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#ffd700", marginBottom: "8px", fontWeight: "bold" }, children: [
                "HAND #",
                hIdx + 1,
                " • ",
                hand.bet,
                " CP"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px", marginBottom: "8px" }, children: hand.cards.map((c, cIdx) => renderCard(c, false, `p_${hIdx}_${cIdx}`)) }),
              hand.cards.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: hScore.isBust ? "#ff0055" : hScore.isBlackjack ? "#ffd700" : "#00ffcc"
              }, children: [
                "TOTAL: ",
                hScore.score,
                " ",
                hScore.isSoft && !hScore.isBlackjack ? "(SOFT)" : "",
                hand.result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  fontSize: "0.8rem",
                  color: hand.payout > 0 ? "#00ff66" : "#ff0055",
                  marginTop: "4px"
                }, children: [
                  hand.result,
                  " ",
                  hand.payout > 0 ? `(+${hand.payout} CP)` : ""
                ] })
              ] })
            ]
          },
          hIdx
        );
      }) }),
      phase === "PLAYER_TURN" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: handleHit,
            style: {
              background: "linear-gradient(135deg, #00ff66, #00c6ff)",
              color: "#000",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "12px 28px",
              borderRadius: "12px",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 0 15px rgba(0, 255, 102, 0.4)"
            },
            children: "🟢 HIT"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: handleStand,
            style: {
              background: "linear-gradient(135deg, #ff0055, #ff007f)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "12px 28px",
              borderRadius: "12px",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 0 15px rgba(255, 0, 85, 0.4)"
            },
            children: "🔴 STAND"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: handleDouble,
            disabled: !canDouble,
            style: {
              background: canDouble ? "linear-gradient(135deg, #ffd700, #ff8800)" : "#333",
              color: canDouble ? "#000" : "#888",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: canDouble ? "pointer" : "not-allowed",
              border: "none",
              boxShadow: canDouble ? "0 0 15px rgba(255, 215, 0, 0.4)" : "none"
            },
            children: "🟡 DOUBLE DOWN"
          }
        ),
        canSplit && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: handleSplit,
            style: {
              background: "linear-gradient(135deg, #d500f9, #7928ca)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 0 15px rgba(213, 0, 249, 0.4)"
            },
            children: "🟣 SPLIT PAIRS"
          }
        )
      ] }),
      phase === "ROUND_OVER" && lostBet > 0 && !hasClaimedLossInsurance && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        width: "100%",
        maxWidth: "560px",
        margin: "0 auto 16px auto",
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(255, 0, 85, 0.15) 100%)",
        border: "1px solid rgba(245, 158, 11, 0.5)",
        borderRadius: "16px",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.6rem" }, children: "🛡️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ffd700", fontWeight: "900", fontSize: "0.8rem", fontFamily: "monospace" }, children: "SPONSOR LOSS INSURANCE AVAILABLE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#cbd5e1", fontSize: "0.74rem" }, children: [
              "Recover 50% (+",
              Math.floor(lostBet / 2),
              " CP) by watching a 10s Sponsor Spot."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowSponsorModal(true),
            style: {
              background: "linear-gradient(135deg, #ffd700 0%, #ff8800 100%)",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              padding: "8px 14px",
              fontWeight: "900",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 0 12px rgba(255, 215, 0, 0.4)",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📺" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "CLAIM +",
                Math.floor(lostBet / 2),
                " CP"
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RewardedSponsorModal,
        {
          isOpen: showSponsorModal,
          onClose: () => setShowSponsorModal(false),
          rewardTitle: `+${Math.floor(lostBet / 2)} CP CASHBACK`,
          rewardIcon: "🛡️",
          rewardDescription: `Complete the sponsor spot to recover 50% of your lost blackjack bet (+${Math.floor(lostBet / 2)} CP)!`,
          onRewarded: () => {
            const refund = Math.floor(lostBet / 2);
            addCoins(refund);
            setHasClaimedLossInsurance(true);
            setLostBet(0);
            showToast(`50% Loss Insurance Recovered (+${refund} CP)!`, "coin");
          }
        }
      ),
      (phase === "BETTING" || phase === "ROUND_OVER") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", color: "#888" }, children: "SELECT CHIP:" }),
          [activeTable.min, activeTable.min * 2, activeTable.min * 5, activeTable.min * 10].filter((c) => c <= activeTable.max).map((chipAmt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                playChipSound();
                setBet(chipAmt);
              },
              style: {
                background: bet === chipAmt ? "#ffd700" : "rgba(255,255,255,0.05)",
                color: bet === chipAmt ? "#000" : "#fff",
                border: bet === chipAmt ? "2px solid #ffd700" : "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                width: "46px",
                height: "46px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.75rem",
                boxShadow: bet === chipAmt ? "0 0 12px rgba(255,215,0,0.5)" : "none"
              },
              children: chipAmt
            },
            chipAmt
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SquishyButton,
          {
            onClick: () => {
              setPhase("BETTING");
              handleDeal();
            },
            style: {
              background: "linear-gradient(135deg, #00ff66, #00e5ff)",
              color: "#000",
              fontWeight: "bold",
              fontSize: "1.2rem",
              padding: "14px 45px",
              borderRadius: "30px",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 0 25px rgba(0, 255, 102, 0.4)",
              letterSpacing: "1px"
            },
            children: phase === "ROUND_OVER" ? `RE-BET & DEAL (${bet} CP)` : `PLACE BET & DEAL (${bet} CP)`
          }
        )
      ] })
    ] })
  ] });
};
export {
  RANKS,
  SUITS,
  TABLES,
  calculateHandScore,
  createDeck,
  Cyber21 as default
};
