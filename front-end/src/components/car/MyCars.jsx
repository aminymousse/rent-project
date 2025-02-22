"use client"

import { useState, useEffect } from "react"
import { Container, Typography, Paper, Grid, Box, CircularProgress, Alert } from "@mui/material"
import { BarcodeIcon as Garage } from "lucide-react"
import { UserConsumer } from "../../context/UserContext"
import CarCard from "./CarCard"
import { carService } from "../../services"
import toastr from "toastr"

const MyCars = ({ user }) => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMyCars = async () => {
      try {
        const response = await carService.getMyPurchasedCars(user.username)
        if (response.success === false) {
          setError(response.message)
          toastr.error(response.message)
        } else {
          setCars(response.content)
        }
      } catch (error) {
        console.error(error)
        setError("Failed to load your cars")
        toastr.error("An error occurred while loading your cars")
      } finally {
        setLoading(false)
      }
    }

    fetchMyCars()
  }, [user.username])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Garage />
          My Cars
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {cars.length > 0 ? (
            cars.map((car) => (
              <Grid item xs={12} key={car.id}>
                <CarCard car={car} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">You haven't purchased any cars yet.</Alert>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  )
}

const MyCarsWithContext = (props) => {
  return <UserConsumer>{({ user }) => <MyCars {...props} user={user} />}</UserConsumer>
}

export default MyCarsWithContext

