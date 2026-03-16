  import React, { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    makeStyles,
    Box,
  } from "@material-ui/core";

  import type { ProductType } from "../types/ProductTypeI";
  import { Add, Delete, Edit, Search } from "@material-ui/icons";

  //custom hook for styling
  const useStyles = makeStyles((theme) => ({
    root: {
      padding: theme.spacing(4),
      margin: theme.spacing(3),
      borderRadius: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing(4),
    },
    title: {
      fontWeight: 700,
      color: theme.palette.text.primary,
    },
    searchBar: {
      display: "flex",
      gap: theme.spacing(2),
      alignItems: "center",
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1),
    },
    tableHeader: {
      backgroundColor: theme.palette.primary.light,
      "& th": {
        color: theme.palette.primary.contrastText,
        fontWeight: "bold",
      },
    },
    highlight: {
      backgroundColor: "#fff176",
      padding: "2px 4px",
      borderRadius: "4px",
      color: "#000",
    },
    deleteBtn: {
      color: theme.palette.error.main,
      "&:hover": { backgroundColor: theme.palette.error.light + "20" },
    },
    editBtn: {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1),
    },
    dialogPaper: {
      borderRadius: theme.spacing(2),
      padding: theme.spacing(1),
    },
  }));

  const DeleteAndEdit = () => {
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

    //state to handle the modal
    const [open, setOpen] = useState(false);

    //state to handle the data inside the modal
    const [editProduct, setEditProduct] = useState<ProductType | null>(null);

    const [isEditMode, setIsEditMode] = useState(false);

    //object to access the styles
    const classes = useStyles();

    // 4. Use useMemo for the paginated slice
    // This prevents recalculating the array slice unless data, page, or row changes
    const paginatedData = useMemo(() => {
      return filteredData.slice(page * row, page * row + row);
    }, [filteredData, page, row]);

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
    const handleSearch = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
      setSearch(e.target.value);
    }, []);

    //function to filter the data based on search query
    const handleFilter = useCallback(() => {
      const filtered = data.filter((item) => {
        const target = search.toLowerCase();
        return (
          item.productName.toLowerCase().includes(target) ||
          item.productDescription.toLowerCase().includes(target)
        );
      });

      setFilteredData(filtered);
      setActiveSearch(search);
    }, [data, search]);

    //function to handle the page change
    const handleChangePage = useCallback(
      (e: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        setPage(page);
      },
      [],
    );

    //function to handle the row per page
    const handleChangeRowsPerPage = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRow(parseInt(e.target.value, 10));
      },
      [],
    );

    const fetchALL = useCallback(async () => {
      let res = await fetch("http://localhost:4000/product-api/products");
      let productData = await res.json();
      setData(productData.payload);
      setFilteredData(productData.payload);
    }, []);

    useEffect(() => {
      // Fetch from your Express server
      fetchALL();
    }, []);

    //function to handle the delete operation
    const handleDelete = useCallback(async (productId: string) => {
      let res = await fetch(`http://localhost:4000/product-api/product/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status == 200) {
        let productData = await res.json();
        setData(productData.payload);
        setFilteredData(productData.payload);
      }
    }, []);

    //function to open the dialogue box
    const handleOpenAddModal = useCallback(() => {
      setIsEditMode(false);
      setEditProduct({ productId: "", productName: "", productDescription: "" } as ProductType);
      setOpen(true);
    }, []);

    //function to edit the modal
    const handleOpenEditModal = useCallback((product: ProductType) => {
      setIsEditMode(true);
      setEditProduct({ ...product });
      setOpen(true);
    }, []);

    //function to close the modal
    const handleCloseModal = useCallback(() => {
      setOpen(false);
      setEditProduct(null);
    }, []);

    //function to handle the input inside modal box
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
    setEditProduct((prev) => (prev ? { ...prev, [name]: value } : null));
    }, []);

    //function to handle the edit products
    const handleEdit = useCallback(async () => {
      let productId = editProduct!.productId;
      let res = await fetch(`http://localhost:4000/product-api/product/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });

      if (res.status === 200) {
        let productData = await res.json();
        setData(productData.payload);
        setFilteredData(productData.payload);
        handleCloseModal(); // Close modal on success
      }
    }, [editProduct, handleCloseModal]);

    // function to  add  the product
    const handleAdd = useCallback(async () => {
      let res = await fetch("http://localhost:4000/product-api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });

      if (res.status === 200 || res.status === 201) {
        let productData = await res.json();
        setData(productData.payload);
        setFilteredData(productData.payload);
        handleCloseModal();
      }
    }, [editProduct, handleCloseModal]);

    return (
      <Paper className={classes.root} elevation={0}>
        <Box className={classes.header}>
          <Typography variant="h4" className={classes.title}>
            Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenAddModal}
            size="large"
          >
            Add Product
          </Button>
        </Box>

        <Box className={classes.searchBar}>
          <TextField
            label="Search items"
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={handleSearch}
          />
          <Button variant="outlined" color="primary" startIcon={<Search />} onClick={handleFilter}>
            Search
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role / Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((it) => (
                <TableRow key={it.productId} hover>
                  <TableCell>{it.productId}</TableCell>
                  <TableCell>{getHighlightedText(it.productName, activeSearch)}</TableCell>
                  <TableCell>{getHighlightedText(it.productDescription, activeSearch)}</TableCell>
                  <TableCell align="center">
                    <Button
                      startIcon={<Edit />}
                      className={classes.editBtn}
                      onClick={() => handleOpenEditModal(it)}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<Delete />}
                      className={classes.deleteBtn}
                      onClick={() => handleDelete(it.productId)}
                    >
                      Delete
                    </Button>
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

        {/* MODAL */}
        <Dialog
          open={open}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="xs"
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle>{isEditMode ? "Update Product" : "Create New Entry"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="productId"
              label="Product ID"
              fullWidth
              variant="filled"
              disabled={isEditMode}
              value={editProduct?.productId || ""}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="productName"
              label="Name"
              fullWidth
              variant="filled"
              value={editProduct?.productName || ""}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="productDescription"
              label="Description"
              fullWidth
              variant="filled"
              multiline
              rows={2}
              value={editProduct?.productDescription || ""}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={isEditMode ? handleEdit : handleAdd}>
              {isEditMode ? "Save Changes" : "Register Product"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  };

  export default DeleteAndEdit;
