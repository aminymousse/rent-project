import { TableRow, TableCell, Chip } from "@mui/material"
import { CheckCircle, Cancel, Schedule } from "@mui/icons-material"
import util from "../../../util/util"

const Purchase = ({ purchase }) => {
  const { id, carBrand, carModel, price, purchaseDate, status } = purchase

  const getStatusChip = (status) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Chip icon={<CheckCircle />} label="Completed" color="success" size="small" sx={{ fontWeight: "bold" }} />
        )
      case "CANCELLED":
        return <Chip icon={<Cancel />} label="Cancelled" color="error" size="small" sx={{ fontWeight: "bold" }} />
      default:
        return <Chip icon={<Schedule />} label="Pending" color="warning" size="small" sx={{ fontWeight: "bold" }} />
    }
  }

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: "medium" }}>{id}</TableCell>
      <TableCell>{util.formatDate(purchaseDate)}</TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>{carBrand}</TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>{carModel}</TableCell>
      <TableCell>${price.toFixed(2)}</TableCell>
      <TableCell>{getStatusChip(status)}</TableCell>
    </TableRow>
  )
}

export default Purchase

