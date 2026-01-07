import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Box,
  Grid,
  Card,
  CardMedia,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon
} from "@mui/icons-material";
import { getProperty, getAgreement, activateAgreement, terminateAgreement } from "../api/rentchain";
import StatusChip from "../components/StatusChip";
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
import { Link } from "react-router-dom";
import { useNotifications } from '../contexts/NotificationContext';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [agreement, setAgreement] = useState({});
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [ethToInrRate, setEthToInrRate] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const controls = useAnimation();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const prop = await getProperty(id);
        setProperty(prop);
        controls.start("visible");
      } catch (error) {
        console.error("Failed to fetch property:", error);
      }
    };
    fetchProperty();
  }, [id, controls]);

  useEffect(() => {
    const fetchAgreement = async () => {
      if (property.contractAddress) {
        try {
          const agr = await getAgreement(property.contractAddress);
          setAgreement(agr);
        } catch (error) {
          console.error("Failed to fetch agreement:", error);
        }
      }
    };
    fetchAgreement();
  }, [property.contractAddress]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchEthRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const data = await response.json();
        setEthToInrRate(data.ethereum.inr);
      } catch (error) {
        console.error('Failed to fetch ETH rate:', error);
        setEthToInrRate(0);
      }
    };
    fetchEthRate();
  }, []);

  const formatETH = (ethValue) => {
    return `${parseFloat(ethValue).toFixed(4)} ETH`;
  };

  const formatINR = (ethValue) => {
    if (ethToInrRate === 0) return '₹--';
    const inrValue = parseFloat(ethValue) * ethToInrRate;
    return `₹${inrValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActivate = async () => {
    if (property.status !== "available") return;
    try {
      setResult(""); setError("");
      const res = await activateAgreement({
        contractAddress: property.contractAddress,
        rentEth: property.rentEth,
        depositEth: property.depositEth
      });
      if (!res.success) throw new Error(res.error || "Activation failed");

      // Add success notification
      addNotification({
        type: 'success',
        title: 'Agreement Activated',
        message: `Property "${property.title}" agreement has been successfully activated.`
      });

      setProperty(prev => ({ ...prev, status: "occupied" }));
      const updatedAgreement = await getAgreement(property.contractAddress);
      setAgreement(updatedAgreement);
    } catch (e) {
      setError("Activation failed: " + e.message);
      setResult("");

      // Add error notification
      addNotification({
        type: 'error',
        title: 'Activation Failed',
        message: `Failed to activate agreement for "${property.title}": ${e.message}`
      });
    }
  };

  const handleTerminate = async () => {
    if (property.status === "terminated") return;
    try {
      setResult(""); setError("");
      const res = await terminateAgreement({ contractAddress: property.contractAddress });
      if (!res.success) throw new Error(res.error || "Termination failed");

      // Add success notification
      addNotification({
        type: 'success',
        title: 'Agreement Terminated',
        message: `Property "${property.title}" agreement has been successfully terminated.`
      });

      setProperty(prev => ({ ...prev, status: "terminated" }));
      const updatedAgreement = await getAgreement(property.contractAddress);
      setAgreement(updatedAgreement);
    } catch (e) {
      setError("Termination failed: " + e.message);
      setResult("");

      // Add error notification
      addNotification({
        type: 'error',
        title: 'Termination Failed',
        message: `Failed to terminate agreement for "${property.title}": ${e.message}`
      });
    }
  };

  const propertyDetails = [
    {
      icon: <MoneyIcon color="primary" />,
      label: "Monthly Rent",
      value: `${formatETH(property.rentEth)} • ${formatINR(property.rentEth)}`
    },
    {
      icon: <SecurityIcon color="secondary" />,
      label: "Security Deposit",
      value: `${formatETH(property.depositEth)} • ${formatINR(property.depositEth)}`
    },
    {
      icon: <PersonIcon color="action" />,
      label: "Owner",
      value: property.owner ? `${property.owner.substring(0, 8)}...${property.owner.substring(property.owner.length - 4)}` : "N/A"
    },
    {
      icon: <ScheduleIcon color="action" />,
      label: "Duration",
      value: property.duration ? `${property.duration} days` : "N/A"
    }
  ];

  const agreementDetails = agreement ? [
    {
      icon: <CheckIcon color="success" />,
      label: "Status",
      value: agreement.isActive ? "Active" : "Inactive"
    },
    {
      icon: <MoneyIcon color="primary" />,
      label: "Rent Paid",
      value: `${agreement.rentPaid || 0} ETH`
    },
    {
      icon: <SecurityIcon color="secondary" />,
      label: "Deposit Held",
      value: `${agreement.depositHeld || 0} ETH`
    }
  ] : [];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}
      >
        <Fab
          component={Link}
          to="/"
          size="small"
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)'
            }
          }}
        >
          <ArrowBackIcon />
        </Fab>
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {/* Image Section */}
            <Grid item xs={12} md={8}>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    mb: 3,
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                >
                  {property.imageUrl ? (
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <CardMedia
                          component="img"
                          height={isMobile ? 300 : 500}
                          image={property.imageUrl}
                          alt={property.title}
                          sx={{
                            objectFit: 'cover',
                            transition: 'transform 0.6s ease'
                          }}
                        />
                      </motion.div>
                      <Box sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        zIndex: 2,
                        display: 'flex',
                        gap: 1
                      }}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Fab size="small" sx={{
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': { background: 'rgba(255,255,255,1)' }
                          }}>
                            <FavoriteIcon sx={{ color: 'grey.700' }} />
                          </Fab>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Fab size="small" sx={{
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': { background: 'rgba(255,255,255,1)' }
                          }}>
                            <ShareIcon sx={{ color: 'grey.700' }} />
                          </Fab>
                        </motion.div>
                      </Box>
                      <Box sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        zIndex: 2
                      }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        >
                          <StatusChip status={property.status} />
                        </motion.div>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: isMobile ? 300 : 500,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <HomeIcon sx={{ fontSize: 100, color: 'grey.400' }} />
                      </motion.div>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>

            {/* Quick Info Sidebar */}
            <Grid item xs={12} md={4}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    position: 'sticky',
                    top: 20,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1, color: 'text.primary' }}>
                      {property.title}
                    </Typography>
                  </Box>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                        mb: 1
                      }}
                    >
                      {formatETH(property.rentEth)} • {formatINR(property.rentEth)}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                      per month
                    </Typography>
                  </motion.div>

                  <Divider sx={{ my: 3, opacity: 0.3 }} />

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Security Deposit: <strong>{formatETH(property.depositEth)} • {formatINR(property.depositEth)}</strong>
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={property.status !== "available"}
                        onClick={handleActivate}
                        fullWidth
                        size="large"
                        sx={{
                          borderRadius: 3,
                          fontWeight: 600,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            boxShadow: '0 6px 20px rgba(34, 197, 94, 0.6)',
                          },
                          '&:disabled': {
                            background: 'grey.400',
                            color: 'grey.600'
                          }
                        }}
                      >
                        Activate Agreement
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        disabled={property.status === "terminated"}
                        onClick={handleTerminate}
                        fullWidth
                        size="large"
                        sx={{
                          borderRadius: 3,
                          fontWeight: 600,
                          py: 1.5,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            backgroundColor: 'rgba(239, 68, 68, 0.04)',
                          }
                        }}
                      >
                        Terminate Agreement
                      </Button>
                    </motion.div>
                  </Box>

                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert
                          severity="success"
                          sx={{
                            mt: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                            border: '1px solid rgba(34, 197, 94, 0.2)'
                          }}
                        >
                          {result}
                        </Alert>
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert
                          severity="error"
                          sx={{
                            mt: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}
                        >
                          {error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Paper>
              </motion.div>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      gutterBottom
                      sx={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 3
                      }}
                    >
                      Property Details
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        color: 'text.secondary'
                      }}
                    >
                      {property.description}
                    </Typography>
                  </motion.div>

                  <Divider sx={{ my: 4, opacity: 0.3 }} />

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      sx={{ color: 'text.primary', mb: 3 }}
                    >
                      Property Information
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {propertyDetails.map((detail, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
                              border: '1px solid rgba(255,255,255,0.3)',
                              transition: 'all 0.3s ease'
                            }}>
                              <Box sx={{
                                mr: 2,
                                p: 1,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
                              }}>
                                {detail.icon}
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                  {detail.label}
                                </Typography>
                                <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                                  {detail.value}
                                </Typography>
                              </Box>
                            </Box>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>

                  {agreement && Object.keys(agreement).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      <Divider sx={{ my: 4, opacity: 0.3 }} />
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        gutterBottom
                        sx={{ color: 'text.primary', mb: 3 }}
                      >
                        Agreement Status
                      </Typography>

                      <Grid container spacing={3}>
                        {agreementDetails.map((detail, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <motion.div
                              variants={itemVariants}
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.3s ease'
                              }}>
                                <Box sx={{
                                  mr: 2,
                                  p: 1,
                                  borderRadius: 2,
                                  background: detail.label === 'Status' && detail.value === 'Active'
                                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
                                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
                                }}>
                                  {detail.icon}
                                </Box>
                                <Box>
                                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                    {detail.label}
                                  </Typography>
                                  <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                                    {detail.value}
                                  </Typography>
                                </Box>
                              </Box>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </motion.div>
                  )}

                  {property.ipfsHash && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      <Divider sx={{ my: 4, opacity: 0.3 }} />
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        gutterBottom
                        sx={{ color: 'text.primary', mb: 2 }}
                      >
                        Additional Information
                      </Typography>
                      <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          IPFS Hash
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            backgroundColor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            mt: 1,
                            wordBreak: 'break-all'
                          }}
                        >
                          {property.ipfsHash}
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
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
