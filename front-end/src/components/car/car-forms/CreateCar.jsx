import { Component } from "react";
import toastr from "toastr";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import { Save, Cancel, DirectionsCar } from "@mui/icons-material";

import { carService } from "../../../services";
import { createCarValidation } from "../../../util/validation/formValidator";
import { createCarHandler } from "../../../util/validation/formErrorHandler";

class CreateCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: "",
      model: "",
      count: "",
      seats: "",
      year: "",
      trunkCapacity: "",
      description: "",
      imageUrl: "",
      litersPerHundredKilometers: "",
      pricePerDay: "",
      forSale: false,
      price: "",
      loading: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onCheckboxChange(e) {
    const { name, checked } = e.target;
    this.setState({
      [name]: checked,
      // Clear the irrelevant price field when switching
      pricePerDay: checked ? null : this.state.pricePerDay,
      price: checked ? this.state.price : null,
    });
  }

  onSubmit(e) {
    e.preventDefault();
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
    } = this.state;

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
        forSale ? null : pricePerDay,
        forSale,
        forSale ? price : null
      )
    ) {
      return;
    }

    this.setState({ loading: true });

    // Parse all number values before sending
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
      pricePerDay: forSale ? null : Number.parseFloat(pricePerDay),
      forSale,
      price: forSale ? Number.parseFloat(price) : null,
    };

    carService
      .createCar(carData)
      .then((res) => {
        if (res.success === false) {
          toastr.error(res.message);
          this.props.history.push("/cars/all");
        } else {
          toastr.success("Successful creation");
          this.props.history.push("/cars/all");
        }
      })
      .catch((e) => {
        console.log(e);
        toastr.error("An error occurred while creating the car");
      })
      .finally(() => {
        this.setState({ loading: false });
      });
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
    } = this.state;

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
      price
    );

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <DirectionsCar /> Add New Car
            </Typography>
          </Box>

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
                  helperText={
                    !validation.validBrand && "Please enter a valid brand name"
                  }
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
                  helperText={
                    !validation.validModel && "Please enter a valid model name"
                  }
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
                  helperText={
                    !validation.validCount && "Please enter a valid count"
                  }
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
                  helperText={
                    !validation.validSeats &&
                    "Please enter a valid number of seats"
                  }
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
                  helperText={
                    !validation.validYear && "Please enter a valid year"
                  }
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
                  helperText={
                    !validation.validImage && "Please enter a valid image URL"
                  }
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
                  helperText={
                    !validation.validTrunkCapacity &&
                    "Please enter a valid trunk capacity"
                  }
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
                  helperText={
                    !validation.validFuelExpense &&
                    "Please enter a valid fuel consumption"
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={forSale}
                      onChange={this.onCheckboxChange}
                      name="forSale"
                    />
                  }
                  label="For Sale"
                />
              </Grid>
              {!forSale ? (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Price per Day"
                    name="pricePerDay"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={pricePerDay || ""}
                    onChange={this.onChange}
                    error={!validation.validPrice}
                    helperText={
                      !validation.validPrice &&
                      "Please enter a valid daily price"
                    }
                  />
                </Grid>
              ) : (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Sale Price"
                    name="price"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={price || ""}
                    onChange={this.onChange}
                    error={!validation.validSalePrice}
                    helperText={
                      !validation.validSalePrice &&
                      "Please enter a valid sale price"
                    }
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
                  helperText={
                    !validation.validDescription &&
                    "Please enter a valid description"
                  }
                />
              </Grid>
            </Grid>

            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              >
                {loading ? "Creating..." : "Create Car"}
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
    );
  }
}

export default withRouter(CreateCar);
