// SignupPage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BgImg from "../assets/bg-img.jpg";

const SignupPage = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (res.ok) {
                localStorage.setItem("token", result.token);
                navigate("/login"); // redirect after signup
            } else {
                alert(result.error || result.message || "Signup failed");
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
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Name"
                        fullWidth
                        required
                        {...register("name")}
                        sx={{ mb: 2 }}
                    />
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
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Mobile Number"
                        type="tel"
                        fullWidth
                        required
                        {...register("mobileNumber")}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Aadhar Card Number"
                        fullWidth
                        required
                        {...register("aadharNumber")}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="PAN Number"
                        fullWidth
                        required
                        {...register("panNumber")}
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ py: 1.5 }}
                    >
                        Sign Up
                    </Button>

                </form>
            </Paper>
        </Box>
    );
};

export default SignupPage;
