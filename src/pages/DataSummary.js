import React, { useMemo } from 'react';
import { Paper, Typography, Box, Grid, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>Data Summary</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6">SNAP Redemption by Category</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.chartData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="redemption" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6">Key Statistics</Typography>
            <Typography>Total SNAP Redemption: ${summary.totalRedemption.toLocaleString()}</Typography>
            <Typography>Total Stores: {summary.totalStores}</Typography>
            <Typography>
              SNAP Accepting Stores: {summary.snapAcceptingStores} 
              ({((summary.snapAcceptingStores / summary.totalStores) * 100).toFixed(2)}%)
            </Typography>
            <Typography>
              Stores with Fresh Produce: {summary.freshProduceStores}
              ({((summary.freshProduceStores / summary.totalStores) * 100).toFixed(2)}%)
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Typography variant="h6">Category Breakdown</Typography>
            {summary.chartData.map((item) => (
              <Box key={item.category} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{item.category}</Typography>
                <Typography>
                  Stores: {item.storeCount} 
                  ({((item.storeCount / summary.totalStores) * 100).toFixed(2)}%)
                </Typography>
                <Typography>
                  SNAP Redemption: ${item.redemption.toLocaleString()} 
                  ({((item.redemption / summary.totalRedemption) * 100).toFixed(2)}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataSummary;