import { Component } from "react";
import { Redirect, withRouter } from "react-router";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Divider,
  Alert,
  Paper,
} from "@mui/material";
import { ShoppingCart, Cancel, CheckCircle } from "@mui/icons-material";
import toastr from "toastr";

import { carService } from "../../../services";
import CarInformation from "./CarInformation";
import { UserConsumer } from "../../../context/UserContext";

class PurchaseCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      loading: false,
      error: null,
      id: "",
      brand: "",
      model: "",
      power: "",
      color: "",
      description: "",
      imageUrl: "",
      litersPerHundredKilometers: "",
      price: "",
      initialLoading: true,
    };
  }

  onClick = async () => {
    const { username } = this.props.user;

    this.setState({ loading: true, error: null });

    try {
      const response = await carService.purchaseCar(this.state.id, username);
      if (response.success) {
        toastr.success("Car purchased successfully!");
        this.setState({ submitted: true });
      } else {
        this.setState({
          error: response.message || "Failed to purchase the car",
          loading: false,
        });
        toastr.error(response.message || "Failed to purchase the car");
      }
    } catch (error) {
      console.error(error);
      this.setState({
        error: "An error occurred while processing your purchase",
        loading: false,
      });
      toastr.error("Failed to process purchase");
    }
  };

  async componentDidMount() {
    const id = this.props.match.params.id;

    try {
      const res = await carService.getCarById(id);
      if (res.success === false) {
        toastr.error(res.message);
        this.props.history.push("/cars/all");
      } else {
        this.setState({
          ...res,
          initialLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      toastr.error("Failed to load car details");
      this.props.history.push("/cars/all");
    }
  }

  render() {
    const { submitted, loading, error, initialLoading } = this.state;

    if (submitted) {
      return <Redirect to="/cars/all" />;
    }

    if (initialLoading) {
      return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      );
    }

    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              textAlign: "center",
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <ShoppingCart /> Purchase Vehicle
          </Typography>

          <Box sx={{ mb: 4 }}>
            <CarInformation data={this.state} />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ maxWidth: "sm", mx: "auto" }}>
            <Alert severity="info" icon={<CheckCircle />} sx={{ mb: 3 }}>
              You are about to purchase this vehicle for ${this.state.price}
            </Alert>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => this.setState({ error: null })}
              >
                {error}
              </Alert>
            )}

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={this.onClick}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <ShoppingCart />
                }
                sx={{ minWidth: 200 }}
              >
                {loading ? "Processing..." : "Confirm Purchase"}
              </Button>

              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={() => this.props.history.push("/cars/all")}
                startIcon={<Cancel />}
                sx={{ minWidth: 200 }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    );
  }
}

const PurchaseCarWithContext = (props) => {
  return (
    <UserConsumer>
      {({ user }) => <PurchaseCar {...props} user={user} />}
    </UserConsumer>
  );
};

export default withRouter(PurchaseCarWithContext);
