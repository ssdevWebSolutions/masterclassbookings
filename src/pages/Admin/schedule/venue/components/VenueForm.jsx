"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

export default function VenueForm({ initialData = null, onSubmit }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    venueName: "",
    addressLine1: "",
    addressLine2: "",
    town: "",
    postcode: "",
    venueNotes: "",
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit(formData);
      enqueueSnackbar(
        initialData ? "Venue updated successfully" : "Venue created successfully",
        { variant: "success" }
      );

      router.push("/admin/schedule/venue");
    } catch (err) {
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}
    >
      <TextField
        label="Venue Name"
        name="venueName"
        required
        fullWidth
        value={formData.venueName}
        onChange={handleChange}
      />

      <TextField
        label="Address Line 1"
        name="addressLine1"
        required
        fullWidth
        value={formData.addressLine1}
        onChange={handleChange}
      />

      <TextField
        label="Address Line 2"
        name="addressLine2"
        fullWidth
        value={formData.addressLine2}
        onChange={handleChange}
      />

      <TextField
        label="Town"
        name="town"
        required
        fullWidth
        value={formData.town}
        onChange={handleChange}
      />

      <TextField
        label="Postcode"
        name="postcode"
        required
        fullWidth
        value={formData.postcode}
        onChange={handleChange}
      />

      <TextField
        label="Venue Notes"
        name="venueNotes"
        fullWidth
        multiline
        rows={3}
        placeholder="Ground condition, parking, facilities..."
        value={formData.venueNotes}
        onChange={handleChange}
      />

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {initialData ? "Update Venue" : "Save Venue"}
      </Button>
    </Box>
  );
}
