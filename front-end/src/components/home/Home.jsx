import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Grid,
} from "@mui/material";
import {
  DirectionsCar,
  TimeToLeave,
  Schedule,
  Speed,
  Security,
  LocalOffer,
} from "@mui/icons-material";
import { UserConsumer } from "../../context/UserContext";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: (theme) => theme.shadows[4],
      },
    }}
  >
    <Icon sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

const Home = ({ user }) => {
  const features = [
    {
      icon: Speed,
      title: "Quick Booking",
      description:
        "Reserve your car in minutes with our streamlined booking process",
    },
    {
      icon: Security,
      title: "Secure Rentals",
      description: "Fully insured vehicles with 24/7 roadside assistance",
    },
    {
      icon: LocalOffer,
      title: "Best Prices",
      description:
        "Competitive rates and special offers for our loyal customers",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.white", height: "100%" }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 0,
          py: { xs: 8, md: 12 },
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              maxWidth: "md",
              mx: "auto",
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "2.5rem", md: "3.75rem" },
              }}
            >
              Welcome to RentCar!
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}
            >
              Fast and easy car renting for your journey ahead
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={Link}
                to="/cars/all"
                variant="contained"
                size="large"
                startIcon={<DirectionsCar />}
                sx={{
                  bgcolor: "background.paper",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "background.paper",
                    opacity: 0.9,
                  },
                }}
              >
                View Car Fleet
              </Button>

              {user.isLoggedIn &&
                (user.role !== "ADMIN" ? (
                  <Button
                    component={Link}
                    to="/cars/available"
                    variant="outlined"
                    size="large"
                    startIcon={<TimeToLeave />}
                    sx={{
                      borderColor: "primary.contrastText",
                      color: "primary.contrastText",
                      "&:hover": {
                        borderColor: "primary.contrastText",
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    Available Cars
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    to="/rents/pending"
                    variant="outlined"
                    size="large"
                    startIcon={<Schedule />}
                    sx={{
                      borderColor: "primary.contrastText",
                      color: "primary.contrastText",
                      "&:hover": {
                        borderColor: "primary.contrastText",
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    Pending Rents
                  </Button>
                ))}
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const HomeWithUserContext = (props) => {
  return (
    <UserConsumer>{({ user }) => <Home {...props} user={user} />}</UserConsumer>
  );
};

export default HomeWithUserContext;
