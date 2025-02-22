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
} from "@mui/icons-material";

const CarCard = (props) => {
  const { user, car, location } = props;
  const onReserveClick = () => {
    const { startDate, endDate } = this.state;
    this.props.updateDates({ startDate, endDate });
    this.props.history.push("/cars/reserve/" + this.props.id);
  };

  return (
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCar />
                      <Typography variant="subtitle2">Brand</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{car.brand}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoney />
                      <Typography variant="subtitle2">Price/Day</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>${car.pricePerDay}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EventSeat />
                      <Typography variant="subtitle2">Seats</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{car.seats}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCar />
                      <Typography variant="subtitle2">Model</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Weekend />
                      <Typography variant="subtitle2">Luggage</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{car.trunkCapacity} l</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalGasStation />
                      <Typography variant="subtitle2">Consumption</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{car.litersPerHundredKilometers} l/km</TableCell>
                </TableRow>

                {car.forSale && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Grid>

        {/* Actions */}
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
                location.pathname === "/cars/available" && (
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
                    <Button
                      // component={Link}
                      onClick={onReserveClick}
                      variant="contained"
                      color="success"
                      startIcon={<ShoppingCart />}
                      fullWidth
                    >
                      Buy
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
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

const CarCardWithContext = (props) => {
  return (
    <UserConsumer>
      {({ user }) => <CarCard {...props} user={user} car={props.car} />}
    </UserConsumer>
  );
};

export default withRouter(CarCardWithContext);
