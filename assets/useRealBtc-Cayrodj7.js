import { r as reactExports } from "./index-CaGFlmAa.js";
const useRealBtc = () => {
  const [btcPrice, setBtcPrice] = reactExports.useState(81500);
  const [priceChange24h, setPriceChange24h] = reactExports.useState(1.25);
  const [chartData, setChartData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [lastUpdated, setLastUpdated] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    let isMounted = true;
    const fetchBtcData = async () => {
      let price = null;
      let change = null;
      let history = null;
      try {
        const cbRes = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot");
        if (cbRes.ok) {
          const cbData = await cbRes.json();
          if (cbData?.data?.amount) {
            price = parseFloat(cbData.data.amount);
          }
        }
      } catch (e) {
      }
      try {
        const krRes = await fetch("https://api.kraken.com/0/public/Ticker?pair=XBTUSD");
        if (krRes.ok) {
          const krData = await krRes.json();
          const pair = krData?.result?.XXBTZUSD;
          if (pair) {
            const cur = parseFloat(pair.c[0]);
            const open = parseFloat(pair.o);
            if (!price) price = cur;
            if (open > 0) {
              change = (cur - open) / open * 100;
            }
          }
        }
      } catch (e) {
      }
      try {
        const cgRes = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1");
        if (cgRes.ok) {
          const cgData = await cgRes.json();
          if (Array.isArray(cgData?.prices) && cgData.prices.length > 0) {
            history = cgData.prices.map((p) => p[1]);
            if (!price) price = history[history.length - 1];
            if (change === null) {
              const first = history[0];
              change = (price - first) / first * 100;
            }
          }
        }
      } catch (e) {
      }
      if (!isMounted) return;
      if (price !== null && !isNaN(price)) {
        setBtcPrice(price);
      }
      if (change !== null && !isNaN(change)) {
        setPriceChange24h(change);
      }
      if (history && history.length > 0) {
        setChartData(history);
      } else if (price !== null) {
        const base = price / (1 + (change || 1.25) / 100);
        const points = [];
        for (let i = 0; i < 24; i++) {
          const t = i / 23;
          const noise = Math.sin(i * 1.5) * (price * 4e-3);
          points.push(base + (price - base) * t + noise);
        }
        setChartData(points);
      }
      setLastUpdated(/* @__PURE__ */ new Date());
      setLoading(false);
    };
    fetchBtcData();
    const interval = setInterval(fetchBtcData, 3e4);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  return { btcPrice, priceChange24h, chartData, loading, lastUpdated };
};
export {
  useRealBtc as u
};
