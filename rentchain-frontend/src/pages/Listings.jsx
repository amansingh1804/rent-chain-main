import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  useTheme,
  Skeleton,
  Fab,
  Zoom
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  FilterList as FilterIcon
} from "@mui/icons-material";
import { getProperties } from "../api/rentchain";
import { Link } from "react-router-dom";
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

export default function Listings() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [ethToInrRate, setEthToInrRate] = useState(0);
  const theme = useTheme();
  const controls = useAnimation();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const props = await getProperties();
        setProperties(props);
        setFilteredProperties(props);
        controls.start("visible");
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [controls]);

  useEffect(() => {
    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [searchTerm, properties]);

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

  const PropertyCard = ({ property, index }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      whileHover={cardHover}
      whileTap={cardTap}
      layout
      style={{ height: '100%' }}
    >
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.05) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        }
      }}>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <CardMedia
              component="img"
              height="220"
              image={property.imageUrl || "/static/sample-property.jpg"}
              alt={property.title}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
          </motion.div>
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2
          }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <StatusChip status={property.status} />
            </motion.div>
          </Box>
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            p: 2,
            color: 'white'
          }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              {formatETH(property.rentEth)} • {formatINR(property.rentEth)}/month
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 1
            }}
          >
            {property.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flexGrow: 1
            }}
          >
            {property.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Blockchain Verified
            </Typography>
          </Box>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              component={Link}
              to={`/property/${property._id}`}
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                }
              }}
            >
              View Details
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '16px 16px 0 0' }} />
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" height={28} width="80%" sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={20} width="100%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Enhanced Hero Section */}
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
            py: { xs: 8, md: 12 },
            px: 2,
            position: 'relative',
            overflow: 'hidden',
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Box textAlign="center" sx={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Typography
                    variant="h1"
                    component="h1"
                    fontWeight={800}
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      mb: 2
                    }}
                  >
                    Find Your Perfect
                    <br />
                    <Box component="span" sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Rental Property
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{
                      mb: 2,
                      opacity: 0.9,
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                      maxWidth: 700,
                      mx: 'auto',
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                  >
                    Discover blockchain-powered rental properties with secure smart contracts
                    and transparent agreements
                  </Typography>
                </motion.div>

                {/* Enhanced Search Bar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Box sx={{ maxWidth: 600, mx: 'auto', position: 'relative' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Search properties by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: 4,
                          backdropFilter: 'blur(20px)',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                          transition: 'all 0.3s ease',
                          '& fieldset': {
                            borderColor: 'transparent',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                            transform: 'translateY(-2px)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1e293b',
                          fontSize: '1.1rem',
                          py: 2,
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#64748b', fontSize: '1.5rem' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
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
              top: '20%',
              right: '10%',
              opacity: 0.1,
            }}
          >
            <HomeIcon sx={{ fontSize: 80 }} />
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
              bottom: '20%',
              left: '10%',
              opacity: 0.1,
            }}
          >
            <MoneyIcon sx={{ fontSize: 60 }} />
          </motion.div>
        </Paper>
      </motion.div>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 8, mt: 4, position: 'relative', zIndex: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <HomeIcon sx={{ mr: 1, color: 'primary.main', fontSize: '2rem' }} />
              </motion.div>
              <Typography variant="h4" fontWeight={700} sx={{ color: 'text.primary' }}>
                Available Properties
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${filteredProperties.length} Properties`}
                variant="filled"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    }
                  }}
                >
                  Filter
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 8,
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: 4,
                  border: '2px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <HomeIcon sx={{ fontSize: 80, color: 'grey.400', mb: 3 }} />
                </motion.div>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No properties found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new listings'}
                </Typography>
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key="properties-grid"
            >
              <Grid container spacing={4}>
                {filteredProperties.map((property, index) => (
                  <Grid item xs={12} md={6} lg={4} key={property._id}>
                    <PropertyCard property={property} index={index} />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
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
