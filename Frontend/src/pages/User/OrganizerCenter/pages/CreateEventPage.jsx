import CreateEventForm from "../../../EventManager/CreateEventForm";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import Box from '@mui/material/Box';

const CreateEventPage = () => {
    return (
        <>
            <NavBar />
            <Box height={45} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <CreateEventForm />
            </Box>
        </>
    )
}

export default CreateEventPage;