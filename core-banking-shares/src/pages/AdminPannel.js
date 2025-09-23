import React, { useState, useEffect, useRef, useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
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

const AdminPannel = () => {
    const [chartData, setChartData] = useState([]);
    const [selectedRange, setSelectedRange] = useState("1 Day");
    const [shareSummary, setShareSummary] = useState(null);
    const [bankDetails, setBankDetails] = useState(null);
    const chartRef = useRef();
    const [chartWidth, setChartWidth] = useState(800);

    const bankEmployee = JSON.parse(localStorage.getItem("employee"));
    const bankId = JSON.parse(localStorage.getItem("bankId"));
    const defaultShareId = 1;

    // Fetch bank details
    const fetchBankDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/shares/bank/${bankId}/shares`);
            const data = await res.json();
            if (res.ok) setBankDetails(data);
        } catch (err) {
            console.error(err);
        }
    };


    // Fetch share summary
    const fetchShareSummary = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/shares/summary/${defaultShareId}`);
            const data = await res.json();
            if (res.ok) setShareSummary(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch chart data
    const fetchChartData = async (range) => {
        try {
            const res = await fetch(`http://localhost:5000/api/shares/history/${defaultShareId}?range=${range}`);
            const rawData = await res.json();
            const mapped = rawData.map(d => ({
                date: new Date(d.date),
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            }));
            setChartData(mapped.sort((a, b) => a.date - b.date));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // Function to fetch all data
        const fetchAll = () => {
            fetchBankDetails();
            fetchShareSummary();
            fetchChartData(selectedRange);
        };

        // Fetch immediately on mount
        fetchAll();

        // Set interval to fetch every 10 seconds
        const interval = setInterval(fetchAll, 10000);

        // Handle resize
        const handleResize = () => {
            if (chartRef.current) {
                const width = chartRef.current.offsetWidth - 120;
                setChartWidth(width > 0 ? width : 600);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        // Cleanup on unmount
        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, [selectedRange]);


    const { data, xScale, xAccessor, displayXAccessor } = useMemo(() => {
        if (!chartData || chartData.length === 0) return { data: [], xScale: null, xAccessor: null, displayXAccessor: null };
        const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(d => d.date);
        return xScaleProvider(chartData);
    }, [chartData]);

    const getTimeFormat = (range) => {
        switch (range) {
            case "1 Day": return "%H:%M";
            case "1 Week":
            case "1 Month":
            case "3 Month":
            case "6 Month": return "%d %b";
            case "1 Year":
            case "3 Years":
            case "ALL": return "%b %Y";
            default: return "%d %b";
        }
    };

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
                            <Typography variant="body2" color="text.secondary">DCC Bank</Typography>
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
                                    Last update {new Date(shareSummary.lastUpdate).toLocaleString()}
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

                {/* Chart + Bank Share Details */}
                <Box sx={{ display: "flex", gap: 3 }}>
                    {/* Chart Left */}
                    <Box ref={chartRef} sx={{ flex: 3, height: 400 }}>
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
                                    <XAxis axisAt="bottom" orient="bottom" ticks={6} tickFormat={timeFormat(getTimeFormat(selectedRange))} />
                                    <YAxis axisAt="left" orient="left" ticks={6} tickFormat={format(".2f")} stroke="#e0e0e0" />
                                    <CandlestickSeries
                                        fill={d => (d.close > d.open ? "#26a69a" : "#ef5350")}
                                        stroke={d => (d.close > d.open ? "#26a69a" : "#ef5350")}
                                        wickStroke={d => (d.close > d.open ? "#26a69a" : "#ef5350")}
                                    />
                                    <CrossHairCursor stroke="#666" />
                                    <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat("%Y-%m-%d %H:%M")} />
                                    <MouseCoordinateY at="left" orient="left" displayFormat={format(".2f")} />
                                </Chart>
                            </ChartCanvas>
                        )}
                    </Box>

                    {/* Bank Share Details Right */}
                    <Paper sx={{ flex: 1, p: 2, borderRadius: 2, height: 400, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Bank Share Details:-</Typography>
                        {bankDetails && bankDetails.length > 0 ? (
                            bankDetails.map(share => (
                                <Box key={share.id} mb={2}>
                                    <Typography variant="subtitle1" fontWeight="bold">Share Name: {share.name}</Typography>
                                    <Typography>Total Shares: {share.totalIssued}</Typography>
                                    <Typography>Available Shares: {share.available}</Typography>
                                    <Typography>Market Price: ₹{share.marketPrice}</Typography>
                                    <Typography>Face Value: ₹{share.faceValue}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography>Loading...</Typography>
                        )}
                    </Paper>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminPannel;
