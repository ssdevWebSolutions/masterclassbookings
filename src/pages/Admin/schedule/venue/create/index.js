"use client";

import AdminLayout from "../../../AdminLayout";
import VenueForm from "../components/VenueForm";
import { Box, Typography } from "@mui/material";
import useVenues from "../hooks/useVenues";
import { useRouter } from "next/router";

export default function CreateVenuePage() {
  const { createVenue } = useVenues();
  const router = useRouter();

  const handleSubmit = async (formData) => {
    await createVenue(formData);
    router.push("/admin/schedule/venue");
  };

  return (
    <AdminLayout activeNav="Venues">
      <Box sx={{ p: 2 }}>
        <Typography variant="h3" mb={3} color="accent.main">
          Add Venue
        </Typography>
        <VenueForm onSubmit={handleSubmit} />
      </Box>
    </AdminLayout>
  );
}
