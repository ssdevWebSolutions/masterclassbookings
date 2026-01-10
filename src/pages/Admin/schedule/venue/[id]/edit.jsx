"use client";

import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import useVenues from "../hooks/useVenues";
import VenueForm from "@/components/VenueForm";
import { useEffect, useState } from "react";
import AdminLayout from "../../../../../adminlayouts";
import LoadingState from "@/sharedComponents/LoadingState";

export default function EditVenuePage() {
  const router = useRouter();
  const { id } = router.query;

  const { venues, updateVenue, loading } = useVenues();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (venues.length > 0 && id) {
      const venue = venues.find((v) => String(v.id) === String(id));
      setInitialData(venue);
    }
  }, [venues, id]);

  if (loading || !initialData) {
    return (
      <AdminLayout activeNav="Venues">
        <LoadingState message="Loading venue details..." />
      </AdminLayout>
    );
  }

  const handleSubmit = async (formData) => {
    await updateVenue({ id, payload: formData });
    router.push("/admin/schedule/venue");
  };

  return (
    <AdminLayout activeNav="Venues">
      <Box sx={{ p: 2 }}>
        <Typography variant="h3" mb={3} color="accent.main">
          Edit Venue
        </Typography>

        <VenueForm initialData={initialData} onSubmit={handleSubmit} />
      </Box>
    </AdminLayout>
  );
}
