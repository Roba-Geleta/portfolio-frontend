import { Outlet } from "react-router";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/userAuth";
import AppAppBar from "./Components/AppAppBar/AppAppBar";
import Footer from "./Components/Footer/Footer";
import { Box, Container } from "@mui/material";

function App() {
  return (
    <>
      <UserProvider>
        <AppAppBar />
        <Box
          id="user-profile"
          sx={{
            width: "100%",
            minHeight: "100vh",
            backgroundRepeat: "no-repeat",
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          }}
          className="bg-orange-100 dark:bg-gray-900 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_hsl(210,_100%,_90%),_transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_hsl(210,_100%,_16%),_transparent)]"
        >
          <Container
            sx={{
              pt: { xs: 12, sm: 14 },
              pb: { xs: 6, sm: 8 },
            }}
          >
            <Outlet />
            <ToastContainer />
          </Container>
        </Box>
        <Footer />
      </UserProvider>
    </>
  );
}

export default App;
