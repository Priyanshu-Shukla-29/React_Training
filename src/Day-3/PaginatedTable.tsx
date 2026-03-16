import React, { useEffect, useState, type ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TextField,
  Button,
} from "@material-ui/core";
 
import type { ProductType } from "../types/ProductTypeI";
 
const PaginatedTable = () => {
  //state for product data
  const [data, setData] = useState<ProductType[]>([]);
 
  //state for the filtered product data
  const [filteredData, setFilteredData] = useState<ProductType[]>([]);
 
  //state for the page change
  const [page, setPage] = useState<number>(0);
 
  //state for the row per page
  const [row, setRow] = useState<number>(5);
 
  //state for the product search
  const [search, setSearch] = useState<string>("");
 
  //state for the active search query
  const [activeSearch, setActiveSearch] = useState<string>("");
 
  //function to highlight the text
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
 
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} style={{ backgroundColor: "yellow", padding: 0 }}>
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </span>
    );
  };
 
  //function to handle input search query
  const handleSearch = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSearch(e.target.value);
  };
 
  //function to filter the data based on search query
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const target = search.toLowerCase();
      return (
        item.productName.toLowerCase().includes(target) ||
        item.productDescription.toLowerCase().includes(target)
      );
    });
 
    setFilteredData(filtered);
    setActiveSearch(search);
  };
 
  //function to handle the page change
  const handleChangePage = (e: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };
 
  //function to handle the row per page
  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRow(parseInt(e.target.value, 10));
  };
 
  async function fetchALL() {
    let res = await fetch("http://localhost:4000/product-api/products");
    let productData = await res.json();
    setData(productData.payload);
    setFilteredData(productData.payload);
  }
 
  useEffect(() => {
    // Fetch from your Express server
    fetchALL();
  }, []);
 
  console.log(data);
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Typography variant="h6">Product Data</Typography>
        <TextField
          id="outlined-controlled"
          label="Controlled"
          value={search}
          onChange={handleSearch}
        />
        <Button variant="contained" color="primary" onClick={handleFilter}>
          search
        </Button>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * row, page * row + row).map((it: any) => (
              <TableRow key={it.productId}>
                <TableCell component="th" scope="row">
                  {it.productId}
                </TableCell>
                <TableCell align="right">
                  {getHighlightedText(it.productName, activeSearch)}
                </TableCell>
                <TableCell align="right">
                  {getHighlightedText(it.productDescription, activeSearch)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
 
      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={row}
        rowsPerPageOptions={[5, 10, 25]}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
 
export default PaginatedTable;