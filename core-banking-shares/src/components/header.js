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

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false); // ✅ track fullscreen
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleCloseMenu();
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
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

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
        <Box sx={{ flexGrow: 1, mt: -2 }}>   {/* thoda upar */}
          <Typography variant="h6" fontWeight="bold">
            Bhandara District Central Co-Operative Bank Ltd
          </Typography>
          <Typography variant="body2" color="white">
            J. M. Patel College Rd, Civil Line, MSEB Colony, Bhandara, Maharashtra 441904
          </Typography>
        </Box>

        {/* Right side buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* ✅ Home button only on profile page */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {location.pathname === "/profile" && (
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
          <Box onMouseEnter={handleOpenMenu} onMouseLeave={handleCloseMenu}>
            <Avatar
              alt="Customer Profile"
              src={RamImg}
              sx={{ cursor: "pointer", height: "80px", width: "70px", mt: -4, mb: 1 }}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              MenuListProps={{
                onMouseEnter: () => setAnchorEl(anchorEl),
                onMouseLeave: handleCloseMenu,
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  navigate("/profile");
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
