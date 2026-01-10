"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/router";



// hooks
import useVenues from "../../venue/hooks/useVenues";
import useTerms from "../../term/hooks/useTerms";
import useClasses from "../../class-types/hooks/useClasses";
import useCreateTrainingClass from "../hooks/useCreateTrainingClass";

// components



import AdminLayout from "@/adminlayouts";
import PricingSection from "../components/PricingSection";
import TrainingClassBasicInfo from "../components/TrainingClassBasicInfo";
import WeeklyPlanSection from "../components/WeeklyPlanSection";


/* ================== DISCOUNT SECTION ================== */
const DiscountSection = ({ discounts, setDiscounts }) => {
  const emptyDiscount = {
    name: "",
    couponCode: "",
    requiredSessions: "",
    discountedPrice: "",
    maxUsage: "",
    isRunning: true,
    blockedForUsers: false,
    active: true,
  };

  const addDiscount = () => {
    setDiscounts([...discounts, emptyDiscount]);
  };

  const updateDiscount = (index, field, value) => {
    const updated = [...discounts];
    updated[index][field] = value;
    setDiscounts(updated);
  };

  const removeDiscount = (index) => {
    setDiscounts(discounts.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Discount Coupons (Optional)
      </Typography>

      {discounts.map((d, i) => (
        <Box
          key={i}
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Discount Name"
              value={d.name}
              onChange={(e) =>
                updateDiscount(i, "name", e.target.value)
              }
            />

            <TextField
              label="Coupon Code"
              value={d.couponCode}
              onChange={(e) =>
                updateDiscount(i, "couponCode", e.target.value)
              }
            />

            <TextField
              type="number"
              label="Required Sessions"
              value={d.requiredSessions}
              onChange={(e) =>
                updateDiscount(i, "requiredSessions", e.target.value)
              }
            />

            <TextField
              type="number"
              label="Discounted Price"
              value={d.discountedPrice}
              onChange={(e) =>
                updateDiscount(i, "discountedPrice", e.target.value)
              }
            />

            <TextField
              type="number"
              label="Max Usage"
              value={d.maxUsage}
              onChange={(e) =>
                updateDiscount(i, "maxUsage", e.target.value)
              }
            />
          </Box>

          <Box mt={2} display="flex" gap={3} flexWrap="wrap">
            <FormControlLabel
              control={
                <Checkbox
                  checked={d.isRunning}
                  onChange={(e) =>
                    updateDiscount(i, "isRunning", e.target.checked)
                  }
                />
              }
              label="Running"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={d.blockedForUsers}
                  onChange={(e) =>
                    updateDiscount(
                      i,
                      "blockedForUsers",
                      e.target.checked
                    )
                  }
                />
              }
              label="Blocked for users"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={d.active}
                  onChange={(e) =>
                    updateDiscount(i, "active", e.target.checked)
                  }
                />
              }
              label="Active"
            />
          </Box>

          <Button
            color="error"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => removeDiscount(i)}
          >
            Remove Discount
          </Button>
        </Box>
      ))}

      <Button variant="outlined" onClick={addDiscount}>
        + Add Discount
      </Button>
    </Box>
  );
};
/* ===================================================== */

export default function CreateTrainingClassPage() {
  const router = useRouter();
  const { submit, loading } = useCreateTrainingClass();

  /* ---------- DATA ---------- */
  const { venues, loading: venueLoading } = useVenues();
  const { terms, fetchTerms, loading: termLoading } = useTerms();
  const { classes, loading: classLoading } = useClasses();

  /* ---------- BASIC INFO ---------- */
  const [classId, setClassId] = useState("");
  const [venueId, setVenueId] = useState("");
  const [termId, setTermId] = useState("");
  const [capacity, setCapacity] = useState("");

  /* ---------- WEEKLY PLAN ---------- */
  const [weeklyPlan, setWeeklyPlan] = useState({});

  /* ---------- PRICING ---------- */
  const [pricingType, setPricingType] = useState("TERM");
  const [termPrice, setTermPrice] = useState("");
  const [sessionPrice, setSessionPrice] = useState("");

  /* ---------- DISCOUNTS ---------- */
  const [discounts, setDiscounts] = useState([]);

  /* ---------- LOAD TERMS ---------- */
  useEffect(() => {
    fetchTerms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- BUILD PAYLOAD ---------- */
  const payload = useMemo(() => {
    const weeklyPlans = Object.entries(weeklyPlan).map(
      ([dayOfWeek, slots]) => ({
        dayOfWeek,
        slots,
      })
    );

    return {
      classId: Number(classId),
      capacity: Number(capacity),
      pricingType,

      termPrice:
        pricingType === "TERM" || pricingType === "BOTH"
          ? Number(termPrice)
          : null,

      sessionPrice:
        pricingType === "SESSION" || pricingType === "BOTH"
          ? Number(sessionPrice)
          : null,

      termId: Number(termId),
      venueId: Number(venueId),
      weeklyPlans,

      discounts: discounts.map((d) => ({
        name: d.name,
        couponCode: d.couponCode,
        requiredSessions: Number(d.requiredSessions),
        discountedPrice: Number(d.discountedPrice),
        maxUsage: Number(d.maxUsage),
        isRunning: d.isRunning,
        blockedForUsers: d.blockedForUsers,
        active: d.active,
      })),
    };
  }, [
    classId,
    capacity,
    pricingType,
    termPrice,
    sessionPrice,
    termId,
    venueId,
    weeklyPlan,
    discounts,
  ]);

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    try {
      await submit(payload);
      router.push("/admin/schedule/training-classes");
    } catch (err) {
      alert(err.message || "Failed to create training class");
    }
  };

  /* ---------- LOADING ---------- */
  if (venueLoading || termLoading || classLoading) {
    return (
      <AdminLayout activeNav="TrainingClasses">
        <Box p={4} textAlign="center">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeNav="TrainingClasses">
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Add Training Class
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Create a training class and automatically generate sessions for the
          selected term.
        </Typography>

        <TrainingClassBasicInfo
          classId={classId}
          setClassId={setClassId}
          classes={classes}
          venueId={venueId}
          setVenueId={setVenueId}
          venues={venues}
          termId={termId}
          setTermId={setTermId}
          terms={terms}
          capacity={capacity}
          setCapacity={setCapacity}
        />

        <Divider sx={{ my: 4 }} />

        <WeeklyPlanSection
          weeklyPlan={weeklyPlan}
          setWeeklyPlan={setWeeklyPlan}
        />

        <Divider sx={{ my: 4 }} />

        <PricingSection
          pricingType={pricingType}
          setPricingType={setPricingType}
          termPrice={termPrice}
          setTermPrice={setTermPrice}
          sessionPrice={sessionPrice}
          setSessionPrice={setSessionPrice}
        />

        <Divider sx={{ my: 4 }} />

        <DiscountSection
          discounts={discounts}
          setDiscounts={setDiscounts}
        />

        <Divider sx={{ my: 4 }} />

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() =>
              router.push("/admin/schedule/training-classes")
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save training class"}
          </Button>
        </Box>
      </Box>
    </AdminLayout>
  );
}
