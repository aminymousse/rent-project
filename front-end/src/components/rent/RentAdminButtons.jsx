import { Box, Button } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { rentService } from "../../services";
import toastr from "toastr";

const RentAdminButtons = ({ id, update }) => {
  const onApproveHandler = () => {
    rentService.approveRent(id).then((res) => {
      if (res.success) {
        toastr.success("Successfully approved rent!");
        update();
      } else {
        toastr.error(res.message);
      }
    });
  };

  const onDeclineHandler = () => {
    rentService.declineRent(id).then((res) => {
      if (res.success) {
        toastr.success("Successfully declined rent!");
        update();
      } else {
        toastr.error(res.message);
      }
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="contained"
        color="success"
        onClick={onApproveHandler}
        startIcon={<Check />}
      >
        Approve
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={onDeclineHandler}
        startIcon={<Close />}
      >
        Decline
      </Button>
    </Box>
  );
};

export default RentAdminButtons;
