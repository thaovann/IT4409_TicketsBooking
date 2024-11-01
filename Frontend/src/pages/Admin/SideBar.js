import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SideBar() {
    const navigate = useNavigate();

    return (
        <Drawer variant="permanent" anchor="left" sx={{ bgcolor: '#ffea99' }}>
            <List>
                <ListItem button onClick={() => navigate('/admin/manage-users')}>
                    <ListItemText primary="Manage Users" />
                </ListItem>

                {/* các mục quản lý khác */}
            </List>
        </Drawer>
    );
}

export default SideBar;