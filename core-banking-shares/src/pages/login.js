import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BgImg from "../assets/bg.jpg";

const LoginPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");

  const onSubmit = async (data) => {
    try {
      let url = "";
      let payload = {};

      // Different API + payload based on role
      if (role === "employee") {
        url = "http://localhost:5000/api/auth/employee/login";
        payload = {
          email: data.email.trim(), // Employee email or ID (depending on backend)
          password: data.password,
        };
      } else {
        url = "http://localhost:5000/api/auth/login";
        payload = {
          email: data.email.trim(),
          password: data.password,
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.token) {
        localStorage.setItem("token", result.token);

        if (role === "employee" && result.employee) {
          localStorage.setItem("bankId", result.employee.bank?.id || "");
          localStorage.setItem("employeeId", result.employee.id);
          navigate("/admin-pannel");
        } else if (role === "customer" && result.customer) {
          localStorage.setItem("customerId", result.customer.id);
          localStorage.setItem("customer", JSON.stringify(result.customer));
          navigate("/");
        } else {
          alert("Unexpected login response. Please try again.");
        }
      } else {
        alert(result.error || result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong while logging in");
    } finally {
      reset();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${BgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          textAlign: "center",
          color: "#fff",
          fontWeight: 900,
          letterSpacing: "2px",
          textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        LOGIN
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: { xs: "90%", sm: 380, md: 400 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "rgba(0,0,0,0.45)",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Role Selector */}
        <FormControl fullWidth>
          <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Login As</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 1,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.5)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#42a5f5",
              },
            }}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="employee">Bank Employee</MenuItem>
          </Select>
        </FormControl>

        {/* Email or Employee ID */}
        <TextField
          label={role === "employee" ? "Employee Email" : "Customer Email"}
          type="email"
          fullWidth
          required
          {...register("email")}
          sx={{
            input: { color: "#fff" },
            label: { color: "rgba(255,255,255,0.7)" },
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
              "&:hover fieldset": { borderColor: "#42a5f5" },
              "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
            },
          }}
        />

        {/* Password */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          {...register("password")}
          sx={{
            input: { color: "#fff" },
            label: { color: "rgba(255,255,255,0.7)" },
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
              "&:hover fieldset": { borderColor: "#42a5f5" },
              "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
            },
          }}
        />

        {/* Sign In Button */}
        <Button
          type="submit"
          fullWidth
          sx={{
            py: 1.8,
            background: "linear-gradient(135deg, #ff6f61, #ff3d00)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #ff3d00, #ff6f61)",
              boxShadow: "0 6px 25px rgba(0,0,0,0.5)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Sign In
        </Button>
      </Box>

      {/* Sign-up link */}
      {role === "customer" && (
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            textAlign: "center",
            color: "rgba(255,255,255,0.9)",
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          Don’t have an account?{" "}
          <span
            style={{
              color: "#fbff00ff",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </span>
        </Typography>
      )}
    </Box>
  );
};

export default LoginPage;
