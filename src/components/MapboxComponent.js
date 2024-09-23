import React, { useState, useRef, useMemo, useCallback } from 'react';
import Map, { Marker, GeolocateControl, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button, Typography, Box, Link, Chip, Paper } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShopIcon from '@mui/icons-material/Shop';
import Supercluster from 'supercluster';
import LocalConvenienceStoreIcon from '@mui/icons-material/LocalConvenienceStore';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import BusinessIcon from '@mui/icons-material/Business';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const categoryData = {
  "Grocery": {
    color: "#4285F4",
    icon: <LocalGroceryStoreIcon />
  },
  "Farmers Market": {
    color: "#0F9D58",
    icon: <ShoppingBasketIcon />
  },
  "Convenience": {
    color: "#F4B400",
    icon: <StorefrontIcon />
  },
  "Small Box": {
    color: "#DB4437",
    icon: <LocalMallIcon />
  },
  "Specialty": {
    color: "#DB4437",
    icon: <TypeSpecimenIcon />
  },
  "Big Box": {
    color: "#757575",
    icon: <BusinessIcon />
  }
};

function getGoogleMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const MapboxComponent = ({ stores }) => {
  const [viewport, setViewport] = useState({
    latitude: 39,
    longitude: -80,
    zoom: 7,
  });
  const [popupInfo, setPopupInfo] = useState(null);
  const mapRef = useRef();
  const geolocateControlRef = useRef();

  const categorizedPoints = useMemo(() => {
    const categories = {};
    stores.forEach(store => {
      const category = store['Retail Category'];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        type: 'Feature',
        properties: {
          cluster: false,
          storeId: store.id,
          category: category,
          ...store
        },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(store.Longitude), parseFloat(store.Latitude)]
        }
      });
    });
    return categories;
  }, [stores]);

  const superclusterRefs = useMemo(() => {
    const refs = {};
    Object.keys(categorizedPoints).forEach(category => {
      refs[category] = new Supercluster({
        radius: 150,
        maxZoom: 6,
      });
      refs[category].load(categorizedPoints[category]);
    });
    return refs;
  }, [categorizedPoints]);

  const clusters = useMemo(() => {
    if (!mapRef.current) return {};

    const bounds = mapRef.current.getBounds().toArray().flat();
    const zoom = Math.floor(viewport.zoom);

    const categoryClusters = {};
    Object.keys(superclusterRefs).forEach(category => {
      categoryClusters[category] = superclusterRefs[category].getClusters(bounds, zoom);
    });
    return categoryClusters;
  }, [superclusterRefs, viewport.zoom]);

  const handleClusterClick = useCallback((clusterId, longitude, latitude, category) => {
    const expansionZoom = Math.min(superclusterRefs[category].getClusterExpansionZoom(clusterId), 20);
    setViewport({
      ...viewport,
      longitude,
      latitude,
      zoom: expansionZoom,
      transitionDuration: 500
    });
  }, [superclusterRefs, viewport]);

  const handleUseMyLocation = () => {
    geolocateControlRef.current?.trigger();
  };

  return (
    <div style={{ width: '100%', height: '60vh', position: 'relative', overflow: 'hidden' }}>
      <Map
        ref={mapRef}
        initialViewState={viewport}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={(evt) => setViewport(evt.viewState)}
      >
        <GeolocateControl
          ref={geolocateControlRef}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1
          }}
        />
        <NavigationControl position="top-right" />
        
        {Object.entries(clusters).map(([category, categoryClusters]) => 
          categoryClusters.map(cluster => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } = cluster.properties;

            const categoryInfo = categoryData[category] || categoryData["Other"];

            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${category}-${cluster.id}`}
                  latitude={latitude}
                  longitude={longitude}
                >
                  <Box
                    onClick={() => handleClusterClick(cluster.id, longitude, latitude, category)}
                    sx={{
                      width: `${10 + (pointCount / categorizedPoints[category].length) * 30}px`,
                      height: `${10 + (pointCount / categorizedPoints[category].length) * 30}px`,
                      borderRadius: '50%',
                      backgroundColor: categoryInfo.color,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 'bold',
                      border: '2px solid white',
                    }}
                  >
                    {pointCount}
                  </Box>
                </Marker>
              );
            }

            return (
              <Marker
                key={`store-${cluster.properties.storeId}`}
                latitude={latitude}
                longitude={longitude}
              >
                <Box 
                  onClick={() => setPopupInfo(cluster.properties)}
                  sx={{ 
                    color: categoryInfo.color, 
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  {categoryInfo.icon}
                </Box>
              </Marker>
            );
          })
        )}

        {popupInfo && (
          <Popup
            anchor="top"
            latitude={parseFloat(popupInfo.Latitude)}
            longitude={parseFloat(popupInfo.Longitude)}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
          >
            <Box sx={{ p: 2, maxWidth: 250 }}>
              <Typography variant="h6" gutterBottom>{popupInfo['Store_Name']}</Typography>
              <Typography variant="body2" gutterBottom>{popupInfo['Address']}</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
                <Chip 
                  label={popupInfo['WIC'] ? 'Accepts WIC' : 'No WIC'} 
                  color={popupInfo['WIC'] ? 'primary' : 'default'} 
                  size="small"
                />
                <Chip 
                  label={popupInfo['Fresh Produce'] ? 'Fresh Produce' : 'No Fresh Produce'} 
                  color={popupInfo['Fresh Produce'] ? 'success' : 'default'} 
                  size="small"
                />
              </Box>
              <Link 
                href={getGoogleMapsUrl(popupInfo['Address'])} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  display: 'inline-block', 
                  mt: 1,
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                View on Google Maps
              </Link>
            </Box>
          </Popup>
        )}
      </Map>
      <Button
        variant="contained"
        startIcon={<MyLocationIcon />}
        onClick={handleUseMyLocation}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          }
        }}
      >
        Use My Location
      </Button>
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography variant="h6" gutterBottom>Legend</Typography>
        {Object.entries(categoryData).map(([category, data]) => (
          <Box key={category} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              backgroundColor: data.color, 
              mr: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: 12
            }}>
              {data.icon}
            </Box>
            <Typography variant="body2">{category}</Typography>
          </Box>
        ))}
      </Paper>
    </div>
  );
};

export default MapboxComponent;