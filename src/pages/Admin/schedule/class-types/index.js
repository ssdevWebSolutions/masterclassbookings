"use client";

import AdminLayout from "../../AdminLayout";
import { Button, Box, Typography} from "@mui/material";
import { useRouter } from "next/router";
import ClassList from "./components/classesList";

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
            Classes
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/admin/schedule/class-types/create")}
          >
            Add class
          </Button>
        </Box>
        <ClassList />
      </Box>
    </AdminLayout>
  );
}
