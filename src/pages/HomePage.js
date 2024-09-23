import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper, AppBar, Toolbar, Box } from '@mui/material';
import MapboxComponent from '../components/MapboxComponent';
import SelectionBox from '../components/SelectionBox';
import NearbyStoresViz from '../components/NearbyStoresViz';
import SnapRedemptionViz from '../components/SnapRedemptionViz';
import NearestShopDistance from '../components/NearestShopDistance';
import { supabase } from '../supabaseClient';
import DataSummary from './DataSummary';
import DropdownMenu from '../components/DropdownMenu';

const HomePage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('find_food')
          .select('*');

        if (error) throw error;

        console.log('Fetched data:', data);
        setStores(data);
        setFilteredStores(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.log("Geolocation is not available");
    }
  }, []);

  const filterStores = ({ category, freshProduce, snap }) => {
    const filtered = stores.filter(store => 
      (!category || store['Retail Category'] === category) &&
      (!freshProduce || store['Fresh Produce'] === true) &&
      (!snap || store['SNAP'] === true)
    );
    setFilteredStores(filtered);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <DropdownMenu />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Store Finder
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <MapboxComponent stores={filteredStores} />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3}>
              <SelectionBox filterStores={filterStores} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <NearbyStoresViz stores={filteredStores} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <SnapRedemptionViz stores={filteredStores} />
            </Paper>
          </Grid>

          {userLocation && (
            <Grid item xs={12}>
              <Paper elevation={3}>
                <NearestShopDistance
                  userLocation={userLocation}
                  stores={filteredStores}
                />
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Paper elevation={3}>
              <DataSummary stores={filteredStores} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;

// alternative
// import React, { useState, useEffect } from 'react';
// import { 
//   Container, Grid, Typography, Paper, AppBar, Toolbar, Box, 
//   Tabs, Tab, CircularProgress, Alert, useMediaQuery, useTheme 
// } from '@mui/material';
// import MapboxComponent from '../components/MapboxComponent';
// import SelectionBox from '../components/SelectionBox';
// import NearbyStoresViz from '../components/NearbyStoresViz';
// import SnapRedemptionViz from '../components/SnapRedemptionViz';
// import NearestShopDistance from '../components/NearestShopDistance';
// import { supabase } from '../supabaseClient';
// import DataSummary from './DataSummary';
// import DropdownMenu from '../components/DropdownMenu';

// const HomePage = () => {
//   const [stores, setStores] = useState([]);
//   const [filteredStores, setFilteredStores] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [tabValue, setTabValue] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('find_food')
//           .select('*');

//         if (error) throw error;

//         console.log('Fetched data:', data);
//         setStores(data);
//         setFilteredStores(data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation([position.coords.longitude, position.coords.latitude]);
//         },
//         (error) => {
//           console.error("Error getting user location:", error);
//         }
//       );
//     } else {
//       console.log("Geolocation is not available");
//     }
//   }, []);

//   const filterStores = ({ category, freshProduce, snap }) => {
//     const filtered = stores.filter(store => 
//       (!category || store['Retail Category'] === category) &&
//       (!freshProduce || store['Fresh Produce'] === true) &&
//       (!snap || store['SNAP'] === true)
//     );
//     setFilteredStores(filtered);
//   };

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   if (loading) return (
//     <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//       <CircularProgress />
//     </Box>
//   );
  
//   if (error) return (
//     <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//       <Alert severity="error">Error: {error}</Alert>
//     </Box>
//   );

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static" color="primary">
//         <Toolbar>
//           <DropdownMenu />
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             Your Food Link Map
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth="xl" sx={{ mt: 4 }}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Paper elevation={3} sx={{ p: 2 }}>
//               <Typography variant="h5" gutterBottom>Welcome to Your Food Link Map</Typography>
//               <Typography variant="body1">
//                 Find stores near you, check SNAP acceptance, and locate fresh produce options.
//               </Typography>
//             </Paper>
//           </Grid>

//           <Grid item xs={12}>
//             <Paper elevation={3}>
//               <MapboxComponent stores={filteredStores} userLocation={userLocation} />
//             </Paper>
//           </Grid>

//           <Grid item xs={12}>
//             <Paper elevation={3}>
//               <SelectionBox filterStores={filterStores} />
//             </Paper>
//           </Grid>

//           <Grid item xs={12}>
//             <Paper elevation={3}>
//               <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                 <Tabs value={tabValue} onChange={handleTabChange} aria-label="store information tabs" variant={isMobile ? "scrollable" : "fullWidth"}>
//                   <Tab label="Nearby Stores" />
//                   <Tab label="SNAP Redemption" />
//                   {userLocation && <Tab label="Nearest Shop" />}
//                 </Tabs>
//               </Box>
//               <Box sx={{ p: 3 }}>
//                 {tabValue === 0 && <NearbyStoresViz stores={filteredStores} />}
//                 {tabValue === 1 && <SnapRedemptionViz stores={filteredStores} />}
//                 {tabValue === 2 && userLocation && (
//                   <NearestShopDistance
//                     userLocation={userLocation}
//                     stores={filteredStores}
//                   />
//                 )}
//               </Box>
//             </Paper>
//           </Grid>

//           <Grid item xs={12}>
//             <Paper elevation={3}>
//               <DataSummary stores={filteredStores} />
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default HomePage;