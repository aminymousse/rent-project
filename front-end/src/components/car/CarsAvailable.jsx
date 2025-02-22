import { Component } from "react"
import { Box, Container, TextField, Button, Typography, Grid, Paper, InputAdornment, IconButton } from "@mui/material"
import { Search, DateRange } from "@mui/icons-material"
import toastr from "toastr"

import CarCard from "./CarCard"
import { carService } from "../../services"
import Paginator from "../common/tools/Paginator"
import { DatesConsumer } from "../../context/DatesContext"
import util from "../../util/util"
import withPaging from "../hoc/withPaging"
import { dateValidation } from "../../util/validation/formValidator"
import { dateHandler } from "../../util/validation/formErrorHandler"
import withSearch from "../hoc/withSearch"

class CarsAvailable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        startDate: util.getCurrentDate(),
        endDate: util.getCurrentDate(),
      },
      data: [],
    }
  }

  onSearchSubmit = (e) => {
    e.preventDefault()
    this.fetchData()
  }

  onChange = (e) => {
    const form = { ...this.state.form }
    form[e.target.name] = e.target.value
    this.setState({ form })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { startDate, endDate } = this.state.form

    if (!dateHandler(startDate, endDate)) {
      return
    }

    this.props.updateDates({ startDate, endDate })
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.paging.page !== prevProps.paging.page) {
      this.fetchData()
    }
  }

  fetchData() {
    carService
      .findAvailableCars("?page=" + this.props.paging.page, "&query=" + this.props.searchString, this.state.form)
      .then((res) => {
        if (res.success === false) {
          toastr.error(res.message)
        } else {
          this.props.updatePages(res.totalPages)
          this.setState({ data: res.content })
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  render() {
    const { startDate, endDate } = this.state.form
    const validation = dateValidation(startDate, endDate)

    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: "background.paper" }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Available Cars
          </Typography>

          {/* Search Form */}
          <Box component="form" onSubmit={this.onSubmit} sx={{ mb: 4 }}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  name="startDate"
                  label="Start date"
                  value={startDate}
                  onChange={this.onChange}
                  required
                  error={!validation.validStartDate}
                  helperText={!validation.validStartDate && "Invalid start date"}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  name="endDate"
                  label="Date of return"
                  value={endDate}
                  onChange={this.onChange}
                  required
                  error={!validation.validEndDate}
                  helperText={!validation.validEndDate && "Invalid end date"}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth variant="contained" type="submit" size="large">
                  Find Cars
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Search Input */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search cars..."
              onChange={this.props.onSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.onSearchSubmit}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Cars Grid */}
          <Grid container spacing={3}>
            {this.state.data && this.state.data.length ? (
              this.state.data.map((car) => (
                <Grid item xs={12} md={12} key={car.id}>
                  <CarCard car={car} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" align="center" color="text.secondary">
                  No cars found
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Pagination */}
          <Box sx={{ mt: 4 }}>
            <Paginator
              nextPage={this.props.nextPage}
              prevPage={this.props.prevPage}
              totalPages={this.props.paging.totalPages}
              page={this.props.paging.page + 1}
              pageChange={this.props.pageChange}
            />
          </Box>
        </Paper>
      </Container>
    )
  }
}

const AvailableCarsWithContext = (props) => {
  return (
    <DatesConsumer>
      {({ dates, updateDates }) => <CarsAvailable {...props} dates={dates} updateDates={updateDates} />}
    </DatesConsumer>
  )
}

export default withPaging(withSearch(AvailableCarsWithContext))

