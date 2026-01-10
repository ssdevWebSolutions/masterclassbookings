import { Box, Typography, IconButton, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";

export default function VenueCard({ venue, onDelete }) {
  const router = useRouter();

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,193,8,0.25)",
        borderRadius: 2,
        p: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ fontSize: "1rem" }}>
        {venue.venueName}
      </Typography>

      <Typography variant="body2" sx={{ mt: 1 }}>
        {venue.addressLine1}
        {venue.town && `, ${venue.town}`}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {venue.postcode}
      </Typography>

      {venue.venueNotes && (
        <Typography
          variant="caption"
          sx={{ mt: 1, display: "block" }}
          color="text.secondary"
        >
          {venue.venueNotes}
        </Typography>
      )}

      <Divider sx={{ my: 2, opacity: 0.1 }} />

      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          color="primary"
          size="small"
          onClick={() =>
            router.push(`/admin/schedule/venue/${venue.id}/edit`)
          }
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          color="error"
          size="small"
          onClick={() => onDelete(venue.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
