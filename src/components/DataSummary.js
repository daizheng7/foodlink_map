import React, { useMemo } from 'react';
import { Paper, Typography, Box, Grid, Chip, Card, CardContent, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DataSummary = ({ stores }) => {
  const summary = useMemo(() => {
    const categoryData = {};
    let totalRedemption = 0;
    let totalStores = stores.length;
    let snapAcceptingStores = 0;
    let freshProduceStores = 0;

    stores.forEach(store => {
      const category = store['Retail Category'];
      const redemption = parseFloat(store['2020 SNAP Redemption Estimate']) || 0;

      if (!categoryData[category]) {
        categoryData[category] = { count: 0, redemption: 0 };
      }

      categoryData[category].count++;
      categoryData[category].redemption += redemption;
      totalRedemption += redemption;

      if (store['SNAP']) snapAcceptingStores++;
      if (store['Fresh Produce']) freshProduceStores++;
    });

    const chartData = Object.entries(categoryData).map(([category, data]) => ({
      category,
      redemption: data.redemption,
      storeCount: data.count,
    }));

    return {
      chartData,
      totalRedemption,
      totalStores,
      snapAcceptingStores,
      freshProduceStores,
    };
  }, [stores]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Paper elevation={3} sx={{ p: 4, m: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>Data Summary</Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>SNAP Redemption by Category</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.chartData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="redemption" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Store Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summary.chartData}
                    dataKey="storeCount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {summary.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Key Statistics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">${summary.totalRedemption.toLocaleString()}</Typography>
                    <Typography variant="subtitle1">Total SNAP Redemption</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">{summary.totalStores}</Typography>
                    <Typography variant="subtitle1">Total Stores</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {((summary.snapAcceptingStores / summary.totalStores) * 100).toFixed(2)}%
                    </Typography>
                    <Typography variant="subtitle1">SNAP Accepting Stores</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {((summary.freshProduceStores / summary.totalStores) * 100).toFixed(2)}%
                    </Typography>
                    <Typography variant="subtitle1">Stores with Fresh Produce</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Category Breakdown</Typography>
              <Grid container spacing={2}>
                {summary.chartData.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.category}>
                    <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{item.category}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography>
                        Stores: {item.storeCount} 
                        <Chip 
                          size="small" 
                          label={`${((item.storeCount / summary.totalStores) * 100).toFixed(2)}%`}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      <Typography>
                        SNAP Redemption: ${item.redemption.toLocaleString()} 
                        <Chip 
                          size="small" 
                          label={`${((item.redemption / summary.totalRedemption) * 100).toFixed(2)}%`}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataSummary;