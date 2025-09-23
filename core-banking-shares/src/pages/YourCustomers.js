// YourCustomersPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";

const YourCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setCustomers(data.customers || []);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Fetch customers error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // 📊 Calculate summary stats
  const summary = useMemo(() => {
    const totalCustomers = customers.length;
    const totalShares = customers.reduce(
      (sum, c) => sum + (c.numberOfShares || 0),
      0
    );
    const totalBalance = customers.reduce(
      (sum, c) => sum + (c.balance || 0),
      0
    );
    return { totalCustomers, totalShares, totalBalance };
  }, [customers]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "white",
          maxWidth: 1300,
          mx: "auto",
        }}
      >
        {/* Header with Icon */}
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          sx={{
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PeopleIcon fontSize="large" />
          Your Customers
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <GroupIcon color="primary" fontSize="large" />
              <Box>
                <Typography variant="h6">{summary.totalCustomers}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Customers
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TrendingUpIcon color="success" fontSize="large" />
              <Box>
                <Typography variant="h6">{summary.totalShares}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Shares Bought by customer
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <AccountBalanceWalletIcon color="warning" fontSize="large" />
              <Box>
                <Typography variant="h6">₹{summary.totalBalance.toFixed(2)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  All Customers Total Balance
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Loader / Empty / Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : customers.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "text.secondary",
              fontSize: "1.1rem",
            }}
          >
            <PeopleIcon sx={{ fontSize: 40, mb: 1, color: "text.disabled" }} />
            No customers found.
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "ID",
                    "Name",
                    "Email",
                    "Phone",
                    "No. of Shares",
                    "Balance",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 600,
                        background: "#f4f6f8",
                        color: "text.primary",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(customers) &&
                  customers.map((cust) => (
                    <TableRow
                      key={cust.id}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#fafafa",
                        },
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                        },
                      }}
                    >
                      <TableCell>{cust?.id ?? "-"}</TableCell>
                      <TableCell>{cust?.name ?? "N/A"}</TableCell>
                      <TableCell>{cust?.email ?? "N/A"}</TableCell>
                      <TableCell>{cust?.mobileNumber ?? "N/A"}</TableCell>
                      <TableCell>{cust?.numberOfShares ?? 0}</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color:
                            (cust?.balance ?? 0) >= 0
                              ? "success.main"
                              : "error.main",
                        }}
                      >
                        ₹{cust?.balance?.toFixed(2) ?? 0}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default YourCustomersPage;
