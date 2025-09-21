import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Grid,
  Divider,
} from "@mui/material";

const Profile = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(res.data.customer);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={5}>
        Failed to load profile
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 5, backgroundColor: "#f5f5f5" }}>
      <Box maxWidth="1000px" mx="auto">
        {/* Header with Gradient */}
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: 4,
            borderRadius: 3,
            mb: 4,
            background: "linear-gradient(135deg, #2ea12eff, #1976d2)",
            color: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
          elevation={5}
        >
          <Avatar
            alt={customer.name}
            src="/default-avatar.png"
            sx={{
              width: 120,
              height: 120,
              border: "3px solid #fff",
              mr: 4,
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">{customer.name}</Typography>
            <Typography variant="subtitle1">{customer.email}</Typography>
            <Typography variant="subtitle1">{customer.mobileNumber}</Typography>
          </Box>
        </Paper>

        {/* Account Info Cards */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: "Customer ID", value: customer.id },
            { label: "Number of Shares", value: customer.numberOfShares },
            { label: "Balance", value: `₹${customer.balance}` },
            { label: "Total Invested", value: `₹${customer.totalInvested}` },
            { label: "Aadhar Number", value: customer.aadharNumber || "N/A" },
            { label: "PAN Number", value: customer.panNumber || "N/A" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                elevation={3}
              >
                <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Transactions Section */}
        <Typography variant="h5" fontWeight="bold" mb={2}>Transactions</Typography>
        {customer.transactions && customer.transactions.length > 0 ? (
          <Grid container spacing={2}>
            {customer.transactions
              .slice() // original array mutate na ho
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
              .map((txn) => (
                <Grid item xs={12} key={txn.id}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "#fff",
                      borderLeft: "5px solid #1976d2",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                    elevation={2}
                  >
                    <Typography variant="body2"><strong>Transaction ID:</strong> {txn.id}</Typography>
                    <Typography variant="body2"><strong>Type:</strong> {txn.type}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {new Date(txn.createdAt).toLocaleString()}</Typography>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">No transactions found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
