import React, {
  useState,
  MouseEvent,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Divider,
  MenuItem,
  Drawer,
  Avatar,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
  Typography,
  ToolbarProps,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ToggleColorMode from "../ToggleColorMode/ToggleColorMode";
import { useAuth } from "../../Context/userAuth";
import { ThemeContext } from "../../Context/ThemeContext";
import { DatabaseStatusContext } from "../../Context/DatabaseStatusContext";
import { NetworkStatusContext } from "../../Context/NetworkStatusContext";
import ConnectionStatusFeedBack from "../ConnectionStatusFeedBack/ConnectionStatusFeedBack";
import Search from "../Search/Search";
import FIPLogo from "../FIPLogo/FIPLogo";

interface Props {
  portfolioSymbols?: Set<string>;
  onPortfolioCreate?: (symbol: string) => void;
  home?: boolean;
}

// Helper Functions
const stringToColor = (string: string): string => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const stringAvatar = (name: string) => ({
  sx: {
    bgcolor: stringToColor(name),
  },
  children: `${name[0].toUpperCase()}`,
});

// Styled Components
interface StyledToolbarProps extends ToolbarProps {
  scrolled: boolean;
}

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== "scrolled",
})<StyledToolbarProps>(({ theme, scrolled }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: scrolled ? 0 : `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  boxShadow: theme.shadows[1],
  padding: "8px 16px",
  marginLeft: scrolled ? 0 : "20px",
  marginRight: scrolled ? 0 : "20px",
  transition:
    "padding 0.6s ease-in-out, margin 0.5s ease-in-out, border-radius 0.3s ease-in-out",
}));

const AppAppBar: React.FC<Props> = ({
  portfolioSymbols,
  onPortfolioCreate,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { authLoading, user, isLoggedIn, logoutUser } = useAuth();
  const { mode } = useContext(ThemeContext);
  const { isBackendReachable, hasNetworkErrorRetriesExceeded } =
    useContext(NetworkStatusContext);
  const { isDatabaseResuming, hasDatabaseRetriesExceeded } = useContext(
    DatabaseStatusContext
  );
  const [scrolled, setScrolled] = useState(false);

  const valid = useMemo(
    () =>
      isDatabaseResuming ||
      hasDatabaseRetriesExceeded ||
      hasNetworkErrorRetriesExceeded ||
      !isBackendReachable,
    [
      isDatabaseResuming,
      hasDatabaseRetriesExceeded,
      hasNetworkErrorRetriesExceeded,
      isBackendReachable,
    ]
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleProjectsClick = (place: string) => {
    if (location.pathname !== "/stocks") {
      navigate("/stocks");
      setTimeout(() => {
        scroller.scrollTo(place, {
          smooth: true,
          duration: 500,
          offset: -220,
        });
      }, 100);
    } else {
      scroller.scrollTo(place, {
        smooth: true,
        duration: 500,
        offset: -100,
      });
    }
  };

  const isMenuOpen = Boolean(anchorEl);

  // Handlers
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Menu Items for Authenticated Users
  const authenticatedMenu: React.ReactElement[] = [
    <Box
      key="username"
      display="flex"
      alignItems="center"
      px={2}
      py={1}
      maxWidth={250}
      width="100%"
      overflow="hidden"
    >
      <ListItemIcon>
        <AccountCircleIcon
          fontSize="small"
          sx={{ color: mode === "dark" ? "grey.300" : "text.primary" }}
        />
      </ListItemIcon>
      <Tooltip title={user?.userName || "User Name"} placement="right">
        <Typography
          variant="body2"
          noWrap
          sx={{
            color: mode === "dark" ? "grey.300" : "text.primary",
            fontSize: "0.9rem",
          }}
        >
          {user?.userName || "User Name"}
        </Typography>
      </Tooltip>
    </Box>,
    <Box
      key="email"
      display="flex"
      alignItems="center"
      px={2}
      py={1}
      maxWidth={250}
      width="100%"
      overflow="hidden"
    >
      <ListItemIcon>
        <AlternateEmailIcon
          fontSize="small"
          sx={{ color: mode === "dark" ? "grey.400" : "text.secondary" }}
        />
      </ListItemIcon>
      <Tooltip title={user?.email || "Email"} placement="right">
        <Typography
          variant="body2"
          noWrap
          sx={{
            color: mode === "dark" ? "grey.400" : "text.secondary",
            fontSize: "0.8rem",
          }}
        >
          {user?.email || "Email"}
        </Typography>
      </Tooltip>
    </Box>,
    <Divider key="divider" />,
    <MenuItem
      key="Logout"
      onClick={() => {
        logoutUser();
        handleMenuClose();
      }}
      disabled={valid}
      sx={{
        "&:hover": {
          backgroundColor: mode === "dark" ? "grey.800" : "grey.100",
        },
      }}
    >
      <ListItemIcon>
        <LogoutIcon
          fontSize="small"
          sx={{ color: mode === "dark" ? "error.light" : "error.main" }}
        />
      </ListItemIcon>
      <ListItemText
        primary="Logout"
        primaryTypographyProps={{
          color: mode === "dark" ? "error.light" : "error.main",
          fontWeight: "medium",
        }}
      />
    </MenuItem>,
  ];

  // Menu Items for Unauthenticated Users
  const unauthenticatedMenu: React.ReactElement[] = [
    <MenuItem key="login" disabled={valid} onClick={handleMenuClose}>
      <Link to="/stocks/login" className="w-full flex flex-row items-center">
        <ListItemIcon>
          <LoginIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText
          primary="Login"
          primaryTypographyProps={{
            color: mode === "dark" ? "primary" : "primary",
            fontWeight: "medium",
          }}
        />
      </Link>
    </MenuItem>,
    <MenuItem key="register" disabled={valid} onClick={handleMenuClose}>
      <Link to="/stocks/register" className="w-full flex flex-row items-center">
        <ListItemIcon>
          <PersonAddIcon fontSize="small" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Register"
          primaryTypographyProps={{
            color: mode === "dark" ? "secondary" : "secondary",
            fontWeight: "medium",
          }}
        />
      </Link>
    </MenuItem>,
  ];

  // Handle authLoading state
  const renderAccountIcon = () => {
    if (authLoading) {
      // While authentication is loading, you can show a placeholder or nothing
      return (
        <Avatar
          sx={{ bgcolor: "grey.500", width: 32, height: 32 }}
          variant="circular"
        />
      );
    } else if (isLoggedIn && user) {
      // User is authenticated
      return <Avatar {...stringAvatar(user.userName || "User Name")} />;
    } else {
      // User is not authenticated
      return <Avatar sx={{ bgcolor: "grey.500", width: 32, height: 32 }} />;
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: scrolled ? 0 : 2,
        width: "100%",
        transition: "margin-top 0.6s ease-in-out",
      }}
    >
      <StyledToolbar
        variant="dense"
        disableGutters
        scrolled={scrolled}
        className=" transition-all duration-300 bg-[#f5f1e0be] dark:bg-[#192335be]"
      >
        <Box
          className="flex items-center"
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
        >
          <Link
            to="/stocks"
            className="flex flex-row items-center dark:invert
              "
          >
            <FIPLogo sx={{ fontSize: "100px", height: "65px" }} />
          </Link>
          <Box className="hidden smv:flex">
            <Link
              to="/stocks"
              className="flex flex-row items-center !p-0 !w-fit "
            >
              <Button
                onClick={() => handleProjectsClick("Home")}
                variant="text"
                color="inherit"
                size="small"
                className="!text-black dark:!text-white !text-sm  !min-w-fit"
              >
                Home
              </Button>
            </Link>
            {!isLoggedIn && (
              <Button
                onClick={() => handleProjectsClick("Features")}
                variant="text"
                color="inherit"
                size="small"
                className="!text-black dark:!text-white !text-sm  !min-w-fit"
              >
                Features
              </Button>
            )}
            {isLoggedIn && (
              <Link
                to="/stocks/portfolio"
                className="flex flex-row items-center !p-0 !min-w-fit"
              >
                <Button
                  onClick={() => handleProjectsClick("My Portfolio")}
                  variant="text"
                  color="inherit"
                  size="small"
                  className="!text-black dark:!text-white !text-sm  !min-w-fit"
                >
                  PORTFOLIO
                </Button>
              </Link>
            )}
          </Box>
          {isLoggedIn && (
            <div className="flex-grow px-2">
              <Search
                portfolioSymbols={portfolioSymbols!}
                onPortfolioCreate={onPortfolioCreate!}
              />
            </div>
          )}
        </Box>

        {/* Right Section: Account and Theme Toggle */}
        <Box className="hidden smv:flex items-center">
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{}}
              aria-controls={isMenuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? "true" : undefined}
            >
              {renderAccountIcon()}
            </IconButton>
          </Tooltip>
          <ToggleColorMode />
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={isMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                minWidth: 250, // Set a minimum width
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
                backgroundColor:
                  mode === "dark" ? "#1f2937" : "background.paper", // Adjust based on mode
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* Info Tooltip */}
            <Box
              key="account-info"
              display="flex"
              alignItems="center"
              px={2}
              py={1}
              maxWidth={250}
              width="100%"
              overflow="hidden"
            >
              <Tooltip
                title="Currently, the Account system is used to interact with the Financial Modeling Prep API and to store/manage stock portfolios and comments."
                arrow
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{
                    color: mode === "dark" ? "grey.400" : "grey.600",
                    mr: 1,
                  }}
                />
              </Tooltip>
              <ListItemText
                primary="Account Information"
                primaryTypographyProps={{
                  color: mode === "dark" ? "grey.300" : "grey.700",
                  fontSize: "0.8rem",
                }}
              />
            </Box>
            <Divider />
            <div className="w-[250px] text-sm p-2">
              <ConnectionStatusFeedBack />
            </div>

            {user ? authenticatedMenu : unauthenticatedMenu}
          </Menu>
        </Box>

        {/* Mobile Section: Drawer */}
        <Box className="flex smv:hidden">
          <ToggleColorMode />
          <IconButton
            aria-label="Menu button"
            onClick={toggleDrawer(true)}
            className="dark:text-white"
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              className="p-2 bg-white dark:bg-gray-800"
              sx={{ height: "100%" }}
            >
              {/* Drawer Header */}
              <Box className="flex items-center justify-between">
                <IconButton
                  onClick={toggleDrawer(false)}
                  className="dark:text-white"
                >
                  <CloseRoundedIcon />
                </IconButton>
                <ToggleColorMode />
              </Box>
              <Divider className="my-3 dark:bg-gray-700" />

              <Box className="flex flex-col space-y-2">
                <MenuItem
                  onClick={() => {
                    handleProjectsClick("Home");
                    setDrawerOpen(false);
                  }}
                >
                  <Typography className="dark:text-white uppercase">
                    Home
                  </Typography>
                </MenuItem>
                {!isLoggedIn && (
                  <MenuItem
                    onClick={() => {
                      handleProjectsClick("Features");
                      setDrawerOpen(false);
                    }}
                  >
                    <Typography className="dark:text-white uppercase">
                      Features
                    </Typography>
                  </MenuItem>
                )}
                {isLoggedIn && (
                  <MenuItem
                    onClick={() => {
                      navigate("/stocks/portfolio");
                      setDrawerOpen(false);
                    }}
                  >
                    <Typography className="dark:text-white uppercase">
                      My Portfolio
                    </Typography>
                  </MenuItem>
                )}

                <Divider className="my-2 dark:bg-gray-700" />

                {isLoggedIn ? (
                  <>
                    <Box
                      display="flex"
                      alignItems="center"
                      px={2}
                      py={1}
                      maxWidth={250}
                      width="100%"
                      overflow="hidden"
                    >
                      <Tooltip
                        title="Currently, the Account system is used to interact with the Financial Modeling Prep API and to store/manage stock portfolios and comments."
                        arrow
                        placement="bottom"
                      >
                        <InfoOutlinedIcon
                          fontSize="small"
                          sx={{
                            color: mode === "dark" ? "grey.400" : "grey.600",
                            mr: 1,
                          }}
                        />
                      </Tooltip>
                      <ListItemText
                        primary="Account Information"
                        primaryTypographyProps={{
                          color: mode === "dark" ? "grey.300" : "grey.700",
                          fontSize: "0.8rem",
                        }}
                      />
                    </Box>
                    <Divider className="my-2 dark:bg-gray-700" />

                    {/* User Name */}
                    <Box
                      display="flex"
                      alignItems="center"
                      px={2}
                      py={1}
                      maxWidth={250}
                      width="100%"
                      overflow="hidden"
                    >
                      <ListItemIcon>
                        <AccountCircleIcon
                          fontSize="small"
                          sx={{
                            color:
                              mode === "dark" ? "grey.300" : "text.primary",
                          }}
                        />
                      </ListItemIcon>
                      <Tooltip
                        title={user?.userName || "User Name"}
                        placement="bottom"
                      >
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            color:
                              mode === "dark" ? "grey.300" : "text.primary",
                            fontSize: "0.9rem",
                          }}
                        >
                          {user?.userName || "User Name"}
                        </Typography>
                      </Tooltip>
                    </Box>

                    {/* Email */}
                    <Box
                      display="flex"
                      alignItems="center"
                      px={2}
                      py={1}
                      maxWidth={250}
                      width="100%"
                      overflow="hidden"
                    >
                      <ListItemIcon>
                        <AlternateEmailIcon
                          fontSize="small"
                          sx={{
                            color:
                              mode === "dark" ? "grey.400" : "text.secondary",
                          }}
                        />
                      </ListItemIcon>
                      <Tooltip
                        title={user?.email || "Email"}
                        placement="bottom"
                      >
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            color:
                              mode === "dark" ? "grey.400" : "text.secondary",
                            fontSize: "0.8rem",
                          }}
                        >
                          {user?.email || "Email"}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Divider className="my-2 dark:bg-gray-700" />

                    <MenuItem
                      onClick={() => {
                        logoutUser();
                        setDrawerOpen(false);
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            mode === "dark" ? "grey.800" : "grey.100",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon
                          fontSize="small"
                          sx={{
                            color:
                              mode === "dark" ? "error.light" : "error.main",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                          color: mode === "dark" ? "error.light" : "error.main",
                          fontWeight: "medium",
                        }}
                      />
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <div className="w-full items-center justify-center text-sm p-2">
                      <ConnectionStatusFeedBack />
                    </div>
                    <MenuItem
                      onClick={() => setDrawerOpen(false)}
                      disabled={valid}
                    >
                      <Link
                        to="/stocks/login"
                        className="w-full flex flex-row items-center"
                      >
                        <ListItemIcon>
                          <LoginIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Login"
                          primaryTypographyProps={{
                            color: mode === "dark" ? "primary" : "primary",
                            fontWeight: "medium",
                          }}
                        />
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => setDrawerOpen(false)}
                      disabled={valid}
                    >
                      <Link
                        to="/stocks/register"
                        className="w-full flex flex-row items-center"
                      >
                        <ListItemIcon>
                          <PersonAddIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Register"
                          primaryTypographyProps={{
                            color: mode === "dark" ? "secondary" : "secondary",
                            fontWeight: "medium",
                          }}
                        />
                      </Link>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Box>
          </Drawer>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default AppAppBar;
