import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Box,
    Grid,
    Divider,
    Typography,
    Card,
    CardMedia,
  } from "@mui/material"
  import { DirectionsCar, CalendarMonth, AttachMoney } from "@mui/icons-material"
  
  import FinishRentForm from "./FinishRentForm"
  import RentAdminButtons from "./RentAdminButtons"
  import util from "../../util/util"
  
  const RentCard = (props) => {
    return (
      <Paper elevation={3} sx={{ mb: 3, overflow: "hidden" }}>
        <Grid container>
          {/* Car Image */}
          <Grid item xs={12} md={3}>
            <Card sx={{ height: "100%", border: "none", boxShadow: "none" }}>
              <CardMedia
                component="img"
                sx={{
                  height: "100%",
                  objectFit: "cover",
                  p: 2,
                  borderRadius: 2,
                }}
                image={props.data.car.imageUrl}
                alt={`${props.data.car.brand} ${props.data.car.model}`}
              />
            </Card>
          </Grid>
  
          {/* Car Details */}
          <Grid item xs={12} md={9}>
            <Box sx={{ p: 3 }}>
              <Table size="medium">
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "15%",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "none",
                      }}
                    >
                      <DirectionsCar />
                      <Typography variant="subtitle2">Brand</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "18%", border: "none" }}>{props.data.car.brand}</TableCell>
  
                    <TableCell
                      sx={{
                        width: "15%",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "none",
                      }}
                    >
                      <CalendarMonth />
                      <Typography variant="subtitle2">Start Date</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "18%", border: "none" }}>{util.formatDate(props.data.startDate)}</TableCell>
  
                    <TableCell
                      sx={{
                        width: "15%",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "none",
                      }}
                    >
                      <AttachMoney />
                      <Typography variant="subtitle2">Total Price</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "18%", border: "none" }}>
                      <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                        ${props.data.totalPrice}
                      </Typography>
                    </TableCell>
                  </TableRow>
  
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "none",
                      }}
                    >
                      <DirectionsCar />
                      <Typography variant="subtitle2">Model</Typography>
                    </TableCell>
                    <TableCell sx={{ border: "none" }}>{props.data.car.model}</TableCell>
  
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "none",
                      }}
                    >
                      <CalendarMonth />
                      <Typography variant="subtitle2">Return Date</Typography>
                    </TableCell>
                    <TableCell sx={{ border: "none" }}>{util.formatDate(props.data.endDate)}</TableCell>
  
                    <TableCell colSpan={2} sx={{ border: "none" }} />
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
  
            <Divider />
  
            <Box
              sx={{
                p: 2,
                bgcolor: "background.default",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
              }}
            >
              {!props.data.approved ? (
                <Box>
                  <RentAdminButtons id={props.data.id} update={props.update} />
                </Box>
              ) : (
                <Box>
                  <FinishRentForm id={props.data.id} update={props.update} />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    )
  }
  
  export default RentCard
  
  