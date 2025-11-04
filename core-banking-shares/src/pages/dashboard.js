import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Button,
    ButtonGroup,
    Divider,
} from "@mui/material";

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [bankShares, setBankShares] = useState([]);
    const [filter, setFilter] = useState("today"); // only today / yesterday
    const [summary, setSummary] = useState(null);

    const bankId = 1;   // Apna bank ID
    const shareId = 1;  // Share ID for summary

    // 1️⃣ Fetch Bank Shares
    useEffect(() => {
        const fetchBankShares = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/shares/bank/${bankId}/shares`);
                const data = await res.json();
                setBankShares(data);
            } catch (error) {
                console.error("Error fetching bank shares:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBankShares();
    }, [bankId]);

    // 2️⃣ Fetch Share Summary & total trades
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // 2a. Get share price history for selected share
                const res = await fetch(`http://localhost:5000/api/shares/history/${shareId}`);
                const data = await res.json();
                if (!Array.isArray(data)) return;

                const now = new Date();
                let startDate, endDate;

                if (filter === "today") {
                    startDate = new Date();
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date();
                    endDate.setHours(23, 59, 59, 999);
                } else if (filter === "yesterday") {
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 1);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date();
                    endDate.setDate(endDate.getDate() - 1);
                    endDate.setHours(23, 59, 59, 999);
                }

                const filtered = data.filter(
                    (item) => new Date(item.date) >= startDate && new Date(item.date) <= endDate
                );

                let open = 0, close = 0, high = 0, low = 0, avg = 0;

                if (filtered.length > 0) {
                    open = filtered[0].open;
                    close = filtered[filtered.length - 1].close;
                    high = Math.max(...filtered.map(d => d.high));
                    low = Math.min(...filtered.map(d => d.low));
                    avg = (filtered.reduce((sum, d) => sum + d.close, 0) / filtered.length).toFixed(2);
                }

                // 2b. Fetch total trades from backend
                const resTrades = await fetch(
                    `http://localhost:5000/api/transaction/total/${shareId}?filter=${filter}`
                );
                const tradesData = await resTrades.json();
                const totalTrades = tradesData.totalTrades || 0; // 👈 use totalTrades from response

                setSummary({ open, close, high, low, avg, totalTrades });
            } catch (err) {
                console.error("Error fetching share summary:", err);
            }
        };
        fetchSummary();
    }, [filter, shareId]);

    if (loading) {
        return (
            <Box
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Bank Shares Dashboard
            </Typography>

            {/* Bank Shares List */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Bank Shares
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    {bankShares.map((share) => (
                        <Grid item xs={12} md={4} key={share.id}>
                            <Paper sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="h6">{share.name}</Typography>
                                <Typography color="text.secondary">Face Value: ₹{share.faceValue}</Typography>
                                <Typography color="text.secondary">Market Price: ₹{share.marketPrice}</Typography>
                                <Typography color="text.secondary">Total Shares: {share.totalIssued}</Typography>
                                <Typography color="text.secondary">Available Shares: {share.available}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Share Price Summary Box */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Share Price Summary
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 } }}>
                        {["today", "yesterday"].map((f) => (
                            <Button
                                key={f}
                                onClick={() => setFilter(f)}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontWeight: 500,
                                    boxShadow: filter === f ? 3 : 1,
                                    backgroundColor: filter === f ? "primary.main" : "grey.100",
                                    color: filter === f ? "white" : "text.primary",
                                    "&:hover": {
                                        backgroundColor: filter === f ? "primary.dark" : "grey.200",
                                        boxShadow: 4,
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {f}
                            </Button>
                        ))}
                    </Box>
                </Box>
                <Divider sx={{ my: 2 }} />

                {summary ? (
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={2}>
                            <Typography color="text.secondary">Open</Typography>
                            <Typography variant="h6">₹{summary.open}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography color="text.secondary">Close</Typography>
                            <Typography variant="h6">₹{summary.close}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography color="text.secondary">High</Typography>
                            <Typography variant="h6" color="success.main">₹{summary.high}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography color="text.secondary">Low</Typography>
                            <Typography variant="h6" color="error.main">₹{summary.low}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography color="text.secondary">Average</Typography>
                            <Typography variant="h6">₹{summary.avg}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography color="text.secondary">Total Trades</Typography>
                            <Typography variant="h6">{summary.totalTrades}</Typography>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                        No data available for selected day.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default DashboardPage;
