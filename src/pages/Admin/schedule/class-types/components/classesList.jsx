"use client";

import { Box, Grid, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";


import LoadingState from "@/sharedComponents/LoadingState";
import DeleteConfirmModal from "@/sharedComponents/DeleteConfirmModal";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useClasses from "../hooks/useClasses";
import ClassCard from "./ClassCard";

export default function ClassList() {
  const router = useRouter();
  const { classes, loading, deleteClass } = useClasses();
  const { enqueueSnackbar } = useSnackbar();

  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    try {
      await deleteClass(deleteId);
      enqueueSnackbar("Class deleted successfully ✅", {
        variant: "success",
      });
    } catch {
      enqueueSnackbar("Failed to delete class ❌", {
        variant: "error",
      });
    }
    setDeleteId(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* LOADING */}
      {loading && <LoadingState message="Loading classes..." />}

      {/* EMPTY STATE */}
      {!loading && classes.length === 0 && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No classes found
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() =>
              router.push("/admin/schedule/class-types/create")
            }
          >
            Add your first class
          </Button>
        </Box>
      )}

      {/* GRID */}
      {!loading && classes.length > 0 && (
        <Grid container spacing={2}>
          {classes.map((cls) => (
            <Grid item xs={12} sm={12} md={4} key={cls.id}>
              <ClassCard
                classItem={cls}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* DELETE CONFIRM */}
      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
