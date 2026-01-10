"use client";

import AdminLayout from "../../AdminLayout";
import VenueList from "./components/VenueList";
import { Button, Box, Typography, Breadcrumbs,Link } from "@mui/material";
import { useRouter } from "next/router";

export default function VenuesPage() {
  const router = useRouter();

  return (
    <AdminLayout activeNav="Venues">
      <Box sx={{ p: 2 }}>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h3" color="accent.main">
            Venues
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/admin/schedule/venue/create")}
          >
            Add Venue
          </Button>
        </Box>

        <VenueList />
      </Box>
    </AdminLayout>
  );
}
