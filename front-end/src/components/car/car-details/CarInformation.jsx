import React, { Fragment } from "react";
import { withRouter } from "react-router";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatesConsumer } from "../../../context/DatesContext";
import util from "../../../util/util";

// Styled components
const StyledImage = styled("img")({
  width: "100%",
  height: "auto",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
});

const InfoTable = ({ rows }) => (
  <Table>
    <TableBody>
      {rows.map((row, index) => (
        <TableRow key={index}>
          {row.map((cell, cellIndex) => (
            <TableCell
              key={cellIndex}
              sx={cellIndex % 2 === 0 ? { fontWeight: "bold" } : {}}
            >
              {cell}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const CarInformation = (props) => {
  const { startDate, endDate } = props.dates;
  const { data, location } = props;
  const days = util.getDaysBetween(new Date(startDate), new Date(endDate));

  return (
    <Container maxWidth="lg" sx={{ my: 5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={3}
            sx={{ p: 3, height: "100%", bgcolor: "background.paper" }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {data.brand} {data.model}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Year: {data.year}
            </Typography>

            {location.pathname.startsWith("/cars/reserve") ? (
              <Fragment>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Rent Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <InfoTable
                    rows={[
                      ["Start date", util.formatDate(startDate)],
                      ["End date", util.formatDate(endDate)],
                      ["Total price", `$${days * data.pricePerDay}`],
                    ]}
                  />
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 2, color: "text.secondary" }}
                  >
                    * For every day after the return date, you will be charged
                    double the daily price.
                  </Typography>
                </Box>
              </Fragment>
            ) : (
              <Box>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="body1"
                  component="pre"
                  sx={{
                    whiteSpace: "pre-wrap",
                    mb: 2,
                    fontFamily: "inherit",
                  }}
                >
                  {data.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ textAlign: "right" }}>
                  Price: ${data.pricePerDay}/Day
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 3 }}>
            <StyledImage
              src={data.imageUrl}
              alt={`${data.brand} ${data.model}`}
            />
          </Box>

          <Paper elevation={3} sx={{ p: 3, bgcolor: "background.paper" }}>
            <Typography variant="h5" gutterBottom>
              Technical data
            </Typography>
            <Divider sx={{ my: 2 }} />
            <InfoTable
              rows={[
                ["Brand", data.brand, "Seats", data.seats],
                ["Model", data.model, "Year", data.year],
                [
                  "Luggage",
                  `${data.trunkCapacity} l`,
                  "Consumption",
                  `${data.litersPerHundredKilometers} l/100 km`,
                ],
              ]}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const CarInformationWithContext = (props) => {
  return (
    <DatesConsumer>
      {({ dates }) => <CarInformation {...props} dates={dates} />}
    </DatesConsumer>
  );
};

export default withRouter(CarInformationWithContext);
