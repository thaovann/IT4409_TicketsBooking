import CreateEventForm from "../../../EventManager/CreateEventForm";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#222831",
            paper: "#393E46"
        },
        text: {
            primary: "#EEEEEE",
            secondary: "#B0BEC5"
        },
        primary: {
            main: "#00ADB5"
        },
        secondary: {
            main: "#FF5722"
        }
    },
    typography: {
        fontFamily: "Roboto, sans-serif"
    }
});

const CreateEventPage = () => {
    return (
        <ThemeProvider theme={theme}>
            <NavBar />
            <Box height={45} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <CreateEventForm />
            </Box>
        </ThemeProvider>
    )
}

export default CreateEventPage;