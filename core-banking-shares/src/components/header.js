import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import DccLogo from "../assets/bhandara-dcc-logo.png"

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Left - Hamburger */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Bank Logo */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <img
            src={DccLogo}
            alt="Bhandara DCC Bank Logo"
            style={{ height: "80px", marginRight: "20px" }}
          />
        </Box>

        {/* Right - Profile */}
        <Avatar
          alt="Customer Profile"
          src="https://via.placeholder.com/150"
          sx={{ cursor: "pointer" }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
