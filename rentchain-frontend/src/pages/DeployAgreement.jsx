import React, { useState } from "react";
import { addProperty, deployAgreement } from "../api/rentchain";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Box,
  Grid,
  Card,
  CardMedia,
  IconButton,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  LinearProgress,
  Chip
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  AddPhotoAlternate as PhotoIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Code as ContractIcon,
  Image as ImageIcon
} from "@mui/icons-material";
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
import { useNotifications } from '../contexts/NotificationContext';

export default function DeployAgreement() {
  const [form, setForm] = useState({
    renter: "",
    title: "",
    description: "",
    ipfsHash: "",
    rentEth: "",
    depositEth: "",
    duration: "",
    owner: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const controls = useAnimation();
  const { addNotification } = useNotifications();

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  async function uploadImageViaBackend(file) {
    const formData = new FormData();
    formData.append('image', file);
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/upload-image`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    return data.imageUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResult("");
    setError("");
    setLoading(true);
    setUploadProgress(0);

    try {
      let imageUrl = "";
      if (imageFile) {
        setUploadProgress(25);
        imageUrl = await uploadImageViaBackend(imageFile);
        setUploadProgress(50);
      }

      setUploadProgress(75);
      const deployRes = await deployAgreement({
        renter: form.renter,
        ipfsHash: form.ipfsHash,
        rentEth: form.rentEth,
        depositEth: form.depositEth,
        duration: form.duration
      });

      setUploadProgress(90);
      await addProperty({
        ...form,
        contractAddress: deployRes.address,
        imageUrl
      });

      setUploadProgress(100);

      // Add success notification
      addNotification({
        type: 'success',
        title: 'Property Listed Successfully',
        message: `"${form.title}" has been deployed and listed on the blockchain.`
      });

      setImageFile(null);
      setImagePreview(null);
      setForm({
        renter: "",
        title: "",
        description: "",
        ipfsHash: "",
        rentEth: "",
        depositEth: "",
        duration: "",
        owner: ""
      });
    } catch (e) {
      setError("Failed to deploy: " + e.message);

      // Add error notification
      addNotification({
        type: 'error',
        title: 'Deployment Failed',
        message: `Failed to deploy and list property "${form.title}": ${e.message}`
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }

  const formFields = [
    {
      name: "title",
      label: "Property Title",
      icon: <HomeIcon />,
      required: true,
      placeholder: "e.g., Modern 2BR Apartment Downtown"
    },
    {
      name: "description",
      label: "Description",
      multiline: true,
      rows: 4,
      required: true,
      placeholder: "Describe the property, amenities, location, etc."
    },
    {
      name: "renter",
      label: "Renter Address",
      icon: <PersonIcon />,
      required: true,
      placeholder: "0x..."
    },
    {
      name: "owner",
      label: "Owner Address",
      icon: <PersonIcon />,
      required: true,
      placeholder: "0x..."
    },
    {
      name: "rentEth",
      label: "Monthly Rent (ETH)",
      icon: <MoneyIcon />,
      type: "number",
      required: true,
      placeholder: "0.5"
    },
    {
      name: "depositEth",
      label: "Security Deposit (ETH)",
      icon: <MoneyIcon />,
      type: "number",
      required: true,
      placeholder: "1.0"
    },
    {
      name: "duration",
      label: "Lease Duration (days)",
      icon: <ScheduleIcon />,
      type: "number",
      required: true,
      placeholder: "365"
    },
    {
      name: "ipfsHash",
      label: "IPFS Hash (optional)",
      placeholder: "Qm..."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
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
                  List Your Property
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
                  Deploy smart contracts and showcase your rental property on the blockchain
                  with secure, transparent agreements
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
            <ContractIcon sx={{ fontSize: 60 }} />
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
            <ImageIcon sx={{ fontSize: 50 }} />
          </motion.div>
        </Paper>
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 6, mt: -4, position: 'relative', zIndex: 3 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {/* Image Upload Section */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    height: 'fit-content',
                    position: 'sticky',
                    top: 20,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ImageIcon sx={{ mr: 1, color: 'primary.main', fontSize: '2rem' }} />
                    </motion.div>
                    <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>
                      Property Image
                    </Typography>
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Box
                      sx={{
                        border: '3px dashed',
                        borderColor: imagePreview ? 'success.main' : 'grey.300',
                        borderRadius: 4,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: imagePreview
                          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
                        '&:hover': {
                          borderColor: 'primary.main',
                          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.15)'
                        },
                        position: 'relative',
                        minHeight: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      {imagePreview ? (
                        <Box sx={{ width: '100%', position: 'relative' }}>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardMedia
                              component="img"
                              image={imagePreview}
                              alt="Property preview"
                              sx={{
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 2,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }}
                            />
                          </motion.div>
                          <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Chip
                                label="Image Ready"
                                color="success"
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </motion.div>
                          </Box>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              backdropFilter: 'blur(10px)',
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,1)',
                                transform: 'scale(1.1)'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                          >
                            <PhotoIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                            y: [0, -5, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <PhotoIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" fontWeight={600} gutterBottom>
                            Upload Property Image
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click to browse or drag and drop
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            PNG, JPG up to 10MB
                          </Typography>
                        </motion.div>
                      )}
                    </Box>
                  </motion.div>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </Paper>
              </motion.div>
            </Grid>

            {/* Form Section */}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ContractIcon sx={{ mr: 1, color: 'primary.main', fontSize: '2rem' }} />
                    </motion.div>
                    <Typography variant="h4" fontWeight={700} sx={{ color: 'text.primary' }}>
                      Property Details
                    </Typography>
                  </Box>

                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                      {formFields.map((field, index) => (
                        <Grid item xs={12} md={field.multiline ? 12 : 6} key={field.name}>
                          <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                          >
                            <TextField
                              name={field.name}
                              value={form[field.name]}
                              onChange={handleChange}
                              label={field.label}
                              placeholder={field.placeholder}
                              type={field.type || "text"}
                              multiline={field.multiline}
                              rows={field.rows}
                              fullWidth
                              required={field.required}
                              variant="outlined"
                              InputProps={{
                                startAdornment: field.icon ? (
                                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                    {field.icon}
                                  </Box>
                                ) : null,
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 3,
                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255,255,255,0.3)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                                    border: '1px solid rgba(37, 99, 235, 0.3)',
                                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.1)'
                                  },
                                  '&.Mui-focused': {
                                    background: 'rgba(255,255,255,0.95)',
                                    border: '2px solid',
                                    borderColor: 'primary.main',
                                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.2)'
                                  }
                                },
                                '& .MuiInputLabel-root': {
                                  fontWeight: 600,
                                  color: 'text.secondary'
                                }
                              }}
                            />
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>

                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ mt: 4, mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Deploying smart contract and listing property...
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 4
                              }
                            }}
                          />
                        </Box>
                      </motion.div>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', gap: 3, flexDirection: isMobile ? 'column' : 'row' }}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ flex: isMobile ? 'none' : 1 }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth={isMobile}
                          disabled={loading}
                          startIcon={<UploadIcon />}
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
                            },
                            '&:disabled': {
                              background: 'grey.400',
                              color: 'grey.600'
                            }
                          }}
                        >
                          {loading ? "Deploying..." : "Deploy & List Property"}
                        </Button>
                      </motion.div>
                    </Box>
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
                            mt: 4,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            color: 'success.main',
                            '& .MuiAlert-icon': {
                              color: 'success.main'
                            }
                          }}
                          icon={<CheckIcon />}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            {result}
                          </Typography>
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
                            mt: 4,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: 'error.main',
                            '& .MuiAlert-icon': {
                              color: 'error.main'
                            }
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            {error}
                          </Typography>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
