/**
 * Session Accordion Component
 * Single Responsibility: Display session selection accordion
 */

"use client";

import { Box, Typography, Checkbox, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatSlotLabel } from "utils/sessionUtils";




export default function SessionAccordion({
  slotGroup,
  slotIdx,
  selected,
  toggleSession,
  toggleAllSessionsInSlot,
  getAvailabilityStatus,
  capacity
}) {
  const selectedInSlot = slotGroup.sessions.filter(s => selected.includes(s.id));
  const availableSessions = slotGroup.sessions.filter(s => getAvailabilityStatus(s.bookedCount,capacity) !== "not-available");
  const allAvailableSelected = availableSessions.length > 0 && availableSessions.every(s => selected.includes(s.id));
  const slotLabel = formatSlotLabel(slotGroup);

  return (
    <Accordion
      key={slotIdx}
      sx={{
        mb: 2,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: allAvailableSelected ? "accent.main" : "divider",
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          margin: "0 0 16px 0",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "accent.main" }} />}
        sx={{
          px: 2,
          py: 1.5,
          "&.Mui-expanded": {
            minHeight: 48,
          },
          "& .MuiAccordionSummary-content": {
            margin: "12px 0",
            "&.Mui-expanded": {
              margin: "12px 0",
            },
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{
              color: "accent.main",
              fontSize: { xs: "0.875rem", sm: "0.938rem" },
            }}
          >
            {slotLabel}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.75rem", sm: "0.813rem" },
              ml: 2,
            }}
          >
            {selectedInSlot.length > 0 ? `${selectedInSlot.length} selected` : "No sessions selected"}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pb: 2 }}>
        {/* All Slots Option */}
        <Box
          sx={{
            p: 1.5,
            mb: 1.5,
            borderRadius: 1,
            border: "1px solid",
            borderColor: allAvailableSelected ? "accent.main" : "divider",
            backgroundColor: allAvailableSelected ? "rgba(255,193,8,0.1)" : "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(255,193,8,0.05)",
              borderColor: "accent.main",
            },
          }}
          onClick={() => toggleAllSessionsInSlot(slotGroup.sessions)}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Checkbox
              checked={allAvailableSelected}
              indeterminate={selectedInSlot.length > 0 && !allAvailableSelected}
              sx={{
                color: "accent.main",
                "&.Mui-checked": {
                  color: "accent.main",
                },
                "&.MuiCheckbox-indeterminate": {
                  color: "accent.main",
                },
              }}
            />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                color: "text.primary",
                fontSize: { xs: "0.875rem", sm: "0.938rem" },
              }}
            >
              All Slots ({availableSessions.length} available)
            </Typography>
          </Box>
        </Box>

        {/* Individual Sessions */}
        <Box display="flex" flexDirection="column" gap={1}>
          {slotGroup.sessions.map((session) => {
            const isSelected = selected.includes(session.id);
            const isAvailable = getAvailabilityStatus(session.bookedCount,capacity) !== "not-available";
            
            return (
              <Box
                key={session.id}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: isSelected ? "accent.main" : "divider",
                  backgroundColor: isSelected ? "rgba(255,193,8,0.1)" : "transparent",
                  opacity: isAvailable ? 1 : 0.5,
                  cursor: isAvailable ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: isAvailable ? "rgba(255,193,8,0.05)" : "transparent",
                    borderColor: isAvailable ? "accent.main" : "divider",
                  },
                }}
                onClick={() => {
                  if (isAvailable) {
                    toggleSession(session.id, session.bookedCount || 0);
                  }
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box flex={1}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        color: "text.primary",
                        fontSize: { xs: "0.813rem", sm: "0.875rem" },
                        mb: 0.5,
                      }}
                    >
                      {session.dateStr}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.688rem", sm: "0.75rem" },
                      }}
                    >
                      {session.bookedCount || 0}/{capacity} booked
                    </Typography>
                  </Box>
                  <Checkbox
                    checked={isSelected}
                    disabled={!isAvailable}
                    size="small"
                    sx={{
                      color: "accent.main",
                      "&.Mui-checked": {
                        color: "accent.main",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAvailable) {
                        toggleSession(session.id, session.bookedCount || 0);
                      }
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

