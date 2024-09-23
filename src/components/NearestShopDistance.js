import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Slider, Chip, Grid, Link } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getGoogleMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const NearestShopDistance = ({ userLocation, stores }) => {
  const [nearestShops, setNearestShops] = useState([]);
  const [driveDuration, setDriveDuration] = useState(15); // Default to 15 minutes
  const [categoryData, setCategoryData] = useState([]);
  const averageSpeed = 30; // km/h

  useEffect(() => {
    if (!userLocation || stores.length === 0) return;

    const maxDistance = (driveDuration / 60) * averageSpeed;

    const shopsWithDistance = stores.map(store => ({
      ...store,
      distance: haversineDistance(
        userLocation[1], userLocation[0],
        parseFloat(store.Latitude), parseFloat(store.Longitude)
      )
    }));

    const filteredShops = shopsWithDistance
      .filter(shop => shop.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    setNearestShops(filteredShops);

    // Process category data for pie chart
    const categories = {};
    filteredShops.forEach(shop => {
      const category = shop['Retail Category'];
      if (categories[category]) {
        categories[category]++;
      } else {
        categories[category] = 1;
      }
    });

    setCategoryData(Object.entries(categories).map(([label, value]) => ({ label, value })));

  }, [userLocation, stores, driveDuration]);

  const handleDriveDurationChange = (event, newValue) => {
    setDriveDuration(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Nearest Shops within {driveDuration} minutes drive
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <DirectionsCarIcon sx={{ mr: 1 }} />
        <Slider
          value={driveDuration}
          onChange={handleDriveDurationChange}
          aria-labelledby="drive-duration-slider"
          valueLabelDisplay="auto"
          step={5}
          marks
          min={5}
          max={600}
          sx={{ flexGrow: 1 }}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {nearestShops.length > 0 ? (
            nearestShops.map((shop, index) => (
              <Box key={index} sx={{ mb: 2, p: 1, border: '1px solid #ddd', borderRadius: 2 }}>
                <Typography variant="subtitle1">
                  {shop['Store_Name']}
                </Typography>
                <Typography variant="body2">
                  Address: {shop['Address']}
                </Typography>
                <Link 
                  href={getGoogleMapsUrl(shop['Address'])} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-block', mb: 1 }}
                >
                  View on Google Maps
                </Link>
                <Typography variant="body2">
                  Category: {shop['Retail Category']}
                </Typography>
                <Typography variant="body2">
                  Distance: {shop.distance.toFixed(2)} km
                </Typography>
                <Typography variant="body2">
                  Est. Drive Time: {(shop.distance / averageSpeed * 60).toFixed(0)} minutes
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {shop['SNAP'] && <Chip label="SNAP" color="primary" size="small" sx={{ mr: 1 }} />}
                  {shop['Fresh Produce'] && <Chip label="Fresh Produce" color="secondary" size="small" />}
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No shops found within the selected drive time.</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {categoryData.length > 0 && (
            <PieChart
              series={[{ data: categoryData }]}
              width={300}
              height={200}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NearestShopDistance;