import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShopIcon from '@mui/icons-material/Shop';

const categoryIcons = {
  "Grocery Store": <LocalGroceryStoreIcon sx={{ fontSize: 40 }} />,
  "Farmers Market": <ShoppingBasketIcon sx={{ fontSize: 40 }} />,
  "Convenience Store": <StorefrontIcon sx={{ fontSize: 40 }} />,
  "Small Store": <StoreIcon sx={{ fontSize: 40 }} />,
  "Other": <ShopIcon sx={{ fontSize: 40 }} />
};

const SnapRedemptionViz = ({ stores }) => {
  const processData = () => {
    const categoryData = {};
    let total = 0;

    stores.forEach(store => {
      const category = store['Retail Category'];
      const redemption = parseFloat(store['2020 SNAP Redemption Estimate']) || 0;

      if (!categoryData[category]) {
        categoryData[category] = 0;
      }

      categoryData[category] += redemption;
      total += redemption;
    });

    return Object.entries(categoryData)
      .map(([category, value]) => ({
        category,
        value: Number(value.toFixed(2)),
        percentage: ((value / total) * 100).toFixed(2)
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  const data = processData();

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        2020 SNAP Redemption Distribution by Retail Category
      </Typography>
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box 
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                p: 2, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transform: 'translateY(-5px)'
                }
              }}
            >
              {categoryIcons[item.category] || categoryIcons["Other"]}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>
                {item.category}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ${item.value.toLocaleString()}
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#4caf50',
                  background: '#e8f5e9',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'inline-block'
                }}
              >
                {item.percentage}%
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SnapRedemptionViz;