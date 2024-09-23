import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import DataSummary from '../components/DataSummary';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DataSummaryPage = ({ stores }) => {
  const totalStores = stores.length;
  const snapAcceptingStores = stores.filter(store => store.SNAP).length;
  const freshProduceStores = stores.filter(store => store['Fresh Produce']).length;

  const pieChartData = [
    { name: 'SNAP Accepting', value: snapAcceptingStores },
    { name: 'Non-SNAP Accepting', value: totalStores - snapAcceptingStores },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom component="h1" align="center">
        Food Link Data Summary
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Quick Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {totalStores}
                  </Typography>
                  <Typography variant="body1">Total Stores</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary">
                    {snapAcceptingStores}
                  </Typography>
                  <Typography variant="body1">SNAP Accepting Stores</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {freshProduceStores}
                  </Typography>
                  <Typography variant="body1">Fresh Produce Stores</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {((snapAcceptingStores / totalStores) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body1">SNAP Acceptance Rate</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              SNAP Acceptance Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Store Categories
            </Typography>
            <Typography variant="body1">
              Detailed breakdown of store categories and their distributions can be added here.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <DataSummary stores={stores} />
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              About the Data
            </Typography>
            <Typography variant="body1" paragraph>
              This data summary provides an overview of the Food Link stores in our database. 
              It includes information on SNAP acceptance, fresh produce availability, and store categories.
            </Typography>
            <Typography variant="body1">
              The data is collected from various sources and is regularly updated to ensure accuracy. 
              For more detailed information or to report any discrepancies, please contact our data team.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DataSummaryPage;