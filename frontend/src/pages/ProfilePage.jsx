// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Avatar,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Divider,
} from "@mui/material";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function ProfilePage() {
    const { id } = useParams(); // read the id from the URL (can be undefined)
    const employeeId = id || 1; // if no id (route /profile), use 1

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${API_BASE_URL}/employees/${employeeId}` // use the id from the URL (dynamic)
                );
                if (!response.ok) {
                    throw new Error("Error fetching employee");
                }
                const data = await response.json();
                setEmployee(data);
            } catch (err) {
                setError(err.message || "Error");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [employeeId]); // if employeeId changes, refetch

    if (loading) {
        return (
            <Box textAlign="center">
                <CircularProgress />
                <Typography mt={2}>Cargando perfil...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    if (!employee) {
        return null;
    }

    const radarData = (employee.skills || []).map((skill) => ({
        subject: skill.name,
        level: skill.level,
        fullMark: 100,
    }));

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            {/* header */}
            <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                    src={employee.avatar_url}
                    alt={employee.full_name}
                    sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                    <Typography variant="h5">{employee.full_name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {employee.position}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Graph */}
            <Typography variant="h6" gutterBottom>
                Skill Radar
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                            name="Nivel"
                            dataKey="level"
                            stroke="#1976d2"
                            fill="#1976d2"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Box>

            {/* Skills list */}
            <Typography variant="h6" gutterBottom>
                My Skills
            </Typography>
            <List>
                {employee.skills.map((skill) => (
                    <ListItem key={skill.id} disablePadding>
                        <ListItemText
                            primary={skill.name}
                            secondary={`Level: ${skill.level}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default ProfilePage;
