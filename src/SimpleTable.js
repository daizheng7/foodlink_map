import React from 'react';

const SimpleTable = ({ stores }) => {
  if (!stores || stores.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div className="table-container">
      <h2>Stores Information</h2>
      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>County</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Retail Category</th>
            <th>Fresh Produce</th>
            <th>SNAP</th>
            <th>WIC</th>
            <th>Ownership</th>
            <th>New Ownership Since 2019</th>
            <th>New Location Since 2019</th>
            <th>2020 SNAP Redemption Estimate</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.Store_Name}</td>
              <td>{store.Address}</td>
              <td>{store.City}</td>
              <td>{store.State}</td>
              <td>{store.County}</td>
              <td>{store.Latitude}</td>
              <td>{store.Longitude}</td>
              <td>{store['Retail Category']}</td>
              <td>{store['Fresh Produce'] ? 'Yes' : 'No'}</td>
              <td>{store.SNAP ? 'Yes' : 'No'}</td>
              <td>{store.WIC ? 'Yes' : 'No'}</td>
              <td>{store.Ownership}</td>
              <td>{store['New Ownership Since 2019'] ? 'Yes' : 'No'}</td>
              <td>{store['New Location Since 2019'] ? 'Yes' : 'No'}</td>
              <td>{store['2020 SNAP Redemption Estimate']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;