// LoginPage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BgImg from "../assets/bg-img.jpg";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Login response:", result); // 👈 Debugging

      if (res.ok && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("customer", JSON.stringify(result.customer));
        localStorage.setItem("customerId", result.customer.id);
        navigate("/dashboard");
      } else {
        alert(result.error || result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
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
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: 350,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            {...register("email")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            {...register("password")}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Sign In
          </Button>
        </form>

        {/* Add this below the form */}
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#1976d2", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </span>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
