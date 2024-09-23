import React, { useState, useRef, useMemo, useCallback } from 'react';
import Map, { Marker, GeolocateControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button, Typography, Box, Link, Chip } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShopIcon from '@mui/icons-material/Shop';
import Supercluster from 'supercluster';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const categoryData = {
  "Grocery Store": {
    color: "#4285F4",
    icon: <LocalGroceryStoreIcon />
  },
  "Farmers Market": {
    color: "#0F9D58",
    icon: <ShoppingBasketIcon />
  },
  "Convenience Store": {
    color: "#F4B400",
    icon: <StorefrontIcon />
  },
  "Small Store": {
    color: "#DB4437",
    icon: <StoreIcon />
  },
  "Other": {
    color: "#757575",
    icon: <ShopIcon />
  }
};

function getGoogleMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function generateClusters(stores, zoom) {
  const index = new Supercluster({
    radius: 40,
    maxZoom: 16,
    map: props => ({ category: props.category })
  });
  
  index.load(stores.map(store => ({
    type: 'Feature',
    properties: { 
      cluster: false, 
      storeId: store.id, 
      category: store['Retail Category'] 
    },
    geometry: {
      type: 'Point',
      coordinates: [parseFloat(store.Longitude), parseFloat(store.Latitude)]
    }
  })));

  return index.getClusters([-180, -85, 180, 85], zoom);
}

const Legend = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 60,
      right: 20,
      backgroundColor: 'white',
      padding: 2,
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    }}
  >
    <Typography variant="subtitle1" gutterBottom>Store Types</Typography>
    {Object.entries(categoryData).map(([category, data]) => (
      <Box key={category} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ color: data.color, mr: 1 }}>{data.icon}</Box>
        <Typography variant="body2">{category}</Typography>
      </Box>
    ))}
  </Box>
);

const MapboxComponent = ({ stores }) => {
    const [viewport, setViewport] = useState({
      latitude: 39,
      longitude: -80,
      zoom: 8,
    });
    const [popupInfo, setPopupInfo] = useState(null);
    const geolocateControlRef = useRef();

    const clusters = useMemo(() => generateClusters(stores, viewport.zoom), [stores, viewport.zoom]);

    const handleUseMyLocation = useCallback(() => {
      geolocateControlRef.current?.trigger();
    }, []);

    return (
        <div style={{ width: '100%', height: '60vh', position: 'relative', overflow: 'hidden' }}>
        <Map
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
          
          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount, category: clusterCategory } = cluster.properties;

            if (isCluster) {
              const clusterColor = categoryData[clusterCategory]?.color || '#757575';

              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  latitude={latitude}
                  longitude={longitude}
                >
                  <div
                    style={{
                      width: `${20 + (pointCount / stores.length) * 30}px`,
                      height: `${20 + (pointCount / stores.length) * 30}px`,
                      borderRadius: '50%',
                      backgroundColor: clusterColor,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      border: '2px solid #fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            }

            const store = stores.find(s => s.id === cluster.properties.storeId);
            const storeCategory = categoryData[store['Retail Category']] || categoryData["Other"];

            return (
              <Marker
                key={`store-${store.id}`}
                latitude={latitude}
                longitude={longitude}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(store);
                }}
              >
                <Box 
                  sx={{ 
                    color: storeCategory.color, 
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
                  {storeCategory.icon}
                </Box>
              </Marker>
            );
          })}

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
                    label={popupInfo['SNAP'] ? 'Accepts SNAP' : 'No SNAP'} 
                    color={popupInfo['SNAP'] ? 'primary' : 'default'} 
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
        <Legend />
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
      </div>
    );
};

export default MapboxComponent;