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

const BankEmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/bankEmployees/emp-profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployee(res.data.employee);
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

  if (!employee) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={5}>
        Failed to load profile
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 5, backgroundColor: "#f5f5f5" }}>
      <Box maxWidth="800px" mx="auto">
        {/* Header */}
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
            alt={employee.name}
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
            <Typography variant="h4" fontWeight="bold">{employee.name}</Typography>
            <Typography variant="subtitle1">{employee.email}</Typography>
            <Typography variant="subtitle1">{employee.mobileNumber}</Typography>
          </Box>
        </Paper>

        {/* Employee Info Cards */}
        <Grid container spacing={3}>
          {[
            { label: "Employee ID", value: employee.id },
            { label: "Designation", value: employee.designation },
            { label: "Employee Code", value: employee.employeeCode },
            { label: "Bank", value: employee.bank?.name || "N/A" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
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
      </Box>
    </Box>
  );
};

export default BankEmployeeProfile;
