import { Component } from "react"
import { withRouter } from "react-router-dom"
import { Box, Button, TextField, CircularProgress, Alert } from "@mui/material"
import { Done, EventAvailable } from "@mui/icons-material"
import toastr from "toastr"

import { rentService } from "../../services"
import util from "../../util/util"

class FinishRentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: util.getCurrentDate(),
      loading: false,
      error: null,
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: null, // Clear any previous errors
    })
  }

  async onSubmit(e) {
    e.preventDefault()
    this.setState({ loading: true, error: null })

    try {
      const res = await rentService.finishRent(this.props.id, {
        date: this.state.date,
      })

      if (!res.success) {
        this.setState({ error: res.message })
        toastr.error(res.message || "Failed to finish rent")
      } else {
        toastr.success("Rent finished successfully")
        this.props.update()
        
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      this.setState({
        error: "An unexpected error occurred. Please try again.",
      })
      toastr.error("Failed to finish rent")
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { date, loading, error } = this.state

    return (
      <Box
        component="form"
        onSubmit={this.onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        {error && (
          <Alert severity="error" onClose={() => this.setState({ error: null })}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            type="date"
            name="date"
            label="Return Date"
            value={date}
            onChange={this.onChange}
            disabled={loading}
            required
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <EventAvailable
                  sx={{
                    color: "action.active",
                    mr: 1,
                  }}
                />
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Done />}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Finishing..." : "Finish"}
          </Button>
        </Box>
      </Box>
    )
  }
}

export default withRouter(FinishRentForm)

