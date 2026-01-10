import {
    Box,
    Typography,
    IconButton,
    Divider,
    Chip,
    Stack,
    Tooltip,
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import EventAvailableIcon from "@mui/icons-material/EventAvailable";
  import { useRouter } from "next/router";
  
  export default function ClassCard({ classItem, onDelete }) {
    const router = useRouter();
  
    const ageFromLabel = `${classItem.ageFrom.years}y ${classItem.ageFrom.months}m`;
    const ageToLabel = `${classItem.ageTo.years}y ${classItem.ageTo.months}m`;
  
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          border: "1px solid rgba(255,193,8,0.18)",
          backgroundColor: "background.paper",
          p: 2,
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "rgba(255,193,8,0.45)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {/* HEADER */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, lineHeight: 1.3 }}
          >
            {classItem.className}
          </Typography>
  
          <Chip
            label={classItem.activity}
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
  
        {/* DESCRIPTION */}
        {classItem.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, flexGrow: 1, lineHeight: 1.5 }}
          >
            {classItem.description}
          </Typography>
        )}
  
        {/* META */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1.5 }}
        >
          Age group: <strong>{ageFromLabel}</strong> –{" "}
          <strong>{ageToLabel}</strong>
        </Typography>
  
        <Divider sx={{ my: 2, opacity: 0.12 }} />
  
        {/* ACTIONS */}
        <Stack direction="row" spacing={1}>
          {/* SCHEDULE */}
          <Tooltip title="Schedule class">
            <IconButton
              size="small"
              color="success"
              onClick={() =>
                router.push(
                  `/admin/schedule/classes/${classItem.id}/schedule`
                )
              }
            >
              <EventAvailableIcon fontSize="small" />
            </IconButton>
          </Tooltip>
  
          {/* EDIT */}
          <Tooltip title="Edit class">
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                router.push(
                  `/admin/schedule/class-types/${classItem.id}/edit`
                )
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
  
          {/* DELETE */}
          <Tooltip title="Delete class">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(classItem.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    );
  }
  