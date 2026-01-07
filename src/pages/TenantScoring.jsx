import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VerifiedUser, 
  Info, 
  TrendingUp, 
  Timeline, 
  Warning, 
  CheckCircle 
} from '@mui/icons-material';

// --- MOCK DATA ---
const scoreHistoryData = [
  { month: 'Jan', score: 720, payment: 'On Time' },
  { month: 'Feb', score: 725, payment: 'On Time' },
  { month: 'Mar', score: 735, payment: 'On Time' },
  { month: 'Apr', score: 742, payment: 'Early' },
  { month: 'May', score: 740, payment: 'On Time' },
  { month: 'Jun', score: 755, payment: 'On Time' },
];

const criteriaData = [
  { name: 'Rent History', score: 95, weight: 'High', fullMark: 100 },
  { name: 'Compliance', score: 88, weight: 'Medium', fullMark: 100 },
  { name: 'Stability', score: 75, weight: 'Medium', fullMark: 100 },
  { name: 'Maintenance', score: 82, weight: 'Low', fullMark: 100 },
  { name: 'Disputes', score: 100, weight: 'High', fullMark: 100 }, // 100 means NO disputes
];

const riskData = [
  { name: 'Score', value: 785 },
  { name: 'Remaining', value: 215 },
];

const activityData = [
  { month: 'Jan', compliance: 100, disputes: 0 },
  { month: 'Feb', compliance: 98, disputes: 0 },
  { month: 'Mar', compliance: 100, disputes: 0 },
  { month: 'Apr', compliance: 100, disputes: 0 },
  { month: 'May', compliance: 95, disputes: 0 },
  { month: 'Jun', compliance: 100, disputes: 0 },
];

const COLORS = ['#667eea', '#e0e7ff'];

// --- COMPONENTS ---

const Gauge = ({ score }) => {
  return (
    <Box sx={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
            <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e7ff" strokeWidth="15" />
            <motion.circle 
                cx="100" cy="100" r="90" fill="none" stroke="url(#scoreGradient)" strokeWidth="15" 
                strokeDasharray="565.48" 
                strokeDashoffset={565.48 - (565.48 * (score / 1000))} 
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                initial={{ strokeDashoffset: 565.48 }}
                animate={{ strokeDashoffset: 565.48 - (565.48 * (score / 1000)) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </svg>
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Typography variant="h3" fontWeight={800} sx={{ color: 'primary.main' }}>
                    {score}
                </Typography>
                <Typography variant="overline" color="text.secondary">
                    EXCELLENT
                </Typography>
            </motion.div>
        </Box>
    </Box>
  );
};

const TenantScoring = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Box sx={{ p: 4 }}>Loading AI Score...</Box>;

  return (
    <Box sx={{ pb: 8, pt: 2 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        {/* HEADER SECTION */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Tenant AI Score
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time risk assessment powered by blockchain data
            </Typography>
          </Box>
          <Chip 
            icon={<VerifiedUser />} 
            label="Aadhaar & PAN Verified" 
            color="success" 
            variant="outlined" 
            sx={{ px: 1, py: 2, borderRadius: 2, fontWeight: 600 }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* SCORE CARD */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                    <Chip label="Low Risk" color="success" size="small" />
                </Box>
                <Gauge score={785} />
                <Box sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
                     <Typography variant="body2" color="text.secondary">
                        Top 5% of Tenants in your area
                     </Typography>
                </Box>
            </Paper>
          </Grid>

          {/* PAYMENT HISTORY CHART */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>Rent Payment Behavior</Typography>
                </Box>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={scoreHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                        <RechartsTooltip 
                            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#667eea" 
                            strokeWidth={4} 
                            dot={{ r: 4, fill: '#667eea', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* CRITERIA BREAKDOWN */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Score Composition
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {criteriaData.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{item.score}/100</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={item.score} 
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    backgroundColor: '#f1f5f9',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        backgroundColor: item.score >= 90 ? '#10b981' : item.score >= 75 ? '#667eea' : '#f59e0b'
                                    }
                                }} 
                            />
                        </Box>
                    ))}
                </Box>
            </Paper>
          </Grid>

          {/* RISK & EXPLANATION */}
          <Grid item xs={12} md={6}>
             <Paper sx={{ p: 3, borderRadius: 4, height: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Risk Analysis
                </Typography>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell key="cell-score" fill="#667eea" />
                                    <Cell key="cell-rem" fill="#e2e8f0" />
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                <CheckCircle color="success" sx={{ fontSize: 16, verticalAlign: 'text-top', mr: 0.5 }} />
                                Strong Payment History
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" paragraph>
                                Consistently pays rent on time or early.
                            </Typography>

                            <Typography variant="subtitle2" gutterBottom>
                                <CheckCircle color="success" sx={{ fontSize: 16, verticalAlign: 'text-top', mr: 0.5 }} />
                                Zero Disputes
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                No record of smart contract disputes.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
             </Paper>
          </Grid>

        </Grid>
      </motion.div>
    </Box>
  );
};

export default TenantScoring;
