import React, { Component } from "react";
import toastr from "toastr";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import { carService } from "../../../services";
import { createCarValidation } from "../../../util/validation/formValidator";
import { createCarHandler } from "../../../util/validation/formErrorHandler";
import Input from "../../common/tools/Input";

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
    this.setState({
      [e.target.name]: e.target.checked,
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
        pricePerDay,
        forSale,
        price
      )
    ) {
      return;
    }

    const carData = {
      ...this.state,
      price: forSale ? Number.parseFloat(price) : null,
    };

    carService
      .createCar(carData)
      .then((res) => {
        if (res.success === false) {
          toastr.error(res.message);
        } else {
          toastr.success("Successful creation");
          this.props.history.push("/cars/all");
        }
      })
      .catch((e) => {
        console.log(e);
        toastr.error("An error occurred while creating the car");
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
      <div className="container">
        <div className="row space-top justify-content-center">
          <div className="col-md-4 text-center">
            <h1>Add a car</h1>
          </div>
        </div>
        <hr />
        <div className="row space-top justify-content-center">
          <div className="col-md-8">
            <form onSubmit={this.onSubmit}>
              <div className="row justify-content-around">
                <Input
                  onChange={this.onChange}
                  name="brand"
                  label="Brand"
                  type="text"
                  value={brand}
                  valid={validation.validBrand}
                />
                <Input
                  onChange={this.onChange}
                  name="model"
                  label="Model"
                  type="text"
                  value={model}
                  valid={validation.validModel}
                />
              </div>
              <div className="row justify-content-around">
                <Input
                  onChange={this.onChange}
                  name="count"
                  label="Count"
                  type="number"
                  value={count}
                  valid={validation.validCount}
                />
                <Input
                  onChange={this.onChange}
                  name="seats"
                  label="Seats"
                  type="number"
                  value={seats}
                  valid={validation.validSeats}
                />
                <Input
                  onChange={this.onChange}
                  name="year"
                  label="Year"
                  type="number"
                  value={year}
                  valid={validation.validYear}
                />
              </div>
              <div className="row justify-content-around">
                <Input
                  onChange={this.onChange}
                  name="imageUrl"
                  label="Image URL"
                  type="text"
                  value={imageUrl}
                  valid={validation.validImage}
                />
                <Input
                  onChange={this.onChange}
                  name="trunkCapacity"
                  label="Trunk Capacity"
                  type="number"
                  value={trunkCapacity}
                  valid={validation.validTrunkCapacity}
                />
              </div>
              <div className="row justify-content-around">
                <Input
                  onChange={this.onChange}
                  name="litersPerHundredKilometers"
                  label="Fuel consumption(l/100km)"
                  type="number"
                  step="0.01"
                  value={litersPerHundredKilometers}
                  valid={validation.validFuelExpense}
                />
                <Input
                  onChange={this.onChange}
                  name="pricePerDay"
                  label="Price per day"
                  type="number"
                  step="0.01"
                  value={pricePerDay}
                  valid={validation.validPrice}
                />
              </div>
              <div>
                <label htmlFor="description" className="form-control-label">
                  Description
                </label>
                <textarea
                  onChange={this.onChange}
                  className={
                    validation.validDescription
                      ? "is-valid form-control mb-3"
                      : "is-invalid form-control mb-3"
                  }
                  name="description"
                  id="description"
                  value={description}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="forSale"
                  name="forSale"
                  checked={forSale}
                  onChange={this.onCheckboxChange}
                />
                <label className="form-check-label" htmlFor="forSale">
                  For Sale
                </label>
              </div>
              {forSale && (
                <div className="row justify-content-around">
                  <Input
                    onChange={this.onChange}
                    name="price"
                    label="Sale Price"
                    type="number"
                    step="0.01"
                    value={price}
                    valid={validation.validSalePrice}
                  />
                </div>
              )}
              <hr />
              <div className="row justify-content-center my-3">
                <button
                  type="submit"
                  className="btn btn-info mx-3 text-white w-25"
                >
                  Add
                </button>
                <Link
                  to="/cars/all"
                  className="btn btn-danger mx-3 text-white w-25"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateCar);
