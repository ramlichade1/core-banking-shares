import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BgImg from "../assets/bg.jpg";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer"); // default is customer

  const onSubmit = async (data) => {
    try {
      const url =
        role === "employee"
          ? "http://localhost:5000/api/auth/employee/login"
          : "http://localhost:5000/api/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.token) {
        localStorage.setItem("token", result.token);

        if (role === "employee") {
          localStorage.setItem("bankId", result.employee.bank.id);
          localStorage.setItem("employeeId", result.employee.id);
          navigate("/admin-pannel"); // 👈 employee goes here
        } else {
          localStorage.setItem("customerId", result.customer.id);
          localStorage.setItem("customer", JSON.stringify(result.customer));
          navigate("/dashboard"); // 👈 customer goes here
        }
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
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 6,
          mr: 124,
          textAlign: "center",
          color: "#fff",
          fontWeight: 900,
          letterSpacing: "2px",
          textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
        }}
      >
        LOGIN
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: 360,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mr: 122,
          mb: 4,
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

        {/* Email */}
        <TextField
          label="Email"
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

      <Typography
        variant="body2"
        sx={{
          mb: 4,
          mr: 122,
          textAlign: "center",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        Don't have an account?{" "}
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
    </Box>
  );
};

export default LoginPage;
