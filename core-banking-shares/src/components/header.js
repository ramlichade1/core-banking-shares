import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DccLogo from "../assets/bhandara-dcc-logo.png";
import RamImg from "../assets/RAM-IMG.png";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";

const Header = () => {
  const [anchorElMenu, setAnchorElMenu] = useState(null);     // Hamburger menu
  const [anchorElAvatar, setAnchorElAvatar] = useState(null); // Avatar menu
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hamburger menu handlers
  const handleOpenMenu = (event) => setAnchorElMenu(event.currentTarget);
  const handleCloseMenu = () => setAnchorElMenu(null);

  // Avatar menu handlers
  const handleOpenAvatar = (event) => setAnchorElAvatar(event.currentTarget);
  const handleCloseAvatar = () => setAnchorElAvatar(null);

  const goToCustomers = () => {
    navigate("/your-customers");
    handleCloseMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customer");
    localStorage.removeItem("bankId");
    handleCloseAvatar();
    navigate("/login");
  };

  // ✅ Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2", mb: -2 }}>
      <Toolbar>
        {/* Left - Hamburger */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleOpenMenu}
        >
          <MenuIcon />
        </IconButton>

        {/* Hamburger Menu */}
        <Menu
          anchorEl={anchorElMenu}
          open={Boolean(anchorElMenu)}
          onClose={handleCloseMenu}
        >
          {localStorage.getItem("employeeId") && (   // ✅ Only show if employee is logged in
            <MenuItem onClick={goToCustomers}>
              <PeopleIcon sx={{ mr: 1 }} /> Your Customers
            </MenuItem>
          )}
        </Menu>

        {/* Bank Logo */}
        <Box sx={{ display: "flex", alignItems: "center", mr: -1 }}>
          <img
            src={DccLogo}
            alt="Bhandara DCC Bank Logo"
            style={{
              width: "70px",
              height: "70px",
              marginRight: "20px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "15px",
            }}
          />
        </Box>

        {/* Title */}
        <Box sx={{ flexGrow: 1, mt: -2 }}>
          <Typography variant="h6" fontWeight="bold">
            Bhandara District Central Co-Operative Bank Ltd
          </Typography>
          <Typography variant="body2" color="white">
            J. M. Patel College Rd, Civil Line, MSEB Colony, Bhandara, Maharashtra 441904
          </Typography>
        </Box>

        {/* Right side buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* ✅ Home button only on profile pages */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {(location.pathname === "/profile" ||
              location.pathname === "/bankEmp-profile" || location.pathname === "/your-customers" ) && (
                <IconButton
                  color="inherit"
                  aria-label="go-back"
                  onClick={() => navigate(-1)}
                  sx={{ width: 60, height: 60, mb: 2 }}
                >
                  <HomeIcon sx={{ fontSize: 36 }} />
                </IconButton>
              )}

            {/* ✅ Fullscreen button */}
            <IconButton
              color="inherit"
              aria-label="fullscreen"
              onClick={toggleFullscreen}
              sx={{ width: 60, height: 60, mb: 2 }}
            >
              {isFullscreen ? (
                <FullscreenExitIcon sx={{ fontSize: 34 }} />
              ) : (
                <FullscreenIcon sx={{ fontSize: 34 }} />
              )}
            </IconButton>
          </Box>

          {/* Profile Avatar */}
          <Box>
            <Avatar
              alt="Customer Profile"
              src={RamImg}
              onClick={handleOpenAvatar}
              sx={{ cursor: "pointer", height: "80px", width: "70px", mt: -4, mb: 1 }}
            />
            <Menu
              anchorEl={anchorElAvatar}
              open={Boolean(anchorElAvatar)}
              onClose={handleCloseAvatar}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseAvatar();
                  const customerId = localStorage.getItem("customerId");
                  const employeeId = localStorage.getItem("employeeId");

                  if (customerId) {
                    navigate("/profile");
                  } else if (employeeId) {
                    navigate("/bankEmp-profile");
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <PersonIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
