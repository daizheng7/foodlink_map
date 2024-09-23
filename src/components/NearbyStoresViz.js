import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import { distance } from '@turf/turf';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const NearbyStoresViz = ({ stores }) => {
  const [nearbyStores, setNearbyStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          const nearby = stores.filter(store => {
            const storeLocation = [parseFloat(store.Longitude), parseFloat(store.Latitude)];
            const storeDistance = distance(
              [userLocation[0], userLocation[1]],
              [storeLocation[0], storeLocation[1]],
              { units: 'miles' }
            );
            return storeDistance <= 2000; // 20 miles
          });
          setNearbyStores(nearby);
          setLoading(false);
        },
        (error) => {
          setError("Error getting your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, [stores]);

  const getCategoryData = () => {
    const counts = {};
    nearbyStores.forEach(store => {
      const category = store['Retail Category'];
      counts[category] = (counts[category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, value]) => ({
      id: category,
      label: category,
      value
    }));
  };

  const renderPieChart = () => {
    const data = getCategoryData();

    return (
      <Box sx={{ height: 400 }}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
        />
      </Box>
    );
  };

  const renderSnapAndProduceStats = () => {
    const totalStores = nearbyStores.length;
    const snapStores = nearbyStores.filter(store => store.SNAP).length;
    const produceStores = nearbyStores.filter(store => store['Fresh Produce']).length;
    const snapPercentage = (snapStores / totalStores * 100).toFixed(1);
    const producePercentage = (produceStores / totalStores * 100).toFixed(1);

    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Out of {totalStores} nearby stores:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Box sx={{ 
            width: '45%', 
            padding: 2, 
            backgroundColor: 'rgba(75, 192, 192, 0.2)', 
            borderRadius: 4,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
              {snapPercentage}%
            </Typography>
            <Typography variant="h5">
              Accept SNAP
            </Typography>
            <Typography variant="body1">
              ({snapStores} stores)
            </Typography>
          </Box>
          <Box sx={{ 
            width: '45%', 
            padding: 2, 
            backgroundColor: 'rgba(255, 159, 64, 0.2)', 
            borderRadius: 4,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#FF9F40' }}>
              {producePercentage}%
            </Typography>
            <Typography variant="h5">
              Have Fresh Produce
            </Typography>
            <Typography variant="body1">
              ({produceStores} stores)
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Within 2000 Miles of Your Location
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
            <Box sx={{ width: '100%', mb: 4 }}>
              <Typography variant="subtitle1">Store Categories:</Typography>
              {renderPieChart()}
            </Box>
            <Box sx={{ width: '100%' }}>
              {renderSnapAndProduceStats()}
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default NearbyStoresViz;