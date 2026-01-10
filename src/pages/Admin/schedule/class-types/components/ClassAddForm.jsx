"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

const activityOptions = ["Cricket"];

const years = Array.from({ length: 19 }, (_, i) => i); // 0–18
const months = Array.from({ length: 12 }, (_, i) => i); // 0–11

export default function ClassAddForm({ initialData = null, onSubmit }) {
  const { enqueueSnackbar } = useSnackbar();

  // =========================
  // FORM STATE (UNCHANGED + imageUrl)
  // =========================
  const [formData, setFormData] = useState({
    className: "",
    description: "",
    activity: "",
    imageUrl: "",
    ageFrom: { years: 0, months: 0 },
    ageTo: { years: 0, months: 0 },
  });

  // =========================
  // IMAGE STATE (NEW)
  // =========================
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // =========================
  // POPULATE EDIT DATA (SAFE)
  // =========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        className: initialData.className || "",
        description: initialData.description || "",
        activity: initialData.activity || "",
        imageUrl: initialData.imageUrl || "",
        ageFrom: {
          years: initialData.ageFrom?.years ?? 0,
          months: initialData.ageFrom?.months ?? 0,
        },
        ageTo: {
          years: initialData.ageTo?.years ?? 0,
          months: initialData.ageTo?.months ?? 0,
        },
      });

      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  // =========================
  // HANDLERS (UNCHANGED)
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgeChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: Number(value),
      },
    }));
  };

  // =========================
  // IMAGE UPLOAD (NEW)
  // =========================
  const uploadImageAndGetUrl = async () => {
    if (!imageFile) return formData.imageUrl;

    const fd = new FormData();
    fd.append("image", imageFile);

    setUploading(true);

    const res = await fetch("/api/cloudinary/upload-image", {
      method: "POST",
      body: fd,
    });

    setUploading(false);

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    return data.url;
  };

  // =========================
  // SUBMIT (MINIMAL CHANGE)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fromTotal =
      formData.ageFrom.years * 12 + formData.ageFrom.months;
    const toTotal =
      formData.ageTo.years * 12 + formData.ageTo.months;

    if (fromTotal > toTotal) {
      enqueueSnackbar("Age From must be less than Age To", {
        variant: "error",
      });
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImageAndGetUrl();
      }

      console.log({
        ...formData,
        imageUrl,
      },"form data image url");

      await onSubmit({
        ...formData,
        imageUrl,
      });

      enqueueSnackbar(
        initialData
          ? "Class updated successfully ✅"
          : "Class created successfully ✅",
        { variant: "success" }
      );
    } catch (err) {
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  // =========================
  // UI (UNCHANGED + IMAGE BLOCK)
  // =========================
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 720,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        pb: 4,
      }}
    >
      {/* CLASS NAME */}
      <TextField
        label="Class Name"
        name="className"
        required
        fullWidth
        value={formData.className}
        onChange={handleChange}
      />

      {/* DESCRIPTION */}
      <TextField
        label="Description"
        name="description"
        multiline
        rows={5}
        fullWidth
        placeholder="Tell parents why this class is valuable and enjoyable for their children."
        value={formData.description}
        onChange={handleChange}
      />

      {/* ACTIVITY */}
      <TextField
        select
        label="Activity"
        name="activity"
        required
        fullWidth
        value={formData.activity}
        onChange={handleChange}
      >
        {activityOptions.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>

      {/* CLASS IMAGE (NEW) */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Class Image
        </Typography>

        <Button variant="outlined" component="label">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
        </Button>

        {imagePreview && (
          <Box mt={2}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: 220,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </Box>
        )}
      </Box>

      {/* AGE RANGE */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Age From (Years)"
            fullWidth
            value={formData.ageFrom.years}
            onChange={(e) =>
              handleAgeChange("ageFrom", "years", e.target.value)
            }
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Age To (Years)"
            fullWidth
            value={formData.ageTo.years}
            onChange={(e) =>
              handleAgeChange("ageTo", "years", e.target.value)
            }
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* SUBMIT */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={uploading}
      >
        {uploading
          ? "Uploading..."
          : initialData
          ? "Update Class"
          : "Save Class"}
      </Button>
    </Box>
  );
}
 