import React, { useState } from 'react';
import { 
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText, 
  Typography, Fade, useTheme, useMediaQuery 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoIcon from '@mui/icons-material/Info';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const DropdownMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Map', icon: <MapIcon />, path: '/map' },
    { text: 'Data Summary', icon: <BarChartIcon />, path: '/data' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
  ];

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleClick}
        sx={{
          mr: 2,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            mt: 1.5,
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={handleClose}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              py: 1.5,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant={isMobile ? "body2" : "body1"}>
                  {item.text}
                </Typography>
              } 
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenu;