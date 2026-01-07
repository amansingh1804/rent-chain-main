import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Slider,
  Grid,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Stack,
  LinearProgress,
  IconButton,
  Fade
} from '@mui/material';
import {
  AutoAwesome,
  Home,
  AttachMoney,
  LocationOn,
  Pool,
  ArrowForward,
  ArrowBack,
  RestartAlt,
  CheckCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getProperties } from '../api/rentchain';
import { useNavigate } from 'react-router-dom';

const QUESTIONS = [
  {
    id: 'budget',
    title: 'What represents your ideal monthly budget?',
    subtitle: 'We will find properties within or slightly above this range.',
    type: 'slider',
    min: 0.01,
    max: 1.0,
    step: 0.01,
    unit: 'ETH'
  },
  {
    id: 'location',
    title: 'Where would you like to live?',
    subtitle: 'Select your preferred area.',
    type: 'chips',
    options: ['Bangalore', 'Mumbai', 'Delhi', 'Whitefield', 'Koramangala', 'Indiranagar']
  },
  {
    id: 'bhk',
    title: 'How many bedrooms do you need?',
    subtitle: 'Select all that apply.',
    type: 'chips',
    options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa']
  },
  {
    id: 'amenities',
    title: 'What amenities are non-negotiable?',
    subtitle: 'We will prioritize properties with these features.',
    type: 'multi-chips',
    options: ['WiFi', 'Gym', 'Pool', 'Parking', 'Security', 'Furnished', 'Pet Friendly']
  }
];

const MagicMatch = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    budget: 0.1,
    location: '',
    bhk: '',
    amenities: []
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allProperties, setAllProperties] = useState([]);

  useEffect(() => {
    // Pre-fetch properties
    getProperties().then(data => setAllProperties(data)).catch(console.error);
  }, []);

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      calculateMatches();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRestart = () => {
    setStep(0);
    setPreferences({
      budget: 0.1,
      location: '',
      bhk: '',
      amenities: []
    });
    setShowResults(false);
    setResults([]);
  };

  const calculateMatches = () => {
    setLoading(true);
    
    setTimeout(() => {
      const scored = allProperties.map(property => {
        let score = 0;
        let reasons = [];
        const content = (property.title + ' ' + property.description).toLowerCase();

        // 1. Budget Score (40 points)
        const propRent = parseFloat(property.rentEth);
        if (propRent <= preferences.budget) {
          score += 40;
          reasons.push("Within your budget");
        } else if (propRent <= preferences.budget * 1.2) {
          score += 20; // Slightly over budget
        }

        // 2. Location Score (30 points)
        if (preferences.location && content.includes(preferences.location.toLowerCase())) {
          score += 30;
          reasons.push(`Located in ${preferences.location}`);
        }

        // 3. BHK Score (20 points)
        if (preferences.bhk) {
          // Create regex from selection, e.g., "2 BHK" -> /2\s*bhk/
          const bhkRegex = new RegExp(preferences.bhk.replace(' ', '\\s*'), 'i');
          if (bhkRegex.test(content)) {
            score += 20;
            reasons.push(`Matches ${preferences.bhk}`);
          }
        }

        // 4. Amenities Score (10 points + bonus)
        const amenitiesFound = preferences.amenities.filter(a => content.includes(a.toLowerCase()));
        if (amenitiesFound.length > 0) {
          score += 10;
          score += (amenitiesFound.length * 2); // Bonus points
          reasons.push(`Has ${amenitiesFound.join(', ')}`);
        }

        return { ...property, matchScore: Math.min(score, 100), matchReasons: reasons };
      });

      // Filter matches > 0 and sort
      const finalResults = scored
        .filter(p => p.matchScore > 20) // Minimum threshold
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5); // Top 5

      setResults(finalResults);
      setLoading(false);
      setShowResults(true);
    }, 1500); // Simulate AI "thinking"
  };

  const updatePreference = (value) => {
    const question = QUESTIONS[step];
    if (question.type === 'multi-chips') {
      const current = preferences[question.id];
      const newValues = current.includes(value)
        ? current.filter(i => i !== value)
        : [...current, value];
      setPreferences({ ...preferences, [question.id]: newValues });
    } else {
      setPreferences({ ...preferences, [question.id]: value });
    }
  };

  if (loading) {
    return (
      <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AutoAwesome sx={{ fontSize: 80, color: 'primary.main', mb: 4 }} />
        </motion.div>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          AI Magic Matching
        </Typography>
        <Typography color="text.secondary">
          Analyzing {allProperties.length} properties against your preferences...
        </Typography>
      </Box>
    );
  }

  if (showResults) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Your Magic Matches
            </Typography>
            <Typography color="text.secondary">
              Found {results.length} properties based on your criteria
            </Typography>
          </Box>
          <Button startIcon={<RestartAlt />} onClick={handleRestart} variant="outlined">
            Start Over
          </Button>
        </Box>

        {results.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>No exact matches found.</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your budget or widening your location preferences.
            </Typography>
            <Button variant="contained" onClick={handleRestart}>Adjust Criteria</Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {results.map((property, index) => (
              <Grid item xs={12} md={4} key={property._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
                    <Box sx={{ position: 'absolute', top: -10, right: -10, zIndex: 1 }}>
                        <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 3 }}>
                            <Box textAlign="center">
                                <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1 }}>{Math.round(property.matchScore)}%</Typography>
                            </Box>
                        </Card>
                    </Box>
                    <CardMedia
                      component="img"
                      height="200"
                      image={property.imageUrl || "https://source.unsplash.com/random/800x600/?apartment"}
                      alt={property.title}
                      sx={{ borderRadius: '12px 12px 0 0' }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom noWrap>{property.title}</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <LocationOn sx={{ fontSize: 16, verticalAlign: 'text-bottom' }} /> {property.location || "Bangalore"}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700} sx={{ my: 1 }}>
                        {property.rentEth} ETH <Typography component="span" variant="caption">/ month</Typography>
                      </Typography>
                      
                      <Box sx={{ mt: 2, bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <AutoAwesome fontSize="small" color="secondary" sx={{ mr: 1 }} />
                            Why it matches:
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                            {property.matchReasons.map((reason, i) => (
                                <Chip key={i} label={reason} size="small" color="success" variant="outlined" sx={{ bgcolor: 'success.light', borderColor: 'transparent', color: 'success.dark' }} />
                            ))}
                        </Stack>
                      </Box>
                      
                      <Button 
                        fullWidth 
                        variant="contained" 
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/property/${property._id}`)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    );
  }

  // WIZARD UI
  const currentQuestion = QUESTIONS[step];

  return (
    <Container maxWidth="md" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, width: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ mb: 4 }}>
          <LinearProgress variant="determinate" value={((step + 1) / QUESTIONS.length) * 100} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
          <Typography variant="caption" color="text.secondary">Step {step + 1} of {QUESTIONS.length}</Typography>
        </Box>

        <AnimatePresence mode='wait'>
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {currentQuestion.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {currentQuestion.subtitle}
            </Typography>

            <Box sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {currentQuestion.type === 'slider' && (
                <Box sx={{ width: '80%' }}>
                  <Typography variant="h3" align="center" color="primary" fontWeight={700} gutterBottom>
                    {preferences[currentQuestion.id]} ETH
                  </Typography>
                  <Slider
                    value={preferences[currentQuestion.id]}
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    step={currentQuestion.step}
                    onChange={(_, val) => updatePreference(val)}
                    valueLabelDisplay="auto"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption">0.01 ETH</Typography>
                    <Typography variant="caption">1.0 ETH</Typography>
                  </Box>
                </Box>
              )}

              {(currentQuestion.type === 'chips' || currentQuestion.type === 'multi-chips') && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                  {currentQuestion.options.map(option => {
                    const isSelected = currentQuestion.type === 'multi-chips' 
                      ? preferences[currentQuestion.id].includes(option)
                      : preferences[currentQuestion.id] === option;
                    
                    return (
                      <Chip
                        key={option}
                        label={option}
                        onClick={() => updatePreference(option)}
                        color={isSelected ? "primary" : "default"}
                        variant={isSelected ? "filled" : "outlined"}
                        sx={{ 
                            px: 2, 
                            py: 3, 
                            fontSize: '1.1rem', 
                            borderRadius: 3,
                            borderWidth: 2,
                            '&:hover': { borderWidth: 2 }
                        }}
                        icon={isSelected ? <CheckCircle /> : null}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          </motion.div>
        </AnimatePresence>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            disabled={step === 0}
            sx={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            endIcon={step === QUESTIONS.length - 1 ? <AutoAwesome /> : <ArrowForward />}
            onClick={handleNext}
            size="large"
            disabled={
                // Disable next if required specific selections are empty (optional logic)
                (currentQuestion.id === 'location' && !preferences.location) ||
                (currentQuestion.id === 'bhk' && !preferences.bhk)
            }
          >
            {step === QUESTIONS.length - 1 ? 'Find My Home' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MagicMatch;
