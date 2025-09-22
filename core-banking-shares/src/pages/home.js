import React, { useState, useMemo, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import DccLogo from "../assets/bhandara-dcc-logo.png";
import { Modal, TextField, IconButton } from "@mui/material";


import {
  ChartCanvas,
  Chart,
  XAxis,
  YAxis,
  CandlestickSeries,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  discontinuousTimeScaleProviderBuilder,
} from "react-financial-charts";

import { min, max } from "d3-array";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";


const Home = () => {
  const [balance, setBalance] = useState(1000);
  const [selectedRange, setSelectedRange] = useState("1 Day");
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [selectedShare, setSelectedShare] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openSellModal, setOpenSellModal] = useState(false);
  const defaultShareId = 1;
  const [selectedShareForSell, setSelectedShareForSell] = useState(null);
  const [customerShares, setCustomerShares] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [shareSummary, setShareSummary] = useState(null);

  // Chart responsive width
  const chartRef = useRef();
  const [chartWidth, setChartWidth] = useState(800);


  useEffect(() => {
    fetchShareSummary();
    const handleResize = () => {
      if (chartRef.current) {
        const width = chartRef.current.offsetWidth - 120;
        console.log("Chart width:", width);
        setChartWidth(width > 0 ? width : 600);
      }
    };

    handleResize();
    fetchChartData(selectedRange);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [selectedRange]);

  // Helper for dynamic time format
  const getTimeFormat = (range) => {
    switch (range) {
      case "1 Day":
        return "%H:%M"; // hourly
      case "1 Week":
      case "1 Month":
        return "%d %b"; // day + month
      case "3 Month":
      case "6 Month":
        return "%b %Y"; // month + year
      case "1 Year":
      case "3 Years":
      case "ALL":
        return "%Y"; // only year
      default:
        return "%Y-%m-%d";
    }
  };


  const fetchShareSummary = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/shares/summary/${defaultShareId}`);
      const data = await res.json();
      if (res.ok) {
        setShareSummary(data);
      } else {
        console.error("Error fetching summary:", data.error);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };


  const fetchChartData = async (range) => {
    try {
      const res = await fetch(`http://localhost:5000/api/shares/history/${defaultShareId}?range=${range}`);
      const rawData = await res.json();

      const mapped = rawData.map((d) => ({
        date: new Date(d.date),
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      const sortedData = mapped.sort((a, b) => a.date - b.date);  // ✅ rakho

      setChartData(sortedData);
      console.log("Chart data:", sortedData); // Correct place to log
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };



  const fetchCustomerShares = async () => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (!customer) return;

    try {
      const res = await fetch(`http://localhost:5000/api/shares/customer/${customer.id}`);
      const data = await res.json();
      if (res.ok) {
        // Map backend keys to frontend-friendly keys
        const mappedShares = data.map(s => ({
          id: s.id,                  // ← use `id` from backend
          name: s.name,
          ownedQuantity: s.ownedQuantity || s.quantity, // depending on what backend sends
          currentPrice: s.currentPrice,
          totalInvested: s.totalInvested
        }));
        setCustomerShares(mappedShares);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching customer shares");
    }
  };

  // API calls
  const handleOpenBuy = async (shareId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/shares/${shareId}`);
      const data = await res.json();
      console.log("Fetched share:", data.share);

      if (res.ok) {
        // ✅ Correct mapping
        const mappedShare = {
          id: data.share.id,
          name: data.share.name,
          marketPrice: data.share.marketPrice,
          available: data.share.available,
        };
        setSelectedShare(mappedShare);  // ab seedha marketPrice milega
        setQuantity(1);
        setOpenBuyModal(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching share info");
    }
  };



  const handleBuy = async (shareId, qty) => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (!customer) return alert("Customer not found in local storage");

    try {
      const res = await fetch("http://localhost:5000/api/shares/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id, shareId, quantity: qty }),
      });

      const data = await res.json();
      console.log("Buy response:", data);

      if (res.ok) {
        const price = data.transaction?.price ?? selectedShare?.marketPrice ?? 0; // fallback
        setBalance(prev => prev - price * qty);

        fetchCustomerShares();
        fetchChartData();
        fetchShareSummary();

        alert(`Bought ${qty} shares successfully!`);
      } else {
        alert(data.error || "Error buying share");
      }
    } catch (err) {
      console.error(err);
      alert("Error buying share");
    }
  };


  const handleSell = async (shareId, qty) => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (!customer) return alert("Customer not found in local storage");

    try {
      // Fetch latest customer shares
      const res = await fetch(`http://localhost:5000/api/shares/customer/${customer.id}`);
      const latestShares = await res.json();

      const shareInfo = latestShares.find(s => Number(s.id) === Number(shareId));
      if (!shareInfo) return alert("You do not own this share.");

      // Ensure qty does not exceed owned quantity
      if (qty > shareInfo.ownedQuantity) qty = shareInfo.ownedQuantity;
      if (qty <= 0) return alert("You have no shares to sell.");

      // Call backend sell API
      const sellRes = await fetch("http://localhost:5000/api/shares/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customer.id),
          shareId: Number(shareId),
          quantity: Number(qty),
        }),
      });

      const sellData = await sellRes.json();
      if (!sellRes.ok) return alert(sellData.error || "Error selling share");

      // Update balance and refresh data
      setBalance(prev => prev + (sellData.price ?? 0) * qty);
      fetchCustomerShares();
      fetchChartData();
      fetchShareSummary();

      alert(`Sold ${qty} shares of ${shareInfo.name} successfully!`);
    } catch (err) {
      console.error(err);
      alert("Error selling share");
    }
  };



  const handleOpenSellModal = async () => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (!customer) return alert("Customer not found in local storage");

    try {
      const res = await fetch(`http://localhost:5000/api/shares/customer/${customer.id}`);
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      if (data.length === 0) {
        alert("You don’t have any shares to sell");
        return;
      }

      // Map backend keys properly
      const mappedShares = data.map(s => ({
        id: s.id,                  // ← use 'id' from backend
        name: s.name,
        ownedQuantity: s.ownedQuantity,
        currentPrice: s.currentPrice,
        totalInvested: s.totalInvested
      }));

      setCustomerShares(mappedShares);
      setSelectedShareForSell(mappedShares[0]); // default first share
      setQuantity(mappedShares[0].ownedQuantity > 0 ? 1 : 0);
      setOpenSellModal(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching customer shares");
    }
  };

  // Ensure chartData is mapped to Date objects before useMemo
  const { data, xScale, xAccessor, displayXAccessor } = useMemo(() => {
    if (!chartData || chartData.length === 0)
      return { data: [], xScale: null, xAccessor: null, displayXAccessor: null };

    // Make sure chartData dates are JS Date objects
    const processedData = chartData.map(d => ({
      ...d,
      date: d.date instanceof Date ? d.date : new Date(d.date)
    }));

    const xScaleProvider = discontinuousTimeScaleProviderBuilder()
      .inputDateAccessor(d => d.date);

    const { data: linearData, xScale, xAccessor, displayXAccessor } = xScaleProvider(processedData);

    return { data: linearData, xScale, xAccessor, displayXAccessor };
  }, [chartData]);




  return (
    <Box sx={{ p: 2, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
        {/* Header */}
        <Toolbar sx={{ justifyContent: "space-between", px: 0, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={DccLogo} alt="DCC Logo" sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Bhandara District Central Co-Operative Bank Equity Share
              </Typography>
              <Typography variant="body2" color="text.secondary">
                DCC Bank
              </Typography>
            </Box>
          </Stack>
          <Box textAlign="right" display="flex" flexDirection="column" alignItems="flex-end">
            {shareSummary ? (
              <>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5" fontWeight="bold">₹{shareSummary.price}</Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: shareSummary.trend >= 0 ? "green" : "red", mt: 0.5 }}
                >
                  {shareSummary.trend >= 0 ? "▲" : "▼"} {shareSummary.trend.toFixed(2)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last update {shareSummary.lastUpdate}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">Loading...</Typography>
            )}
          </Box>

        </Toolbar>

        <Box sx={{ width: '100%', height: '1px', backgroundColor: 'divider', my: 2 }} />

        {/* Time Range Buttons */}
        <Stack direction="row" spacing={1} mt={2} mb={3} ml={16}>
          {["1 Day", "1 Week", "1 Month", "3 Month", "6 Month", "1 Year", "3 Years", "ALL"].map(range => (
            <Button
              key={range}
              variant={selectedRange === range ? "contained" : "outlined"}
              size="small"
              onClick={() => setSelectedRange(range)}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "0.75rem",
                minWidth: "auto",
                padding: "4px 12px",
                color: selectedRange === range ? "white" : "text.primary",
                backgroundColor: selectedRange === range ? "#333" : "transparent",
                borderColor: selectedRange === range ? "#333" : "#e0e0e0",
                "&:hover": {
                  backgroundColor: selectedRange === range ? "#444" : "#f0f0f0",
                  borderColor: selectedRange === range ? "#444" : "#ccc",
                },
              }}
            >
              {range}
            </Button>
          ))}
        </Stack>

        {/* Chart & Buy/Sell */}
        <Box sx={{ display: "flex", flexDirection: "row", height: 400 }}>
          {/* Chart */}
          <Box ref={chartRef} sx={{ flex: 1, height: 400 }}>
            {data.length > 0 && xScale && xAccessor && (
              <ChartCanvas
                height={400}
                width={chartWidth}
                ratio={window.devicePixelRatio}
                margin={{ left: 60, right: 60, top: 10, bottom: 50 }}
                data={data}
                seriesName="ShareChart"
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                xExtents={[xAccessor(data[0]), xAccessor(data[data.length - 1])]}
              >
                <Chart id={1} yExtents={d => [d.low, d.high]}>
                  <XAxis
                    axisAt="bottom"
                    orient="bottom"
                    ticks={6}
                    tickFormat={timeFormat(getTimeFormat(selectedRange))}   // ✅ yeh add/change karna hai
                  />

                  <YAxis
                    axisAt="left"
                    orient="left"
                    ticks={6}
                    tickFormat={format(".2f")}
                    stroke="#e0e0e0"
                  />
                  <CandlestickSeries
                    fill={d => (d.close > d.open ? "#26a69a" : "#ef5350")}
                    stroke={d => (d.close > d.open ? "#26a69a" : "#ef5350")}
                    wickStroke={d => (d.close > d.open ? "#26a69a" : "#ef5350")}
                  />
                  <CrossHairCursor stroke="#666" />
                  <MouseCoordinateX
                    at="bottom"
                    orient="bottom"
                    displayFormat={timeFormat("%Y-%m-%d %H:%M")}   // ✅ simple readable format
                  />
                  <MouseCoordinateY
                    at="left"
                    orient="left"
                    displayFormat={format(".2f")}
                  />
                </Chart>
              </ChartCanvas>
            )}
          </Box>

          {/* Buy/Sell Controls */}
          <Box sx={{ width: 120, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", ml: 2 }}>
            <Button
              variant="contained"
              color="success"
              sx={{ mb: 2, width: "100%", borderRadius: "20px" }}
              onClick={() => handleOpenBuy(defaultShareId)}
            >
              Buy
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ width: "100%", borderRadius: "20px" }}
              onClick={handleOpenSellModal}
            >
              Sell
            </Button>
          </Box>
        </Box>
      </Paper>

      <Modal open={openSellModal} onClose={() => setOpenSellModal(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <IconButton
            onClick={() => setOpenSellModal(false)}
            sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
          >
            ✖
          </IconButton>
          <Typography variant="h6" mb={2}>Sell Shares</Typography>

          {customerShares.length === 0 ? (
            <Typography>You don’t have any shares to sell.</Typography>
          ) : (
            <>
              {/* Select Share */}
              <TextField
                select
                label="Select Share"
                value={selectedShareForSell?.id || ""}
                onChange={e => {
                  const share = customerShares.find(s => Number(s.id) === Number(e.target.value));
                  setSelectedShareForSell(share);
                  setQuantity(share.ownedQuantity > 0 ? 1 : 0);
                }}
                SelectProps={{ native: true }}
                fullWidth
                sx={{ mb: 2 }}
              >
                {customerShares.map(share => (
                  <option key={share.id} value={share.id}>
                    {share.name} ({share.ownedQuantity})
                  </option>
                ))}
              </TextField>

              {selectedShareForSell && (
                <>
                  {/* Quantity Input */}
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={e => {
                      const maxQty = Number(selectedShareForSell.ownedQuantity);
                      const val = Number(e.target.value);
                      if (val > maxQty) setQuantity(maxQty);
                      else if (val < 0) setQuantity(0);
                      else setQuantity(val);
                    }}
                    inputProps={{
                      min: 0,
                      max: Number(selectedShareForSell.ownedQuantity)
                    }}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <Typography mb={2}>
                    Total: ₹{selectedShareForSell ? (quantity * selectedShareForSell.currentPrice).toFixed(2) : 0}
                  </Typography>

                  {/* Sell Button */}
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={async () => {
                      if (quantity === 0) return alert("You don’t have shares to sell.");
                      await handleSell(selectedShareForSell.id, quantity);
                      setOpenSellModal(false);
                    }}
                    disabled={quantity < 1}
                  >
                    Sell
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>


      {/* Buy Modal */}
      <Modal open={openBuyModal} onClose={() => setOpenBuyModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 300, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <IconButton
            onClick={() => setOpenBuyModal(false)}
            sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
          >
            ✖
          </IconButton>
          <Typography variant="h6" mb={2}>Buy Shares</Typography>
          {selectedShare && (
            <>
              <Typography mb={1}>Share: {selectedShare.name}</Typography>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val < 0) setQuantity(0);
                  else if (val > selectedShare.available) setQuantity(selectedShare.available);
                  else setQuantity(val);
                }}
                inputProps={{ min: 1, max: selectedShare.available }}
                fullWidth
                sx={{ mb: 1 }}
              />

              <Typography mb={2}>
                Total: ₹{selectedShare ? (quantity * selectedShare.marketPrice).toFixed(2) : 0}
              </Typography>


              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#00ad1aff", "&:hover": { backgroundColor: "#006400" } }}
                onClick={async () => {
                  console.log("Buying:", selectedShare.id, quantity);
                  await handleBuy(selectedShare.id, quantity);
                  setOpenBuyModal(false);
                }}
                disabled={quantity < 1}
              >
                Buy
              </Button>

            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;