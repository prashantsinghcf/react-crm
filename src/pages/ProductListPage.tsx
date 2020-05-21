import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import Pagination from "@material-ui/lab/Pagination";
import TableRow from "@material-ui/core/TableRow";
import Fab from "@material-ui/core/Fab";
import ContentCreate from "@material-ui/icons/Create";
import ActionDelete from "@material-ui/icons/Delete";
import ContentAdd from "@material-ui/icons/Add";
import Search from "@material-ui/icons/Search";
import PageBase from "../components/PageBase";
import { connect } from "react-redux";
import { getAction } from "../actions/product";
import Dialog from "@material-ui/core/Dialog";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import { teal, pink, grey, green, common } from "@material-ui/core/colors";
import { thunkApiCall } from "../services/thunks";
import { NEW_PRODUCT, LIST_PRODUCT, ApiAction } from "../store/types";
import { Product } from "../types";
import {
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "../components/Alert";

const grey500 = grey["500"];
const green400 = green["400"];
const white = common.white;

const styles = {
  fab: {
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed" as TODO,
    marginRight: 20,
  },
  fabSearch: {
    top: "auto",
    right: 100,
    bottom: 20,
    left: "auto",
    position: "fixed" as TODO,
    marginRight: 20,
    backgroundColor: "lightblue" as TODO,
  },
  editButton: {
    marginRight: "1em",
    color: white,
    backgroundColor: green400,
    width: 36,
    height: 36,
  },
  editButtonIcon: {
    fill: white,
  },
  deleteButton: {
    color: "grey",
    fill: grey500,
    width: 36,
    height: 36,
  },
  columns: {
    width10: {
      width: "10%",
    },
  },
  dialog: {
    width: "20%",
    maxWidth: "none",
  },
  drawer: {
    backgroundColor: "lightgrey",
  },
  row: {
    margin: "1.5em",
    width: "95%",
  },
  pagination: {
    width: "220px",
    margin: "0 auto",
    paddingTop: 10,
  },
};

interface ProductListProps {
  pageCount: number;
  isFetching: boolean;
  productList: Product[];
  searchProduct: typeof thunkApiCall;
  deleteProduct: typeof thunkApiCall;
  newProduct: typeof thunkApiCall;
  deleteSuccess: boolean;
  errorMessage: string;
  deleted: boolean;
}

interface ProductListState {
  open: boolean;
  isFetching: boolean;
  searchOpen: boolean;
  snackbarOpen: boolean;
  autoHideDuration: number;
  page: number;
  items: Product[];
  productList: Product[];
  totalPages: number;
  productId: number;
  dialogText: string; //'Are you sure to do this?',
  search: {
    product: string;
  };
}

class ProductListPage extends React.Component<
  ProductListProps,
  ProductListState
> {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onSnackBarClose = this.onSnackBarClose.bind(this);
    this.handleNewProduct = this.handleNewProduct.bind(this);
  }

  state: ProductListState = {
    isFetching: true,
    open: false,
    searchOpen: false,
    snackbarOpen: false,
    autoHideDuration: 2000,
    page: 1,
    items: [],
    totalPages: 1,
    productId: null,
    productList: [],
    dialogText: "Are you sure to do this?",
    search: {
      product: "",
    },
  };

  UNSAFE_componentWillMount() {}

  /* eslint-disable */
  componentDidMount() {
    // reset page if items array has changed
    // if (this.props.productList !== prevProps.productList) {
    //   //this.setPage(this.props.initialPage);
    //   this.onChangePage(this.props.productList.slice(0, 10));
    // }
    this.handleSearch();
  }

  componentDidUpdate(prevProps) {
    // reset page if items array has changed
    if (this.props.productList !== prevProps.productList) {
      this.setState({ productList: this.props.productList });
      const page = 1;
      const totalPages = Math.ceil(this.props.productList.length / 10);
      const items = this.props.productList.slice(0, 10);
      const isFetching = this.props.isFetching;
      this.setState({ page, totalPages, items, isFetching });
    }
    console.log(" this.props.deleted " + this.props.deleted);

    if (
      this.props.deleted !== prevProps.deleted &&
      this.props.deleted === true
    ) {
      this.setState({ snackbarOpen: true });
      this.handleSearch();
    }
  }

  onPageChange(_event: React.ChangeEvent<unknown>, page: number) {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const items = this.props.productList.slice(startIndex, endIndex);
    this.setState({ page, items });
  }

  onDelete(id) {
    if (id) {
      this.handleOpen(id);
    }
  }

  handleToggle() {
    this.setState({ searchOpen: !this.state.searchOpen });
  }

  handleSearch() {
    // this.setState({ searchOpen: !this.state.searchOpen });
    // this.props.getAllProducts(this.state.search);
    // this.setState({ searchOpen: false, isFetching: true });
    const action = getAction(LIST_PRODUCT, null, null, "") as ApiAction;
    this.props.searchProduct(action); //this.state.search);
  }

  handleOpen(id) {
    this.setState({ dialogText: "Are you sure to delete this data?" });
    this.setState({ open: true });
    this.setState({ productId: id });
  }

  handleClose(isConfirmed) {
    this.setState({ open: false });

    if (isConfirmed && this.state.productId) {
      // this.props.deleteProduct(this.state.productId);
      this.setState({ productId: null });
    }
  }
  onSnackBarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  handleNewProduct() {
    const action = getAction(NEW_PRODUCT)as ApiAction;
    this.props.newProduct(action);
    // @ts-ignore
    this.props.history.push("/newproduct");
  }

  handleSearchFilter(event) {
    const field = event.target.name;

    if (event && event.target && field) {
      const search = Object.assign({}, this.state.search);
      search[field] = event.target.value;
      this.setState({ search: search });
    }
  }

  handleErrorMessage() {
    this.setState({
      snackbarOpen: true,
    });
  }

  handleSnackBarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  render() {
    const { productList, isFetching } = this.props;

    const dialogButtons = [
      <Fab
        key="cancel-btn"
        color="primary"
        variant="extended"
        onClick={() => this.handleClose(false)}
      >
        Cancel
      </Fab>,
      <Fab
        key="confirm-btn"
        color="secondary"
        variant="extended"
        onClick={() => this.handleClose(true)}
      >
        Confirm
      </Fab>,
    ];

    return (
      <PageBase
        title={"Products (" + productList.length + ")"}
        navigation="React CRM / Product"
      >
        {isFetching ? (
          <div>
            <Skeleton variant="rect" style={styles.row} height={50} />
            <Skeleton variant="rect" style={styles.row} height={50} />
            <Skeleton variant="rect" style={styles.row} height={50} />
            <Skeleton variant="rect" style={styles.row} height={50} />
            <Skeleton variant="rect" style={styles.row} height={50} />
          </div>
        ) : (
          <div>
            <Fab
              size="small"
              color="secondary"
              style={styles.fab}
              onClick={this.handleNewProduct}
            >
              <ContentAdd />
            </Fab>
            <Fab
              size="small"
              style={styles.fabSearch}
              onClick={this.handleToggle}
            >
              <Search />
            </Fab>
            <Snackbar
              open={this.state.snackbarOpen}
              autoHideDuration={this.state.autoHideDuration}
              onClose={this.onSnackBarClose}
            >
              <Alert onClose={this.onSnackBarClose} severity="success">
                Operation is done successfully!
              </Alert>
            </Snackbar>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={styles.columns.width10}>Product</TableCell>
                  <TableCell style={styles.columns.width10}>Category</TableCell>
                  <TableCell style={styles.columns.width10}>Price</TableCell>
                  <TableCell style={styles.columns.width10}>Quantity</TableCell>
                  <TableCell style={styles.columns.width10}>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell style={styles.columns.width10}>
                      {item.productName}
                    </TableCell>
                    <TableCell style={styles.columns.width10}>
                      {item.category ? item.category.categoryName : ""}
                    </TableCell>
                    <TableCell style={styles.columns.width10}>
                      AUD ${item.unitPrice}
                    </TableCell>
                    <TableCell style={styles.columns.width10}>
                      {item.unitInStock}
                    </TableCell>
                    <TableCell style={styles.columns.width10}>
                      <Fab
                        size="small"
                        style={styles.editButton}
                        href={`product/${item.id}`}
                      >
                        <ContentCreate />
                      </Fab>
                      <Fab
                        size="small"
                        style={styles.deleteButton}
                        onClick={() => this.onDelete(item.id)}
                      >
                        <ActionDelete />
                      </Fab>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Container style={styles.pagination}>
              <Pagination
                size="small"
                count={this.state.totalPages}
                page={this.state.page}
                variant="outlined"
                color="primary"
                onChange={this.onPageChange}
              />
            </Container>
            <Dialog
              key="alert-dialog"
              title="Confirm Dialog "
              style={styles.dialog}
              open={this.state.open}
              onClick={() => this.handleClose(false)}
            >
              <DialogTitle key="alert-dialog-title">{"Alert"}</DialogTitle>

              <DialogContent key="alert-dialog-content">
                <DialogContentText key="alert-dialog-description">
                  {this.state.dialogText}
                </DialogContentText>
              </DialogContent>

              <DialogActions key="alert-dialog-action">
                {dialogButtons}
              </DialogActions>
            </Dialog>
            <Drawer
              anchor="right"
              open={this.state.searchOpen}
              onClose={this.handleToggle}
            >
              {/*<AppBar title="AppBar" />*/}
              {/* <Button variant="contained"
              label="Search"
              style={styles.saveButton}
              type="button"
              onClick={this.handleSearch}
              secondary={true}
            /> */}
              <Button
                variant="contained"
                onClick={this.handleSearch}
                color="secondary"
              >
                Search
              </Button>

              <TextField
                placeholder="Product"
                label="Product"
                name="product"
                fullWidth={true}
                value={this.state.search.product}
                onChange={this.handleSearchFilter}
              />
            </Drawer>
          </div>
        )}
      </PageBase>
    );
  }
}

function mapStateToProps(state) {
  const {
    productList,
    deleteSuccess,
    isFetching,
    isAuthenticated,
    errorMessage,
    user,
  } = state.product;

  return {
    productList,
    isFetching,
    isAuthenticated,
    errorMessage,
    deleteSuccess,
    user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchProduct: (action) => dispatch(thunkApiCall(action)),
    getAllProducts: (action) => dispatch(thunkApiCall(action)),
    deleteProduct: (action) => dispatch(thunkApiCall(action)),
    newProduct: (action) => dispatch(thunkApiCall(action)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage);