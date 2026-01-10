"use client";

import { useEffect, useState, useMemo } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import AdminLayout from "../../../../../adminlayouts";
import TermFormFields from "@/components/TermFormFields";
import HolidayModal from "@/components/HolidayModal";
import useTerms from "../hooks/useTerms";

export default function EditTermPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    selectedTerm,
    fetchTermById,
    updateTerm,
    clearSelectedTerm,
    loading,
  } = useTerms();

  const [termName, setTermName] = useState("");
  const [startWeek, setStartWeek] = useState(null);
  const [endWeek, setEndWeek] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [openHoliday, setOpenHoliday] = useState(false);

  /* ---------------- FETCH TERM ---------------- */
  useEffect(() => {
    if (id) {
      fetchTermById(id);
    }

    return () => {
      clearSelectedTerm();
    };
  }, [id]);

  /* ---------------- SET FORM DATA ---------------- */
  useEffect(() => {
    if (!selectedTerm) return;

    setTermName(selectedTerm.termName);
    setStartWeek(dayjs(selectedTerm.startWeek));
    setEndWeek(dayjs(selectedTerm.endWeek));
    setHolidays(selectedTerm.holidays || []);
  }, [selectedTerm]);

  /* ---------------- PAYLOAD (SAFE) ---------------- */
  const payload = useMemo(() => {
    if (!startWeek || !endWeek) return null;

    return {
      termName,
      startWeek: dayjs(startWeek).startOf("week").toISOString(),
      endWeek: dayjs(endWeek).endOf("week").toISOString(),
      holidays: [...holidays].sort(),
    };
  }, [termName, startWeek, endWeek, holidays]);

  /* ---------------- UPDATE HANDLER ---------------- */
  const handleUpdate = async () => {
    if (!payload) return;

    await updateTerm(id, payload);
    router.push("/admin/schedule/term");
  };

  /* ---------------- LOADING STATE ---------------- */
  if (loading || !selectedTerm) {
    return (
      <AdminLayout activeNav="Terms">
        <Box sx={{ p: 3 }}>
          <Typography>Loading term details...</Typography>
        </Box>
      </AdminLayout>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout activeNav="Terms">
      <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          Edit Term
        </Typography>

        <Divider sx={{ my: 3 }} />

        <TermFormFields
          termName={termName}
          setTermName={setTermName}
          startWeek={startWeek}
          setStartWeek={setStartWeek}
          endWeek={endWeek}
          setEndWeek={setEndWeek}
        />

        <Divider sx={{ my: 4 }} />

        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => setOpenHoliday(true)}
          >
            Manage Holidays ({holidays.length})
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!payload}
          >
            Update Term
          </Button>
        </Box>
      </Box>

      <HolidayModal
        open={openHoliday}
        onClose={() => setOpenHoliday(false)}
        startWeek={startWeek}
        endWeek={endWeek}
        holidays={holidays}
        setHolidays={setHolidays}
      />
    </AdminLayout>
  );
}
