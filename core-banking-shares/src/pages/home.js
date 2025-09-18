import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DccLogo from "../assets/bhandara-dcc-logo.png";

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

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

// Generate more realistic dummy data for a multi-month view
const generateDummyData = (numDays) => {
  const data = [];
  let currentPrice = 1000;
  for (let i = 0; i < numDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (numDays - 1 - i)); // Go back in time
    const open = currentPrice;
    const close = open + (Math.random() - 0.5) * 200; // Random price change
    const high = Math.max(open, close) + Math.random() * 100;
    const low = Math.min(open, close) - Math.random() * 100;

    data.push({ date, open, high, low, close });
    currentPrice = close; // Next day's open is current day's close
  }
  return data;
};

// Use a larger dataset to better simulate the multi-month view
const dummyData = generateDummyData(365); // Generate data for 1 year

const Home = () => {
  const [selectedRange, setSelectedRange] = useState("1 Day");

  const { data, xScale, xAccessor, displayXAccessor } = useMemo(() => {
    const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => d.date);
    return xScaleProvider(dummyData);
  }, []);

  // Custom formats for Y-axis (prices) and MouseCoordinateY
  const priceFormat = format("$,.0f"); // Format as $X,XXX with no decimals
  const mousePriceFormat = format("$,.2f"); // Format as $X,XXX.XX for mouse hover

  // Custom formats for X-axis (months) and MouseCoordinateX
  const xAxisTickFormat = timeFormat("%b"); // Abbreviated month
  const mouseDateFormat = timeFormat("%Y-%m-%d"); // Full date for mouse hover

  return (
    <Box sx={{ p: 2, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}>
        {/* Header */}
        <Toolbar sx={{ justifyContent: "space-between", px: 0, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={DccLogo}
              alt="DCC Logo"
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">Bhandara District Central Co-Operative Bank Ltd</Typography>
              <Typography variant="body2" color="text.secondary">DCC</Typography>
            </Box>
          </Stack>
          <Box textAlign="right" display="flex" flexDirection="column" alignItems="flex-end">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h5" fontWeight="bold">1000</Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "15px",
                  borderColor: "#e0e0e0",
                  color: "text.secondary",
                  textTransform: "none",
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                }}
              >
                View All
              </Button>
            </Stack>
            <Typography variant="body2" sx={{ color: "green", mt: 0.5 }}>
              trend title ▲ 70.5%
            </Typography>
            <Typography variant="caption" color="text.secondary">Last update 15.40</Typography>
          </Box>
        </Toolbar>

        {/* Black line added here */}
        <Box sx={{
          width: '100%',
          height: '1px',
          backgroundColor: 'divider', // This uses the theme's divider color, which is a light gray. You can change to 'black' for a solid black line.
          my: 2, // Add some vertical margin for spacing
          // If you want a solid black line like in the Figma, use:
          // backgroundColor: 'black',
        }} />

        {/* Time Range Buttons */}
        <Stack direction="row" spacing={1} justifyContent="center" mt={2} mb={3}>
          {["1 Day", "1 Week", "1 Month", "3 Month", "6 Month", "1 Year", "3 Years", "ALL"].map((range) => (
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

        {/* Candlestick Chart */}
        <Box sx={{ width: "100%", height: 400 }}>
          <ChartCanvas
            height={400}
            width={800}
            ratio={window.devicePixelRatio}
            margin={{ left: 60, right: 60, top: 10, bottom: 40 }}
            data={data}
            seriesName="AmazoneStock"
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
          >
            <Chart id={1} yExtents={(d) => [d.low, d.high]}>
              <XAxis
                axisAt="bottom"
                orient="bottom"
                showTicks={true}
                outerTickSize={0}
                tickFormat={xAxisTickFormat}
                stroke="#e0e0e0"
                tickStroke="#999"
                fontSize={12}
                opacity={0.8}
              />
              <YAxis
                axisAt="left"
                orient="left"
                ticks={6}
                tickFormat={priceFormat}
                showGrid={true}
                gridLinesStrokeStyle="#e0e0e0"
                stroke="#e0e0e0"
                tickStroke="#999"
                fontSize={12}
                opacity={0.8}
              />
              <CandlestickSeries
                fill={(d) => (d.close > d.open ? "#26a69a" : "#ef5350")}
                stroke={(d) => (d.close > d.open ? "#26a69a" : "#ef5350")}
                wickStroke={(d) => (d.close > d.open ? "#26a69a" : "#ef5350")}
              />
              <CrossHairCursor stroke="#666" />
              <MouseCoordinateX
                at="bottom"
                orient="bottom"
                displayFormat={mouseDateFormat}
                dx={-50}
                textFill="#FFF"
                fill="#666"
              />
              <MouseCoordinateY
                at="left"
                orient="left"
                displayFormat={mousePriceFormat}
                dy={-10}
                textFill="#FFF"
                fill="#666"
              />
            </Chart>
          </ChartCanvas>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;