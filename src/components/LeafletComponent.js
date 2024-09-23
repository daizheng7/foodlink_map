import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Typography, Box, Chip } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShopIcon from '@mui/icons-material/Shop';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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

const LeafletComponent = ({ stores }) => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const handleUseMyLocation = () => {
    map.locate({setView: true, maxZoom: 16});
  };

  useEffect(() => {
    if (map) {
      map.on('locationfound', (e) => {
        setUserLocation(e.latlng);
        L.marker(e.latlng).addTo(map)
          .bindPopup('You are here')
          .openPopup();
      });
    }
  }, [map]);

  return (
    <div style={{ width: '100%', height: '60vh', position: 'relative' }}>
      <MapContainer 
        center={[39, -80]} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stores && stores.map((store) => {
          const category = categoryData[store['Retail Category']] || categoryData["Other"];
          return (
            <Marker
              key={store.id}
              position={[parseFloat(store.Latitude), parseFloat(store.Longitude)]}
              icon={L.divIcon({
                className: 'custom-icon',
                html: `<div style="color: ${category.color}; background-color: white; border-radius: 50%; padding: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${React.renderToString(category.icon)}</div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
              })}
            >
              <Popup>
                <Box sx={{ p: 2, maxWidth: 250 }}>
                  <Typography variant="h6" gutterBottom>{store['Store_Name']}</Typography>
                  <Typography variant="body2" gutterBottom>{store['Address']}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
                    <Chip 
                      label={store['SNAP'] ? 'Accepts SNAP' : 'No SNAP'} 
                      color={store['SNAP'] ? 'primary' : 'default'} 
                      size="small"
                    />
                    <Chip 
                      label={store['Fresh Produce'] ? 'Fresh Produce' : 'No Fresh Produce'} 
                      color={store['Fresh Produce'] ? 'success' : 'default'} 
                      size="small"
                    />
                  </Box>
                  <a 
                    href={getGoogleMapsUrl(store['Address'])} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-block', 
                      marginTop: '8px',
                      color: '#1976d2',
                      textDecoration: 'none'
                    }}
                  >
                    View on Google Maps
                  </a>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <Button
        variant="contained"
        startIcon={<MyLocationIcon />}
        onClick={handleUseMyLocation}
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        Use My Location
      </Button>
    </div>
  );
};

export default LeafletComponent;