"use client";

import { Box, Grid, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useVenues from "../hooks/useVenues";
import VenueCard from "./VenueCard";
import LoadingState from "@/sharedComponents/LoadingState";
import { useState } from "react";
import DeleteConfirmModal from "@/sharedComponents/DeleteConfirmModal";
import { useSnackbar } from "notistack";

export default function VenueListPage() {
  const router = useRouter();
  const { venues, loading, deleteVenue } = useVenues();
  const { enqueueSnackbar } = useSnackbar();

  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    try {
      await deleteVenue(deleteId);
      enqueueSnackbar("Venue deleted successfully ✅", { variant: "success" });
    } catch {
      enqueueSnackbar("Failed to delete venue ❌", { variant: "error" });
    }
    setDeleteId(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* ✅ LOADING STATE */}
      {loading && <LoadingState message="Loading venues..." />}

      {/* ✅ EMPTY STATE */}
      {!loading && venues.length === 0 && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No venues found
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => router.push("/admin/schedule/venue/create")}
          >
            Add your first venue
          </Button>
        </Box>
      )}

      {/* ✅ VENUE GRID */}
      {!loading && venues.length > 0 && (
        <Grid container spacing={2}>
          {venues.map((venue) => (
            <Grid item xs={12} sm={12} md={4} key={venue.id}>
              <VenueCard venue={venue} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ✅ DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
