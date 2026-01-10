"use client";

import AdminLayout from "../../AdminLayout";
import TermListPage from "./components/TermListPage";
import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function TermsPage() {
  const router = useRouter();

  return (
    <AdminLayout activeNav="Terms">
      <Box sx={{ p: 2 }}>
        {/* HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h3" color="accent.main">
            Terms
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              router.push("/admin/schedule/term/create")
            }
          >
            Add Term
          </Button>
        </Box>

        {/* TERM LIST */}
        <TermListPage />
      </Box>
    </AdminLayout>
  );
}
