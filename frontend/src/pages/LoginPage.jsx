import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // id as username
        // if it's empty, default to 1
        const employeeId = username || 1;
        navigate(`/profile/${employeeId}`);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
            <Paper elevation={14} sx={{ p: 10, width: "100%", maxWidth: 400 }}>
                <Typography variant="h5" mb={2} align="center">
                    Employee Profile Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Employee ID"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password --not used--"
                        type="password"
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default LoginPage;
