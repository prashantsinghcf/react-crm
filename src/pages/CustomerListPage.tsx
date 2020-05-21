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
import CheckCircle from "@material-ui/icons/CheckCircle";
import Cancel from "@material-ui/icons/Cancel";
import PageBase from "../components/PageBase";
// import AppBar from "@material-ui/core/AppBar";
import { connect } from "react-redux";
import { getAction } from "../actions/customer";
import Dialog from "@material-ui/core/Dialog";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import { teal, pink, grey, green, common } from "@material-ui/core/colors";
import { thunkApiCall } from "../services/thunks";
import { LIST_CUSTOMER, DELETE_CUSTOMER, NEW_CUSTOMER } from "../store/types";
import { Customer } from "../types";
import {
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TableFooter,
  Divider,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "../components/Alert";

const teal500 = teal["500"];
const pink500 = pink["500"];
const grey500 = grey["500"];
const green400 = green["400"];
const white = common.white;

const styles = {
  fab: {
    top: "auto" as TODO,
    right: 20,
    bottom: 20,
    left: "auto" as TODO,
    position: "fixed" as TODO,
    marginRight: 20,
    backgroundColor: pink500, // {pink500}
  },
  fabSearch: {
    top: "auto" as TODO,
    right: 100,
    bottom: 20,
    left: "auto" as TODO,
    position: "fixed" as TODO,
    marginRight: 20,
    backgroundColor: "lightblue" as TODO,

  },
  searchButton:{
    marginRight:20,
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
    width: "100%",
    maxWidth: "none",
    margin: "auto",
    position: "fixed" as TODO,
    padding: "0px",
  },
  drawer: {
    backgroundColor: "lightgrey",
  },
  searchDrawer: {
    width: "250px",
    // backgroundColor: "lightgrey",
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

interface CustomerListProps {
  pageCount: number;
  isFetching: boolean;
  customerList: Customer[];
  searchCustomer: typeof thunkApiCall;
  deleteCustomer: typeof thunkApiCall;
  newCustomer: typeof thunkApiCall;
  deleteSuccess: boolean;
  errorMessage: string;
  deleted: boolean;
}

interface CustomerListState {
  open: boolean;
  isFetching: boolean;
  searchOpen: boolean;
  snackbarOpen: boolean;
  autoHideDuration: number;
  page: number;
  items: Customer[];
  customerList: Customer[];
  totalPages: number;
  customerId: null;
  dialogText: string; //'Are you sure to do this?',
  search: {
    firstname: string;
    lastname: string;
  };
}

class CustomerListPage extends React.Component<
  CustomerListProps,
  CustomerListState
> {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onSnackBarClose = this.onSnackBarClose.bind(this);
    this.handleNewCustomer = this.handleNewCustomer.bind(this);
  }

  state: CustomerListState = {
    isFetching: true,
    open: false,
    searchOpen: false,
    snackbarOpen: false,
    autoHideDuration: 2000,
    page: 1,
    items: [],
    totalPages: 1,
    customerId: null,
    customerList: [],
    dialogText: "Are you sure to do this?",
    search: {
      firstname: "",
      lastname: "",
    },
  };

  componentDidMount() {
    // this.props.searchCustomer(this.apiAction);
    this.handleSearch();
  }

  /* eslint-disable */
  componentDidUpdate(prevProps) {
    // reset page if items array has changed
    if (this.props.customerList !== prevProps.customerList) {
      this.setState({ customerList: this.props.customerList });
      const page = 1;
      const totalPages = Math.ceil(this.props.customerList.length / 10);
      const items = this.props.customerList.slice(0, 10);
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
    const items = this.props.customerList.slice(startIndex, endIndex);
    this.setState({ page, items });
  }

  onDelete(id) {
    if (id) {
      this.handleOpen(id);
    }
  }

  handleToggle() {
    this.setState({ searchOpen: !this.state.searchOpen } as TODO);
  }

  handleSearch() {
    this.setState({ searchOpen: false, isFetching: true });
    const action = getAction(LIST_CUSTOMER, null, null, "");
    this.props.searchCustomer(action); //this.state.search);
  }

  handleOpen(id) {
    this.setState({ dialogText: "Are you sure to delete this data?" });
    this.setState({ open: true });
    this.setState({ customerId: id });
  }

  handleClose(isConfirmed: boolean) {
    this.setState({ open: false });

    if (isConfirmed && this.state.customerId) {
      const action = getAction(
        DELETE_CUSTOMER,
        this.state.customerId,
        null,
        ""
      );
      this.props.deleteCustomer(action);
      // this.props.deleteCustomer(this.state.customerId);
      this.setState({ customerId: null });
    }
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

  onSnackBarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  handleNewCustomer() {
    const action = getAction(NEW_CUSTOMER);
    this.props.newCustomer(action);
    // @ts-ignore
    this.props.history.push("/newcustomer");
  }

  render() {
    const { customerList } = this.props;
    const { isFetching } = this.state;

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
        title={"Customers (" + customerList.length + ")"}
        navigation="React CRM / Customer"
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
            <div>
              <Fab
                size="small"
                color="secondary"
                style={styles.fab}
                onClick={this.handleNewCustomer}
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
            </div>
            {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}

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
                  <TableCell component="th" style={styles.columns.width10} />
                  <TableCell style={styles.columns.width10}>
                    First Name
                  </TableCell>
                  <TableCell style={styles.columns.width10}>
                    Last Name
                  </TableCell>
                  <TableCell style={styles.columns.width10}>Email</TableCell>
                  <TableCell style={styles.columns.width10}>Mobile</TableCell>
                  <TableCell style={styles.columns.width10}>Rewards</TableCell>
                  <TableCell style={styles.columns.width10}>
                    Membership
                  </TableCell>
                  <TableCell style={styles.columns.width10}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.items.length > 0 &&
                  this.state.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell style={styles.columns.width10}>
                        <img width={35} src={item.avatar} />
                      </TableCell>
                      <TableCell style={styles.columns.width10}>
                        {item.firstname}
                      </TableCell>
                      <TableCell style={styles.columns.width10}>
                        {item.lastname}
                      </TableCell>
                      <TableCell style={styles.columns.width10}>
                        {item.email}
                      </TableCell>
                      <TableCell style={styles.columns.width10}>
                        {item.mobile}
                      </TableCell>
                      <TableCell style={styles.columns.width10}>
                        {item.rewards}
                      </TableCell>
                      <TableCell style={styles.columns.width10}>
                        {item.membership ? <CheckCircle /> : <Cancel />}
                      </TableCell>
                      <TableCell style={styles.columns.width10}>
                        <Fab
                          size="small"
                          style={styles.editButton}
                          href={`customer/${item.id}`}
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
            <React.Fragment>
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
            </React.Fragment>
            <React.Fragment>
              <Drawer
                anchor="right"
                open={this.state.searchOpen}
                onClose={this.handleToggle}
              >
            
                <Grid container style={styles.searchDrawer} spacing={1}>
                  <Grid item xs={12}>
                 <h5>Search</h5> 
                {/* </AppBar> */}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      placeholder="First Name"
                      label="First Name"
                      name="firstname"
                      fullWidth={true}
                      value={this.state.search.firstname}
                      onChange={this.handleSearchFilter}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      placeholder="Last Name"
                      label="Last Name"
                      fullWidth={true}
                      name="lastname"
                      value={this.state.search.lastname}
                      onChange={this.handleSearchFilter}
                    />
                  </Grid>
                  <Divider />
                  <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={this.handleSearch}
                    color="secondary"
                   style={styles.searchButton}
                  >
                    Search
                  </Button>
                  <Button
                    variant="contained"
                    onClick={this.handleSearch}
                    color="default"
                  >
                    Cancel
                  </Button>
                  </Grid>
                </Grid>
              </Drawer>
            </React.Fragment>
          </div>
        )}
      </PageBase>
    );
  }
}

function mapStateToProps(state) {
  const {
    customerList,
    isFetching,
    errorMessage,
    user,
    deleted,
  } = state.customer;

  return {
    customerList,
    isFetching,
    errorMessage,
    user,
    deleted,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchCustomer: (action?: TODO) => dispatch(thunkApiCall(action)),
    deleteCustomer: (action: TODO) => dispatch(thunkApiCall(action)),
    newCustomer: (action?: TODO) => dispatch(thunkApiCall(action)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerListPage);