// SignupPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BgImg from "../assets/bg-img.jpg";

const SignupPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

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

        // show popup
        setOpen(true);

        // navigate after 2 sec
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        alert(result.error || result.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const inputStyles = {
    input: { color: "#fff" },
    label: { color: "rgba(255,255,255,0.7)" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: "8px",
      "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
      "&:hover fieldset": { borderColor: "#42a5f5" },
      "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
    },
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
          width: 400,
          maxWidth: "90%",
          borderRadius: "16px",
          backgroundColor: "rgba(0,0,0,0.6)",
          textAlign: "center",
          mr: 122,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            color: "#fff",
            fontWeight: 900,
            letterSpacing: "2px",
            textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
          }}
        >
          SIGN UP
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField label="Name" fullWidth required {...register("name")} sx={inputStyles} />
          <TextField label="Email" type="email" fullWidth required {...register("email")} sx={inputStyles} />
          <TextField label="Password" type="password" fullWidth required {...register("password")} sx={inputStyles} />
          <TextField label="Mobile Number" type="tel" fullWidth required {...register("mobileNumber")} sx={inputStyles} />
          <TextField label="Aadhar Card Number" fullWidth required {...register("aadharNumber")} sx={inputStyles} />
          <TextField label="PAN Number" fullWidth required {...register("panNumber")} sx={inputStyles} />

          <Button
            type="submit"
            fullWidth
            sx={{
              py: 1.5,
              background: "linear-gradient(135deg, #ff6f61, #ff3d00)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "8px",
              mt: 1,
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #ff3d00, #ff6f61)",
                boxShadow: "0 6px 25px rgba(0,0,0,0.5)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Sign Up
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 3,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "#42a5f5",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </Typography>
      </Paper>

      {/* Success Popup */}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Registration Successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignupPage;
