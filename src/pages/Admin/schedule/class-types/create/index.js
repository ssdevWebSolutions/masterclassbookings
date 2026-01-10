"use client";

import AdminLayout from "../../../AdminLayout";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ClassAddForm from "../components/ClassAddForm";
import useClasses from "../hooks/useClasses";


export default function CreateClassPage() {
  const { createClass } = useClasses();
  const router = useRouter();

  const handleSubmit = async (data) => {
    console.log("Final Payload:", data);
    await createClass(data);
    router.push("/admin/schedule/class-types");
  };

  return (
    <AdminLayout activeNav="class-types">
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" mb={3}>
          Add Class
        </Typography>

        <ClassAddForm onSubmit={handleSubmit} />
      </Box>
    </AdminLayout>
  );
}
