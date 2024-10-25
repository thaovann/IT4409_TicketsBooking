import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function Dashboard() {
    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant='h5'>100</Typography>
                        <Typography variant='subtitle1'>Total Events</Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant='h5'>500</Typography>
                        <Typography variant='subtitle1'>Tickets Sold</Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant='h5'>₫50M</Typography>
                        <Typography variant='subtitle1'>Total Revenue</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}