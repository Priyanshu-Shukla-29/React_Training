import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography 
} from '@material-ui/core';
import type { ProductType } from '../types/ProductTypeI';


const FetchProducts = () => {
  const [data, setData] = useState<ProductType[]>([]);

  async function fetchALL() {
    let res = await fetch('http://localhost:4000/product-api/products')
    let productData = await res.json()
    setData(productData.payload)
  }

  useEffect(() => {
    // Fetch from your Express server 
     fetchALL()
  }, []);
 
   console.log(data)
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" >
        Product Data
      </Typography>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.productId}>
              <TableCell component="th" scope="row">{row.productId}</TableCell>
              <TableCell align="right">{row.productName}</TableCell>
              <TableCell align="right">{row.productDescription}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FetchProducts;