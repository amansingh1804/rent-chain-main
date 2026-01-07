import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  LinearProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Home as HomeIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
  AccountBalanceWallet as WalletIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  MonetizationOn as MonetizationIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon
} from "@mui/icons-material";
import { getPropertiesByOwner } from "../api/rentchain";
import StatusChip from "../components/StatusChip";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHover,
  cardTap,
  containerVariants,
  itemVariants
} from '../animations';

const landlordAddress = "0x85f6FfCD9072d5Cf33EFE4b067100F267F32b20D"; // Use real address

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [ethToInrRate, setEthToInrRate] = useState(450000); // Default ETH to INR rate (can be updated with API)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const controls = useAnimation();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const props = await getPropertiesByOwner(landlordAddress);
        setProperties(props);
        controls.start("visible");
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEthRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const data = await response.json();
        if (data.ethereum && data.ethereum.inr) {
          setEthToInrRate(data.ethereum.inr);
        }
      } catch (error) {
        console.log('Using default ETH to INR rate');
        // Keep the default rate if API fails
      }
    };

    fetchProperties();
    fetchEthRate();

    // Update ETH rate every 5 minutes
    const interval = setInterval(fetchEthRate, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [controls]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatINR = (ethValue) => {
    const inrValue = parseFloat(ethValue) * ethToInrRate;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(inrValue);
  };

  const formatETH = (ethValue) => {
    return `${parseFloat(ethValue).toFixed(3)} ETH`;
  };

  const stats = {
    total: properties.length,
    available: properties.filter(p => p.status === 'available').length,
    occupied: properties.filter(p => p.status === 'occupied').length,
    terminated: properties.filter(p => p.status === 'terminated').length,
  };

  const totalRevenue = properties
    .filter(p => p.status === 'occupied')
    .reduce((sum, p) => sum + parseFloat(p.rentEth || 0), 0);

  const monthlyRevenue = properties
    .filter(p => p.status === 'occupied')
    .reduce((sum, p) => sum + parseFloat(p.rentEth || 0), 0);

  const occupancyRate = stats.total > 0 ? ((stats.occupied / stats.total) * 100).toFixed(1) : 0;

  const StatCard = ({ title, value, ethValue, icon, color, subtitle, progress, trend }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{
        scale: 1.03,
        y: -8,
        boxShadow: `0 20px 40px rgba(0,0,0,0.15)`
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 5,
          background: `linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)`,
          backdropFilter: 'blur(24px)',
          border: `1px solid rgba(255,255,255,0.4)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.08)`,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 180,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, ${color} 0%, ${color}90 50%, ${color}70 100%)`,
            borderRadius: '5px 5px 0 0',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 100,
            height: 100,
            background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)`,
            borderRadius: '5px',
            pointerEvents: 'none',
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 40px rgba(0,0,0,0.12)`,
            border: `1px solid ${color}30`,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  mb: 2,
                  fontSize: '2.5rem'
                }}
              >
                {value}
              </Typography>
            </motion.div>
            <Typography
              variant="body1"
              fontWeight={700}
              color="text.primary"
              sx={{
                mb: 1,
                fontSize: '1.1rem',
                letterSpacing: '0.5px'
              }}
            >
              {title}
            </Typography>
            {ethValue && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    background: 'rgba(0,0,0,0.04)',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: 'inline-block'
                  }}
                >
                  {formatINR(ethValue)} monthly revenue
                </Typography>
              </motion.div>
            )}
            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1.4,
                  fontSize: '0.85rem',
                  opacity: 0.8
                }}
              >
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 2,
                p: 1,
                borderRadius: 2,
                backgroundColor: trend > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: trend > 0 ? 'success.main' : 'error.main',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${color}20 0%, ${color}15 100%)`,
              borderRadius: 4,
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${color}40`,
              ml: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 4,
                padding: 1,
                background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'subtract',
              }
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {icon}
            </motion.div>
          </Box>
        </Box>
        {progress !== undefined && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
                  borderRadius: 4,
                  boxShadow: `0 2px 8px ${color}60`,
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </motion.div>
  );

  const PropertyCard = ({ property, index }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        y: -6,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      layout
      style={{ height: '100%' }}
    >
      <Card sx={{
        height: '100%',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        borderRadius: 5,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.03) 100%)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          '&::before': {
            opacity: 1,
          }
        }
      }}>
        <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                flexGrow: 1,
                mr: 2,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '1.2rem',
                letterSpacing: '0.25px'
              }}
            >
              {property.title}
            </Typography>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <StatusChip status={property.status} />
            </motion.div>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 2,
              fontSize: '0.95rem'
            }}
          >
            {property.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.15)'
            }}>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Monthly Rent
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  {formatINR(property.rentEth)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Security Deposit
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.primary"
                  sx={{ fontSize: '0.9rem' }}
                >
                  {formatINR(property.depositEth)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                component={Link}
                to={`/property/${property._id}`}
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 2,
                  borderWidth: 2,
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid transparent',
                  backgroundClip: 'padding-box',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    padding: '2px',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 100%)',
                    borderRadius: '3px',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'subtract',
                  },
                  '&:hover': {
                    borderWidth: 2,
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.2)',
                    '&::before': {
                      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.5) 0%, rgba(37, 99, 235, 0.2) 100%)',
                    }
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                View Details
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 2 }}>
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Paper
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            py: { xs: 6, md: 8 },
            px: 2,
            position: 'relative',
            overflow: 'hidden',
            mx: { xs: 2, md: 4 },
            borderRadius: 4,
            mb: 4,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.1,
            }
          }}
        >
          <Container maxWidth="lg">
            <Box textAlign="center" sx={{ position: 'relative', zIndex: 2 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight={800}
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    mb: 2
                  }}
                >
                  Property Dashboard
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                    maxWidth: 700,
                    mx: 'auto',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Manage your rental properties and track performance with advanced analytics
                </Typography>
              </motion.div>
            </Box>
          </Container>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '15%',
              right: '8%',
              opacity: 0.1,
            }}
          >
            <AnalyticsIcon sx={{ fontSize: 60 }} />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '8%',
              opacity: 0.1,
            }}
          >
            <MonetizationIcon sx={{ fontSize: 50 }} />
          </motion.div>
        </Paper>
      </motion.div>

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Portfolio Overview Section */}
          <Box sx={{ mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  mb: 4,
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}
              >
                Portfolio Overview
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Properties"
                  value={stats.total}
                  subtitle="In portfolio"
                  icon={<HomeIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />}
                  color={theme.palette.primary.main}
                  progress={stats.total > 0 ? 100 : 0}
                  trend={12}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Available"
                  value={stats.available}
                  subtitle="Ready to rent"
                  icon={<TrendingIcon sx={{ fontSize: 32, color: theme.palette.success.main }} />}
                  color={theme.palette.success.main}
                  progress={stats.total > 0 ? (stats.available / stats.total) * 100 : 0}
                  trend={8}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Occupied"
                  value={stats.occupied}
                  ethValue={monthlyRevenue}
                  subtitle="Properties generating revenue"
                  icon={<WalletIcon sx={{ fontSize: 32, color: theme.palette.info.main }} />}
                  color={theme.palette.info.main}
                  progress={stats.total > 0 ? (stats.occupied / stats.total) * 100 : 0}
                  trend={15}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Occupancy Rate"
                  value={`${occupancyRate}%`}
                  subtitle="Current utilization"
                  icon={<BarChartIcon sx={{ fontSize: 32, color: theme.palette.warning.main }} />}
                  color={theme.palette.warning.main}
                  progress={parseFloat(occupancyRate)}
                  trend={5}
                />
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Box sx={{ mt: 6, display: 'flex', gap: 4, flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ flex: isMobile ? 'none' : 1, maxWidth: isMobile ? '100%' : '300px' }}
              >
                <Button
                  component={Link}
                  to="/deploy"
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    py: 2,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    }
                  }}
                >
                  List New Property
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ flex: isMobile ? 'none' : 1, maxWidth: isMobile ? '100%' : '300px' }}
              >
                <Button
                  component={Link}
                  to="/listings"
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    py: 2,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    }
                  }}
                >
                  View All Listings
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="large"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↑
          </motion.div>
        </Fab>
      </Zoom>
    </Box>
  );
}
