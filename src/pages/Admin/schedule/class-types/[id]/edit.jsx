"use client";

import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import AdminLayout from "../../../../adminlayouts";
import LoadingState from "@/sharedComponents/LoadingState";
import useClasses from "../hooks/useClasses";
import ClassAddForm from "../components/ClassAddForm";

export default function EditClassPage() {
  const router = useRouter();
  const { id } = router.query;

  const { classes, updateClass, loading } = useClasses();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (classes.length > 0 && id) {
      const cls = classes.find(
        (c) => String(c.id) === String(id)
      );
      setInitialData(cls);
    }
  }, [classes, id]);

  if (loading || !initialData) {
    return (
      <AdminLayout activeNav="Class Types">
        <LoadingState message="Loading class details..." />
      </AdminLayout>
    );
  }

  const handleSubmit = async (formData) => {
    await updateClass(id, formData);
    router.push("/admin/schedule/class-types");
  };

  return (
    <AdminLayout activeNav="Class Types">
      <Box sx={{ p: 2 }}>
        <Typography variant="h3" mb={3} color="accent.main">
          Edit Class
        </Typography>

        <ClassAddForm
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      </Box>
    </AdminLayout>
  );
}
