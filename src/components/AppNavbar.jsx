// src/components/AppNavbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Badge,
  Tooltip,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { buttonHover, buttonTap } from '../animations';
import { useNotifications } from '../contexts/NotificationContext';

export default function AppNavbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);
  const [aiFeaturesAnchorEl, setAiFeaturesAnchorEl] = useState(null);

  const handleAiFeaturesMenu = (event) => {
    setAiFeaturesAnchorEl(event.currentTarget);
  };

  const handleAiFeaturesClose = () => {
    setAiFeaturesAnchorEl(null);
  };

  const { user, logout } = useAuth(); // Destructure properly
  const [isScrolled, setIsScrolled] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleDropdownMenu = (event) => {
    setDropdownAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  const menuItems = [
    { text: 'Listings', icon: <HomeIcon />, path: '/listings' },
    { text: 'Add Property', icon: <AddIcon />, path: '/deploy' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar
        position="fixed"
        elevation={isScrolled ? 8 : 0}
        sx={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: isScrolled ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
          color: '#1e293b',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isScrolled
            ? '0 8px 32px rgba(0, 0, 0, 0.12)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  letterSpacing: 0.5,
                  color: 'primary.main',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => navigate('/')}
              >
                🏠 RentChain
              </Typography>
            </motion.div>

            <AnimatePresence>
              {isMobile ? (
                <motion.div
                  key="mobile-menu"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                    sx={{
                      ml: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        borderRadius: 3,
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        mt: 1,
                      }
                    }}
                  >
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate(item.path);
                            handleClose();
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            py: 1.5,
                            px: 3,
                            borderRadius: 2,
                            mx: 1,
                            my: 0.5,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(37, 99, 235, 0.08)',
                              transform: 'translateX(4px)',
                            }
                          }}
                        >
                          <Box sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
                            {item.icon}
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight={isActive(item.path) ? 600 : 500}
                            sx={{ color: isActive(item.path) ? 'primary.main' : 'text.primary' }}
                          >
                            {item.text}
                          </Typography>
                        </MenuItem>
                      </motion.div>
                    ))}
                  </Menu>
                </motion.div>
              ) : (
                <motion.div
                  key="desktop-menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <Button
                      color="inherit"
                      onClick={handleDropdownMenu}
                      endIcon={dropdownAnchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        px: 3,
                        py: 1.5,
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: dropdownAnchorEl ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                        color: dropdownAnchorEl ? 'primary.main' : 'text.primary',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(37, 99, 235, 0.04)',
                          color: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      Menu
                    </Button>
                  </motion.div>
                  <Menu
                    id="dropdown-menu"
                    anchorEl={dropdownAnchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    open={Boolean(dropdownAnchorEl)}
                    onClose={handleDropdownClose}
                    PaperProps={{
                      sx: {
                        borderRadius: 3,
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        mt: 1,
                        minWidth: 200,
                      }
                    }}
                  >
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <MenuItem
                          component={Link}
                          to={item.path}
                          onClick={handleDropdownClose}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            py: 1.5,
                            px: 3,
                            borderRadius: 2,
                            mx: 1,
                            my: 0.5,
                            transition: 'all 0.2s ease',
                            backgroundColor: isActive(item.path) ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(37, 99, 235, 0.08)',
                              transform: 'translateX(4px)',
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              fontWeight: isActive(item.path) ? 600 : 500,
                              color: isActive(item.path) ? 'primary.main' : 'text.primary'
                            }}
                          />
                        </MenuItem>
                      </motion.div>
                    ))}
                  </Menu>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification Menu */}
          <Menu
            id="notification-menu"
            anchorEl={notificationAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                mt: 1,
                minWidth: 320,
                maxWidth: 400,
                maxHeight: 500,
                overflow: 'auto'
              }
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  Notifications
                </Typography>
                {notifications.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={markAllAsRead}
                      sx={{ fontSize: '0.75rem', minHeight: 28 }}
                    >
                      Mark all read
                    </Button>
                    <Button
                      size="small"
                      onClick={clearAllNotifications}
                      sx={{ fontSize: '0.75rem', minHeight: 28 }}
                    >
                      Clear all
                    </Button>
                  </Box>
                )}
              </Box>
              {notifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No notifications yet
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </Typography>
              )}
            </Box>

            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MenuItem
                  onClick={() => {
                    markAsRead(notification.id);
                    handleNotificationClose();
                  }}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: index < notifications.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                    backgroundColor: notification.read ? 'transparent' : 'rgba(37, 99, 235, 0.02)',
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    }
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            flexShrink: 0
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </MenuItem>
              </motion.div>
            ))}
          </Menu>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* AI Features Dropdown */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 1.5 }}>
              <motion.div
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Button
                  color="inherit"
                  onClick={handleAiFeaturesMenu}
                  endIcon={aiFeaturesAnchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    textTransform: 'none',
                    backgroundColor: aiFeaturesAnchorEl ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    color: aiFeaturesAnchorEl ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                      color: 'primary.main',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  AI Features
                </Button>
              </motion.div>
              <Menu
                anchorEl={aiFeaturesAnchorEl}
                open={Boolean(aiFeaturesAnchorEl)}
                onClose={handleAiFeaturesClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    backdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    mt: 1,
                    minWidth: 180,
                  }
                }}
              >
                {[
                  { text: 'Tenant Scoring', path: '/tenant-scoring' },
                  { text: 'Magic Match', path: '/magic-match' }
                ].map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => {
                        handleAiFeaturesClose();
                        if (item.action) {
                            item.action();
                        } else if (item.path !== '#') {
                            navigate(item.path);
                        }
                    }}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      borderRadius: 2,
                      mx: 0.5,
                      my: 0.25,
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        color: 'primary.main'
                      }
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={handleNotificationMenu}
                  sx={{
                    mr: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    }
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </motion.div>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.primary', 
                    fontWeight: 600,
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  {user.name}
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title="Logout">
                    <Avatar
                      alt={user.name}
                      src="/static/avatar.png" // We can keep using static or generate initials
                      onClick={logout}
                      sx={{
                        width: 40,
                        height: 40,
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: 'primary.light',
                        bgcolor: 'primary.main',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'error.main', // Red on hover to indicate logout
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                        }
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </Tooltip>
                </motion.div>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600 
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none'
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}
