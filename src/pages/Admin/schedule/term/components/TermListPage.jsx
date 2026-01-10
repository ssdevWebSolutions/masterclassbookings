"use client";

import { Box, Grid, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import useTerms from "../hooks/useTerms";
import TermCard from "./TermCard";
import LoadingState from "@/sharedComponents/LoadingState";
import DeleteConfirmModal from "@/sharedComponents/DeleteConfirmModal";

export default function TermListPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    terms,
    loading,
    error,
    fetchTerms,
    deleteTerm,
  } = useTerms();

  const [deleteId, setDeleteId] = useState(null);

  /* =========================
     FETCH ALL TERMS
  ========================= */
  useEffect(() => {
    fetchTerms();
  }, []);

  /* =========================
     DELETE HANDLERS
  ========================= */
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteTerm(deleteId);
      enqueueSnackbar("Term deleted successfully ✅", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar("Failed to delete term ❌", {
        variant: "error",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* ✅ LOADING */}
      {loading && <LoadingState message="Loading terms..." />}

      {/* ❌ ERROR */}
      {!loading && error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Failed to load terms
        </Typography>
      )}

      {/* ✅ EMPTY STATE */}
      {!loading && !error && terms.length === 0 && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No terms found
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() =>
              router.push("/admin/schedule/term/create")
            }
          >
            Add your first term
          </Button>
        </Box>
      )}

      {/* ✅ TERM GRID */}
      {!loading && !error && terms.length > 0 && (
        <Grid container spacing={2}>
          {terms.map((term) => (
            <Grid item xs={12} sm={12} md={4} key={term.id}>
              <TermCard term={term} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ✅ DELETE CONFIRM MODAL */}
      <DeleteConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
