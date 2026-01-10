/**
 * Training Class Sessions Page
 * Single Responsibility: Orchestrate session selection and booking
 * Uses SOLID principles with separated concerns
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { fetchKids } from "@/Redux/Kids/KidActions";
import { Box, Typography, FormControl, Select, MenuItem, CircularProgress, Alert, IconButton, FormControlLabel, Checkbox, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import DashboardLayout from "@/pages/admin/components/DashboardLayout";
import UserSidebar from "@/pages/dashboard/components/UserSidebar";
import UserHeader from "@/pages/dashboard/components/UserHeader";
import { getGreeting } from "@/utils/greetingUtils";
import { useSessionsData } from "../hooks/useSessionsData";
import { useSessionSelection } from "../hooks/useSessionSelection";
import { processBooking } from "../services/bookingService";
import SessionAccordion from "../components/SessionAccordion";
import { formatTermDateRange } from "@/pages/dashboard/utils/formatUtils";

export default function TrainingClassSessionsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { classId } = router.query;

  // Redux state
  const loginData = useSelector(state => state.auth.loginData);
  const token = loginData?.token;
  const userId = loginData?.id;
  const kids = useSelector(state => state.kids.list || []);
  const userName = loginData?.fullName || loginData?.name || "User";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [consent, setConsent] = useState(false);
  const [couponCode, setCouponCode] = useState("");



  // Use custom hooks for data management
  const { trainingClass, sessions, loading } = useSessionsData(classId);
  const {
    selected,
    setSelected,
    toggleSession,
    toggleAllSessionsInSlot,
    groupedSessions,
    pricing,
    getAvailabilityStatus,
    handleApplyCoupon,
    appliedCoupon,
    couponError
  } = useSessionSelection(sessions, trainingClass);



  // Auth guard
  useEffect(() => {
    if (!token || token === null || token === "") {
      router.push("/");
    }
  }, [token, router]);

  // Set greeting
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  // Fetch kids
  useEffect(() => {
    if (userId && token) {
      dispatch(fetchKids(userId));
    }
  }, [userId, token, dispatch]);

  // Set first kid as default
  useEffect(() => {
    if (kids.length > 0 && !selectedKidId) {
      setSelectedKidId(kids[0].id.toString());
    }
  }, [kids, selectedKidId]);

  const handleBooking = async () => {
    if (!selected.length) {
      alert("Please select at least one session");
      return;
    }

    if (!selectedKidId) {
      alert("Please select a child");
      return;
    }

    try {
      setBookingLoading(true);
      await processBooking(
        {
          userId: userId,
          kidId: selectedKidId,
          trainingClassId: classId,
          sessionIds: selected,
          consent: consent
        },
        pricing.finalPrice,
        classId
      );
    } catch (e) {
      alert(e.message || "Failed to process booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (!token || loading) {
    return (
      <DashboardLayout
        sidebar={<UserSidebar sidebarOpen={false} profileDropdownOpen={false} onCloseSidebar={() => { }} onProfileDropdownToggle={() => { }} loginData={loginData} />}
        header={<UserHeader activeNav="Sessions" onMenuToggle={() => { }} greeting={greeting} userName={userName} />}
        sidebarOpen={false}
        onOverlayClick={() => { }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (kids.length === 0) {
    return (
      <DashboardLayout
        sidebar={<UserSidebar sidebarOpen={sidebarOpen} profileDropdownOpen={profileDropdownOpen} onCloseSidebar={() => setSidebarOpen(false)} onProfileDropdownToggle={() => setProfileDropdownOpen(!profileDropdownOpen)} loginData={loginData} />}
        header={<UserHeader activeNav="Sessions" onMenuToggle={() => setSidebarOpen(true)} greeting={greeting} userName={userName} />}
        sidebarOpen={sidebarOpen}
        onOverlayClick={() => setSidebarOpen(false)}
      >
        <Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You need to add a child to your profile before booking sessions.
          </Alert>
          <button
            className="btn btn-warning"
            onClick={() => router.push("/profile")}
          >
            Go to Profile
          </button>
        </Box>
      </DashboardLayout>
    );
  }

  const handleConsentChange = (event) => {
    const checked = event.target.checked;
    setConsent(checked);
  };






  const venue = trainingClass?.venueName || trainingClass?.venue || "Venue TBC";
  const term = trainingClass?.term;
  const classType = trainingClass?.classType?.className || trainingClass?.className || "Training Class";
  const termDateRange = formatTermDateRange(term);

  const discountedComboPriceForSessions =
    pricing.isFullBlock
      ? pricing.finalPrice
      : trainingClass.sessionPrice * 10;


  return (
    <DashboardLayout
      sidebar={
        <UserSidebar
          sidebarOpen={sidebarOpen}
          profileDropdownOpen={profileDropdownOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
          onProfileDropdownToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
          loginData={loginData}
        />
      }
      header={
        <UserHeader
          activeNav={classType}
          onMenuToggle={() => setSidebarOpen(true)}
          greeting={greeting}
          userName={userName}
        />
      }
      sidebarOpen={sidebarOpen}
      onOverlayClick={() => setSidebarOpen(false)}
    >
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 0 } }}>
        {/* Back Button */}
        <Box mb={3}>
          <IconButton
            onClick={() => router.push("/dashboard?tab=events")}
            sx={{
              p: 0.5,
              minWidth: "auto",
              width: 32,
              height: 32,
              color: "accent.main",
              border: "1px solid rgba(255,193,8,0.3)",
              "&:hover": {
                backgroundColor: "rgba(255,193,8,0.1)",
                borderColor: "accent.main",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Class Info with Description at Top */}
        <Box mb={3}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: "accent.main",
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontFamily: "var(--title-font)",
            }}
          >
            {classType}
          </Typography>
          {termDateRange && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2,
                fontSize: { xs: "0.813rem", sm: "0.875rem" },
              }}
            >
              {termDateRange}
            </Typography>
          )}
          {trainingClass?.description && (
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                mb: 2,
                lineHeight: 1.6,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {trainingClass.description}
            </Typography>
          )}
        </Box>

        {/* Venue with Info Icon */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "accent.main",
                  mb: 0.5,
                  fontSize: { xs: "0.813rem", sm: "0.875rem" },
                  fontWeight: 600,
                }}
              >
                Venue
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {venue}
              </Typography>
            </Box>
            {trainingClass?.description && (
              <IconButton
                onClick={() => setShowDescription(true)}
                sx={{
                  ml: 1,
                  color: "accent.main",
                  "&:hover": {
                    backgroundColor: "rgba(255,193,8,0.1)",
                  },
                }}
                size="small"
              >
                <InfoIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Child Selection */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "accent.main", mb: 1.5 }}>
            Select Child
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={selectedKidId}
              onChange={(e) => setSelectedKidId(e.target.value)}
              sx={{
                backgroundColor: "background.default",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,193,8,0.3)",
                },
              }}
            >
              {kids.map((kid) => (
                <MenuItem key={kid.id} value={kid.id.toString()}>
                  {kid.firstName} {kid.lastName} {kid.age ? `(Age ${kid.age})` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Pricing Cards */}
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2} mb={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
              Per Session
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: "accent.main" }}>
              £{trainingClass.sessionPrice}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: pricing.isFullBlock ? "2px solid" : "1px solid",
              borderColor: pricing.isFullBlock ? "accent.main" : "divider",
              backgroundColor: pricing.isFullBlock ? "rgba(255,193,8,0.1)" : "background.paper",
              textAlign: "center",
              position: "relative",
            }}
          >
            {pricing.isFullBlock && (
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: "accent.main",
                  color: "background.default",
                }}
              >
                <Typography variant="caption" fontWeight={600}>
                  Best Value
                </Typography>
              </Box>
            )}
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5, mt: pricing.isFullBlock ? 1 : 0 }}>
              Full Block (10 sessions)
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: "accent.main" }}>
              £{discountedComboPriceForSessions}
            </Typography>
            {pricing.isFullBlock && (
              <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600 }}>
                Save £{(trainingClass.sessionPrice * 10) - discountedComboPriceForSessions}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Session Selection */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: "accent.main" }}>
              Select Sessions ({selected.length} selected)
            </Typography>
            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(220,53,69,0.5)",
                  color: "rgba(220,53,69,1)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Clear All
              </button>
            )}
          </Box>

          {/* Grouped Sessions by Time Slot - Accordion Format */}
          {groupedSessions.map((slotGroup, slotIdx) => (
            <SessionAccordion
              key={slotIdx}
              slotGroup={slotGroup}
              slotIdx={slotIdx}
              selected={selected}
              toggleSession={toggleSession}
              toggleAllSessionsInSlot={toggleAllSessionsInSlot}
              getAvailabilityStatus={getAvailabilityStatus}
              capacity={trainingClass.capacity}
            />
          ))}
        </Box>






        {/* Price Summary */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: "2px solid",
            borderColor: "accent.main",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: "accent.main", mb: 2 }}>
            Price Summary
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {pricing.selectedCount} session{pricing.selectedCount !== 1 ? "s" : ""} × £{trainingClass.sessionPrice}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              £{pricing.regularPrice}
            </Typography>
          </Box>
          {pricing.isFullBlock && (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: "success.main" }}>
                Full Block Discount
              </Typography>
              <Typography variant="body2" sx={{ color: "success.main" }}>
                -£{pricing.discountAmount}
              </Typography>
            </Box>
          )}
          <Box sx={{ borderTop: "1px solid", borderColor: "divider", mt: 1.5, pt: 1.5 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight={700} sx={{ color: "accent.main" }}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} sx={{ color: "accent.main" }}>
                £{pricing.finalPrice}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Discount Coupon */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: "2px solid",
            borderColor: "accent.main",
            backgroundColor: "background.paper",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ color: "accent.main", mb: 2 }}
          >
            Apply Discount Code
          </Typography>

          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />

            <Button
              variant="contained"
              color="accent"
              disabled={!couponCode}
              onClick={() => handleApplyCoupon(couponCode)}
              sx={{
                px: 3,
                fontWeight: 600,
                borderRadius: 1.5,
                textTransform: "none",
              }}
            >
              Apply
            </Button>
          </Box>

          {appliedCoupon && (
            <Typography sx={{ color: "success.main", mt: 1 }}>
              Coupon applied successfully 🎉
            </Typography>
          )}

          {couponError && (
            <Typography sx={{ color: "error.main", mt: 1 }}>
              {couponError}
            </Typography>
          )}

          {/* Available Offers (BookMyShow style) */}
          {trainingClass?.discounts?.length > 0 && (
            <Box mt={2}>
              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                Available Offers
              </Typography>

              {trainingClass.discounts
                .filter(d => d.active && d.isRunning && !d.blockedForUsers)
                .map((discount) => {
                  const isEligible = pricing.selectedCount === discount.requiredSessions;

                  return (
                    <Box
                      key={discount.couponCode}
                      onClick={() => setCouponCode(discount.couponCode)}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 1.5,
                        border: "1px dashed",
                        borderColor: isEligible ? "success.main" : "divider",
                        backgroundColor: isEligible
                          ? "rgba(76,175,80,0.08)"
                          : "background.default",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255,193,8,0.08)",
                        },
                      }}
                    >
                      <Typography fontWeight={600} sx={{ mb: 0.5 }}>
                        🎟️ {discount.name}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Use code <b>{discount.couponCode}</b>
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: isEligible ? "success.main" : "text.secondary" }}
                      >
                        {isEligible
                          ? `✔ Eligible • Pay £${discount.discountedPrice}`
                          : `Select ${discount.requiredSessions} sessions to apply`}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          )}


        </Box>

        <Box
          sx={{
            borderRadius: "8px",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={consent}
                onChange={handleConsentChange}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I give my consent to upload and use  photo/video
              </Typography>
            }
          />
        </Box>



        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={!selected.length || !selectedKidId || bookingLoading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: selected.length && selectedKidId ? "rgba(255,193,8,1)" : "rgba(255,255,255,0.1)",
            color: selected.length && selectedKidId ? "#000" : "rgba(255,255,255,0.5)",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "1rem",
            cursor: selected.length && selectedKidId ? "pointer" : "not-allowed",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (selected.length && selectedKidId && !e.target.disabled) {
              e.target.style.backgroundColor = "rgba(255,193,8,0.8)";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (selected.length && selectedKidId) {
              e.target.style.backgroundColor = "rgba(255,193,8,1)";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          {bookingLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1, color: "#000" }} />
              Processing...
            </>
          ) : (
            `Book ${pricing.selectedCount} Session${pricing.selectedCount !== 1 ? "s" : ""} - £${pricing.finalPrice}`
          )}
        </button>
      </Box>

      {/* Description Modal */}
      {showDescription && trainingClass?.description && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
          onClick={() => setShowDescription(false)}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              p: 3,
              maxWidth: 600,
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600} sx={{ color: "accent.main" }}>
                Programme Details
              </Typography>
              <button
                onClick={() => setShowDescription(false)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                }}
              >
                ×
              </button>
            </Box>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {trainingClass.description}
            </Typography>
          </Box>
        </Box>
      )}
    </DashboardLayout>
  );
}
