import { Component } from "react"
import { withRouter } from "react-router"
import toastr from "toastr"
import { Link } from "react-router-dom"
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Save, Cancel, Edit } from "@mui/icons-material"

import { carService } from "../../../services"
import { createCarValidation } from "../../../util/validation/formValidator"
import { createCarHandler } from "../../../util/validation/formErrorHandler"

class CarEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: "",
      brand: "",
      model: "",
      count: "",
      seats: "",
      year: "",
      description: "",
      imageUrl: "",
      litersPerHundredKilometers: "",
      pricePerDay: "",
      trunkCapacity: "",
      forSale: false,
      price: "",
      loading: false,
      error: null,
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: null,
    })
  }

  onCheckboxChange(e) {
    this.setState({
      [e.target.name]: e.target.checked,
    })
  }

  componentDidMount() {
    const id = this.props.match.params.id

    carService
      .getCarById(id)
      .then((res) => {
        if (res.success === false) {
          toastr.error(res.message)
          this.props.history.push("/cars/all")
        } else {
          this.setState({
            ...res,
            forSale: !!res.price,
            price: res.price || "",
          })
        }
      })
      .catch((e) => {
        console.log(e)
        toastr.error("Failed to load car details")
      })
  }

  onSubmit(e) {
    e.preventDefault()

    const {
      brand,
      model,
      year,
      seats,
      count,
      trunkCapacity,
      description,
      imageUrl,
      litersPerHundredKilometers,
      pricePerDay,
      forSale,
      price,
    } = this.state

    if (
      !createCarHandler(
        brand,
        model,
        count,
        seats,
        year,
        litersPerHundredKilometers,
        description,
        imageUrl,
        trunkCapacity,
        pricePerDay,
        forSale,
        price,
      )
    ) {
      return
    }

    this.setState({ loading: true, error: null })

    const carData = {
      brand,
      model,
      count: count.toString(),
      seats: seats.toString(),
      year: year.toString(),
      trunkCapacity: trunkCapacity.toString(),
      description,
      imageUrl,
      litersPerHundredKilometers: litersPerHundredKilometers.toString(),
      pricePerDay: forSale ? null : Number(pricePerDay),
      forSale,
      price: forSale ? Number(price) : null,
    }

    carService
      .editCar(this.state.id, carData)
      .then((res) => {
        if (res.success === false) {
          this.setState({ error: res.message })
          toastr.error(res.message)
        } else {
          toastr.success("Successful edit")
          this.props.history.push("/cars/all")
        }
      })
      .catch((e) => {
        console.log(e)
        this.setState({ error: "An error occurred while editing the car" })
        toastr.error("An error occurred while editing the car")
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  render() {
    const {
      brand,
      model,
      year,
      seats,
      count,
      trunkCapacity,
      description,
      imageUrl,
      litersPerHundredKilometers,
      pricePerDay,
      forSale,
      price,
      loading,
      error,
    } = this.state

    const validation = createCarValidation(
      brand,
      model,
      count,
      seats,
      year,
      litersPerHundredKilometers,
      description,
      imageUrl,
      trunkCapacity,
      pricePerDay,
      forSale,
      price,
    )

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}
            >
              <Edit /> Edit Car
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => this.setState({ error: null })}>
              {error}
            </Alert>
          )}

          <form onSubmit={this.onSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={brand}
                  onChange={this.onChange}
                  error={!validation.validBrand}
                  helperText={!validation.validBrand && "Please enter a valid brand name"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Model"
                  name="model"
                  value={model}
                  onChange={this.onChange}
                  error={!validation.validModel}
                  helperText={!validation.validModel && "Please enter a valid model name"}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Count"
                  name="count"
                  type="number"
                  value={count}
                  onChange={this.onChange}
                  error={!validation.validCount}
                  helperText={!validation.validCount && "Please enter a valid count"}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Seats"
                  name="seats"
                  type="number"
                  value={seats}
                  onChange={this.onChange}
                  error={!validation.validSeats}
                  helperText={!validation.validSeats && "Please enter a valid number of seats"}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Year"
                  name="year"
                  type="number"
                  value={year}
                  onChange={this.onChange}
                  error={!validation.validYear}
                  helperText={!validation.validYear && "Please enter a valid year"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={this.onChange}
                  error={!validation.validImage}
                  helperText={!validation.validImage && "Please enter a valid image URL"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Trunk Capacity (L)"
                  name="trunkCapacity"
                  type="number"
                  value={trunkCapacity}
                  onChange={this.onChange}
                  error={!validation.validTrunkCapacity}
                  helperText={!validation.validTrunkCapacity && "Please enter a valid trunk capacity"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fuel Consumption (L/100km)"
                  name="litersPerHundredKilometers"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={litersPerHundredKilometers}
                  onChange={this.onChange}
                  error={!validation.validFuelExpense}
                  helperText={!validation.validFuelExpense && "Please enter a valid fuel consumption"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Switch checked={forSale} onChange={this.onCheckboxChange} name="forSale" />}
                  label="For Sale"
                />
              </Grid>
              {!forSale ? (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price per Day"
                    name="pricePerDay"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={pricePerDay}
                    onChange={this.onChange}
                    error={!validation.validPrice}
                    helperText={!validation.validPrice && "Please enter a valid daily price"}
                  />
                </Grid>
              ) : (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sale Price"
                    name="price"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={price}
                    onChange={this.onChange}
                    error={!validation.validSalePrice}
                    helperText={!validation.validSalePrice && "Please enter a valid sale price"}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={description}
                  onChange={this.onChange}
                  error={!validation.validDescription}
                  helperText={!validation.validDescription && "Please enter a valid description"}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              >
                {loading ? "Updating..." : "Update Car"}
              </Button>
              <Button
                component={Link}
                to="/cars/all"
                variant="outlined"
                color="error"
                size="large"
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    )
  }
}

export default withRouter(CarEdit)

