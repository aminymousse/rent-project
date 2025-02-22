import { Component } from "react"
import { withRouter } from "react-router"
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Search } from "@mui/icons-material"
import toastr from "toastr"

import { UserConsumer } from "../../context/UserContext"
import Sale from "./Sale"
import { saleService } from "../../services"
import withPaging from "../hoc/withPaging"
import Paginator from "../common/tools/Paginator"
import withSearch from "../hoc/withSearch"

class SalesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      error: false,
      loading: true,
      searchLoading: false,
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.paging.page !== prevProps.paging.page) {
      this.fetchData()
    }
  }

  onSearchSubmit = (e) => {
    e.preventDefault()
    this.setState({ searchLoading: true })
    this.fetchData()
  }

  fetchData = async () => {
    try {
      const res = await saleService.getSalesByUsername(
        "?page=" + this.props.paging.page,
        this.props.user.username,
        "&query=" + this.props.searchString,
      )

      if (res.success === false) {
        toastr.error(res.message)
        this.props.history.push("/")
      } else {
        this.props.updatePages(res.totalPages)
        this.setState({
          data: res.content,
          error: false,
        })
      }
    } catch (err) {
      console.error(err)
      this.setState({ error: true })
      toastr.error("Failed to fetch sales data")
    } finally {
      this.setState({
        loading: false,
        searchLoading: false,
      })
    }
  }

  render() {
    const { data, loading, error, searchLoading } = this.state

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Purchase History
          </Typography>

          {/* Search Input */}
          <Box component="form" onSubmit={this.onSearchSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search purchases..."
              onChange={this.props.onSearchChange}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" type="submit" disabled={loading || searchLoading}>
                      {searchLoading ? <CircularProgress size={24} /> : <Search />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => this.setState({ error: false })}>
              Failed to load purchase history. Please try again.
            </Alert>
          )}

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 3,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rent #</TableCell>
                      <TableCell>Issue Date</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.length > 0 ? (
                      data.map((sale) => <Sale key={sale.id} sale={sale} />)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">No purchases found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3 }}>
                <Paginator
                  nextPage={this.props.nextPage}
                  prevPage={this.props.prevPage}
                  totalPages={this.props.paging.totalPages}
                  page={this.props.paging.page + 1}
                  pageChange={this.props.pageChange}
                />
              </Box>
            </>
          )}
        </Paper>
      </Container>
    )
  }
}

const SalesListWithContext = (props) => {
  return <UserConsumer>{({ user }) => <SalesList {...props} user={user} />}</UserConsumer>
}

export default withRouter(withPaging(withSearch(SalesListWithContext)))

