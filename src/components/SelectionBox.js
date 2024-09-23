import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup, Checkbox, FormControlLabel, Box, Typography } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import ShopIcon from '@mui/icons-material/Shop';
import SpaIcon from '@mui/icons-material/Spa'; // Icon for Fresh Produce
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icon for SNAP

const SelectionBox = ({ filterStores }) => {
  const [category, setCategory] = useState('');
  const [freshProduce, setFreshProduce] = useState(false);
  const [snap, setSnap] = useState(false);

  const handleCategoryChange = (event, newCategory) => {
    setCategory(newCategory);
    filterStores({ category: newCategory, freshProduce, snap });
  };

  const handleFreshProduceChange = (event) => {
    setFreshProduce(event.target.checked);
    filterStores({ category, freshProduce: event.target.checked, snap });
  };

  const handleSnapChange = (event) => {
    setSnap(event.target.checked);
    filterStores({ category, freshProduce, snap: event.target.checked });
  };

  return (
    <Box sx={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '4px' }}>
      {/* Row 1: Retail Categories */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="Retail Category"
        >
          <ToggleButton value="Grocery" aria-label="Grocery">
            <LocalGroceryStoreIcon style={{ fontSize: '2.5rem' }} />
            <Typography variant="caption">Grocery</Typography>
          </ToggleButton>
          <ToggleButton value="Farmers Market" aria-label="Farmers Market">
            <ShoppingBasketIcon style={{ fontSize: '2.5rem' }} />
            <Typography variant="caption">Farmers Market</Typography>
          </ToggleButton>
          <ToggleButton value="Small Box" aria-label="Small Box">
            <StoreIcon style={{ fontSize: '2.5rem' }} />
            <Typography variant="caption">Small Box</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Row 2: More Retail Categories */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="Retail Category"
        >
          <ToggleButton value="Convenience" aria-label="Convenience">
            <StorefrontIcon style={{ fontSize: '2.5rem' }} />
            <Typography variant="caption">Convenience</Typography>
          </ToggleButton>
          <ToggleButton value="Other" aria-label="Other">
            <ShopIcon style={{ fontSize: '2.5rem' }} />
            <Typography variant="caption">Other</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Row 3: Additional Selections */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <FormControlLabel
          control={
            <Checkbox
              icon={<SpaIcon style={{ fontSize: '2.5rem' }} />}
              checkedIcon={<SpaIcon color="primary" style={{ fontSize: '2.5rem' }} />}
              checked={freshProduce}
              onChange={handleFreshProduceChange}
            />
          }
          label={<Typography variant="caption">Sells Fresh Produce</Typography>}
        />

        <FormControlLabel
          control={
            <Checkbox
              icon={<AttachMoneyIcon style={{ fontSize: '2.5rem' }} />}
              checkedIcon={<AttachMoneyIcon color="primary" style={{ fontSize: '2.5rem' }} />}
              checked={snap}
              onChange={handleSnapChange}
            />
          }
          label={<Typography variant="caption">Accepts SNAP</Typography>}
        />
      </Box>
    </Box>
  );
};

export default SelectionBox;