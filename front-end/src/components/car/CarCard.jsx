"use client";

import React from "react";
import { Link, withRouter } from "react-router-dom";
import { UserConsumer } from "../../context/UserContext";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  DirectionsCar,
  Edit,
  Delete,
  Info,
  ShoppingCart,
  LocalGasStation,
  EventSeat,
  Weekend,
  AttachMoney,
  Warning,
} from "@mui/icons-material";
import toastr from "toastr";
import { carService } from "../../services";

const CarCard = ({ car, user, location, history, ...props }) => {
  const [purchaseDialogOpen, setPurchaseDialogOpen] = React.useState(false);
  const [purchasing, setPurchasing] = React.useState(false);

  const handlePurchaseClick = () => {
    setPurchaseDialogOpen(true);
  };

  const handlePurchaseConfirm = async () => {
    setPurchasing(true);
    try {
      const response = await carService.purchaseCar(car.id, user.username);
      if (response.success) {
        toastr.success("Car purchased successfully!");
        history.push("/sales/all/" + user.username);
      } else {
        toastr.error(response.message || "Failed to purchase car");
      }
    } catch (error) {
      toastr.error("An error occurred while purchasing the car");
      console.error(error);
    } finally {
      setPurchasing(false);
      setPurchaseDialogOpen(false);
    }
  };

  const onPurchaseClick = () => {
    history.push(`/cars/purchase/${car.id}`);
  };

  return (
    <>
      <Card elevation={3} sx={{ mb: 3, bgcolor: "background.paper" }}>
        <Grid container>
          {/* Car Image */}
          <Grid item xs={12} md={3}>
            <CardMedia
              component="img"
              sx={{
                height: "100%",
                objectFit: "cover",
                p: 2,
                borderRadius: 2,
              }}
              image={car.imageUrl}
              alt={`${car.brand} ${car.model}`}
            />
          </Grid>

          {/* Car Details */}
          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {car.brand} {car.model}
              </Typography>

              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DirectionsCar />
                        <Typography variant="subtitle2">Brand</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{car.brand}</TableCell>
                    {!car.forSale && !car.owner && (
                      <>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AttachMoney />
                            <Typography variant="subtitle2">
                              Price/Day
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>${car.pricePerDay}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EventSeat />
                        <Typography variant="subtitle2">Seats</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{car.seats}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DirectionsCar />
                        <Typography variant="subtitle2">Model</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Weekend />
                        <Typography variant="subtitle2">Luggage</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{car.trunkCapacity} l</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocalGasStation />
                        <Typography variant="subtitle2">Consumption</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{car.litersPerHundredKilometers} l/km</TableCell>
                  </TableRow>

                  {car.forSale ||
                    (car.owner && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Chip
                              icon={<AttachMoney />}
                              label={`Sale Price: $${car.price}`}
                              color="success"
                              variant="outlined"
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}

              
                </TableBody>
              </Table>
            </CardContent>
          </Grid>
          {car.owner ? (
            <Grid item xs={12} md={2}>
              <Box
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <Typography
                    variant="h6"
                    color="error"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ShoppingCart />
                    Sold
                  </Typography>
                  <Button
                    component={Link}
                    to={`/cars/details/${car.id}`}
                    variant="outlined"
                    startIcon={<Info />}
                    fullWidth
                  >
                    Details
                  </Button>
                </Stack>
              </Box>
            </Grid>
          ) : (
            <Grid item xs={12} md={2}>
              <Box
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Stack spacing={2}>
                  <Button
                    component={Link}
                    to={`/cars/details/${car.id}`}
                    variant="outlined"
                    startIcon={<Info />}
                    fullWidth
                  >
                    Details
                  </Button>

                  {user.role === "USER" &&
                    location?.pathname === "/cars/available" && (
                      <>
                        <Button
                          component={Link}
                          to={`/cars/reserve/${car.id}`}
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          fullWidth
                        >
                          Reserve
                        </Button>
                      </>
                    )}

                  {user.role === "ADMIN" && (
                    <>
                      <Button
                        component={Link}
                        to={`/cars/edit/${car.id}`}
                        variant="outlined"
                        color="warning"
                        startIcon={<Edit />}
                        fullWidth
                      >
                        Edit
                      </Button>
                      <Button
                        component={Link}
                        to={`/cars/delete/${car.id}`}
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        fullWidth
                      >
                        Delete
                      </Button>
                    </>
                  )}

                  {user.role === "USER" && car.forSale && (
                    <Button
                      onClick={onPurchaseClick}
                      variant="contained"
                      color="success"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Buy
                    </Button>
                  )}
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      </Card>

      <Dialog
        open={purchaseDialogOpen}
        onClose={() => setPurchaseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning color="warning" />
            Confirm Purchase
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to purchase this {car.brand} {car.model} for $
            {car.price}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPurchaseDialogOpen(false)}
            color="inherit"
            disabled={purchasing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchaseConfirm}
            color="success"
            variant="contained"
            disabled={purchasing}
            startIcon={
              purchasing ? <CircularProgress size={20} /> : <ShoppingCart />
            }
          >
            {purchasing ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const CarCardWithContext = (props) => {
  return (
    <UserConsumer>
      {({ user }) => <CarCard {...props} user={user} />}
    </UserConsumer>
  );
};

export default withRouter(CarCardWithContext);
