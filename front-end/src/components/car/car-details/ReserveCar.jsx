import React, {Component} from 'react';
import { Redirect, withRouter } from "react-router"
import { Link } from "react-router-dom"
import { Container, Box, Button, CircularProgress, Stack, Typography, Divider, Alert } from "@mui/material"
import { Cancel, CheckCircle } from "@mui/icons-material"
import toastr from "toastr"

import { rentService, carService } from "../../../services"
import CarInformation from "./CarInformation"
import { DatesConsumer } from "../../../context/DatesContext"
import { UserConsumer } from "../../../context/UserContext"

class ReserveCar extends Component {
  constructor(props) {
    super(props)
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
      pricePerDay: "",
      initialLoading: true,
    }
  }

  onClick = async () => {
    const { startDate, endDate } = this.props.dates
    const { username } = this.props.user

    this.setState({ loading: true, error: null })

    try {
      await rentService.reserve(this.state.id, { startDate, endDate, username })
      this.setState({ submitted: true })
      toastr.success("Car reserved successfully!")
    } catch (error) {
      console.error(error)
      this.setState({
        error: "Failed to reserve the car. Please try again.",
        loading: false,
      })
      toastr.error("Failed to reserve the car")
    }
  }

  async componentDidMount() {
    const id = this.props.match.params.id

    try {
      const res = await carService.getCarById(id)
      if (res.success === false) {
        toastr.error(res.message)
        this.props.history.push("/cars/all")
      } else {
        this.setState({
          ...res,
          initialLoading: false,
        })
      }
    } catch (error) {
      console.error(error)
      toastr.error("Failed to load car details")
      this.props.history.push("/cars/all")
    }
  }

  render() {
    const { submitted, loading, error, initialLoading } = this.state

    if (submitted) {
      return <Redirect to="/cars/all" />
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
      )
    }

    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
          Reserve Vehicle
        </Typography>

        <Box sx={{ mb: 4 }}>
          <CarInformation data={this.state} />
        </Box>

        <Divider sx={{ my: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => this.setState({ error: null })}>
            {error}
          </Alert>
        )}

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={this.onClick}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{ minWidth: 150 }}
          >
            {loading ? "Reserving..." : "Confirm Reserve"}
          </Button>

          <Button
            component={Link}
            to="/cars/all"
            variant="outlined"
            color="error"
            size="large"
            startIcon={<Cancel />}
            sx={{ minWidth: 150 }}
          >
            Cancel
          </Button>
        </Stack>
      </Container>
    )
  }
}

const ReserveCarWithContext = (props) => {
  return <DatesConsumer>{({ dates }) => <ReserveCar {...props} dates={dates} />}</DatesConsumer>
}

const ReserveCarWithBothContexts = (props) => {
  return <UserConsumer>{({ user }) => <ReserveCarWithContext {...props} user={user} />}</UserConsumer>
}

export default withRouter(ReserveCarWithBothContexts)

