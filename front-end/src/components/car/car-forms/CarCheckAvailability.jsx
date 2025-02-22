import React, { Component } from "react";
import { withRouter } from "react-router";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  CalendarMonth,
  CheckCircle,
  ShoppingCart,
  Store,
} from "@mui/icons-material";
import toastr from "toastr";

import { carService } from "../../../services";
import { DatesConsumer } from "../../../context/DatesContext";
import { dateValidation } from "../../../util/validation/formValidator";
import util from "../../../util/util";
import { dateHandler } from "../../../util/validation/formErrorHandler";

class CarCheckAvailability extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: util.getCurrentDate(),
      endDate: util.getCurrentDate(),
      submitted: false,
      available: false,
      loading: false,
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onReserveClick = () => {
    const { startDate, endDate } = this.state;
    this.props.updateDates({ startDate, endDate });
    this.props.history.push("/cars/reserve/" + this.props.id);
  };

  onBuyClick = () => {
    // Implementation for buy functionality
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { startDate, endDate } = this.state;

    if (!dateHandler(startDate, endDate)) {
      return;
    }

    this.setState({ loading: true });

    carService
      .checkAvailability(this.props.id, startDate, endDate)
      .then((res) => {
        if (res.success === false) {
          toastr.error(res.message);
        } else {
          this.setState({
            available: res,
            submitted: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        toastr.error("An error occurred while checking availability");
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { startDate, endDate, submitted, available, loading } = this.state;
    const validation = dateValidation(startDate, endDate);

    return (
      <Box sx={{ mt: 5, width: "100%", maxWidth: 300, mx: "auto" }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom align="center">
            Check Availability
          </Typography>

          <form onSubmit={this.onSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={startDate}
                onChange={this.onChange}
                error={!validation.validStartDate}
                helperText={
                  !validation.validStartDate &&
                  "Please select a valid start date"
                }
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <CalendarMonth sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />

              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={endDate}
                onChange={this.onChange}
                error={!validation.validEndDate}
                helperText={
                  !validation.validEndDate && "Please select a valid end date"
                }
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <CalendarMonth sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <CheckCircle />
                }
              >
                {loading ? "Checking..." : "Check Availability"}
              </Button>
            </Stack>
          </form>

          {submitted && (
            <Box sx={{ mt: 3 }}>
              {available ? (
                <Stack spacing={2}>
                  <Alert
                    icon={<CheckCircle fontSize="inherit" />}
                    severity="success"
                  >
                    Vehicle is available for the selected dates!
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={this.onReserveClick}
                    startIcon={<ShoppingCart />}
                  >
                    Reserve Now
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={this.onBuyClick}
                    startIcon={<Store />}
                  >
                    Buy Now
                  </Button>
                </Stack>
              ) : (
                <Alert severity="error">
                  Sorry, this vehicle is not available for the selected dates.
                </Alert>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    );
  }
}

const CarCheckFormWithContext = (props) => {
  return (
    <DatesConsumer>
      {({ dates, updateDates }) => (
        <CarCheckAvailability
          {...props}
          dates={dates}
          updateDates={updateDates}
        />
      )}
    </DatesConsumer>
  );
};

export default withRouter(CarCheckFormWithContext);
