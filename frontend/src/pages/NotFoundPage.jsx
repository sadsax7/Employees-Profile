import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box textAlign="center">
            <Typography variant="h3" gutterBottom>
                404
            </Typography>
            <Typography variant="h6" gutterBottom>
                Page not found
            </Typography>
            <Button variant="contained" onClick={() => navigate("/login")}>
                Go to Login
            </Button>
        </Box>
    );
}

export default NotFoundPage;
