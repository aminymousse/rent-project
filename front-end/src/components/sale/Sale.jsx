import { TableRow, TableCell, Chip } from "@mui/material";
import { CheckCircle, Cancel, Schedule } from "@mui/icons-material";
import util from "../../util/util";

const Sale = ({ sale }) => {
  const {
    rentId,
    issueDate,
    carBrand,
    carModel,
    startDate,
    endDate,
    pricePaid,
    type,
  } = sale;

  const getStatusChip = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Approved"
            color="success"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      case "DECLINED":
        return (
          <Chip
            icon={<Cancel />}
            label="Declined"
            color="error"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      default:
        return (
          <Chip
            icon={<Schedule />}
            label="Pending"
            color="warning"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
    }
  };

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: "medium" }}>{rentId}</TableCell>
      <TableCell>{util.formatDate(issueDate)}</TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>{carBrand}</TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>{carModel}</TableCell>
      <TableCell>{util.formatDate(startDate)}</TableCell>
      <TableCell>{util.formatDate(endDate)}</TableCell>
      <TableCell>${pricePaid.toFixed(2)}</TableCell>
      <TableCell>{getStatusChip(type)}</TableCell>
    </TableRow>
  );
};

export default Sale;
