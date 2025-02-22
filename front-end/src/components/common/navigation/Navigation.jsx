"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { UserConsumer } from "../../../context/UserContext"
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material"
import {
  Menu as MenuIcon,
  DirectionsCar,
  Add,
  Schedule,
  ShoppingCart,
  Person,
  Login,
  Logout,
} from "@mui/icons-material"

const Navigation = (props) => {
  const { user } = props
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    { to: "/cars/all", label: "Car Fleet", icon: <DirectionsCar /> },
    ...(user.isLoggedIn
      ? user.role === "ADMIN"
        ? [
            { to: "/cars/create", label: "Add Car", icon: <Add /> },
            { to: "/rents/pending", label: "Pending Rents", icon: <Schedule /> },
            { to: "/rents/active", label: "Active Rents", icon: <ShoppingCart /> },
          ]
        : [
            { to: "/cars/available", label: "Available Cars", icon: <DirectionsCar /> },
            { to: `/sales/all/${user.username}`, label: "My Purchases", icon: <ShoppingCart /> },
          ]
      : [
          { to: "/register", label: "Register", icon: <Person /> },
          { to: "/login", label: "Login", icon: <Login /> },
        ]),
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        RentCar
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.to}
              sx={{
                textAlign: "left",
                "&.active": {
                  bgcolor: "primary.light",
                  "& .MuiListItemText-primary": {
                    color: "primary.main",
                    fontWeight: "bold",
                  },
                },
              }}
            >
              {item.icon}
              <ListItemText primary={item.label} sx={{ ml: 2 }} />
            </ListItemButton>
          </ListItem>
        ))}
        {user.isLoggedIn && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem>
              <ListItemText primary={`Hello, ${user.username}!`} sx={{ textAlign: "center" }} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/logout"
                sx={{
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "error.light",
                  },
                }}
              >
                <Logout />
                <ListItemText primary="Logout" sx={{ ml: 2 }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 4 },
              textDecoration: "none",
              color: "primary.main",
              fontWeight: "bold",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            RentCar
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", flexGrow: 1, gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  startIcon={item.icon}
                  sx={{
                    "&.active": {
                      bgcolor: "primary.light",
                      color: "primary.main",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && user.isLoggedIn && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="subtitle2">Hello, {user.username}!</Typography>
              <Button component={NavLink} to="/logout" color="error" startIcon={<Logout />}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

const NavigationWithContext = (props) => {
  return <UserConsumer>{({ user }) => <Navigation {...props} user={user} />}</UserConsumer>
}

export default NavigationWithContext

