import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Box,
  } from "@mui/material";
  import VisibilityIcon from "@mui/icons-material/Visibility";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import CancelIcon from "@mui/icons-material/Cancel";
  
  function getStatusChip(status) {
    if (!status) return <Chip label="Unknown" size="small" color="default" />;
  
    const map = {
      PENDING: { label: "Pending", color: "warning" },
      APPROVED: { label: "Approved", color: "success" },
      REJECTED: { label: "Rejected", color: "error" },
      IN_PROGRESS: { label: "In Progress", color: "info" },
      COMPLETED: { label: "Completed", color: "primary" },
    };
  
    const cfg = map[status] || { label: status, color: "default" };
    return <Chip label={cfg.label} color={cfg.color} size="small" />;
  }
  
  export default function ServiceRequestTable({
    rows,
    formatDate,
    onApproveClick,
    onRejectClick,
    actionLoading,
  }) {
    return (
      <Paper
        sx={{
          border: "1px solid rgba(255,193,8,0.5)",
          backgroundColor: "background.paper",
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id || Math.random()}>
                  <TableCell sx={{ color: "accent.main", fontWeight: 600 }}>
                    #{r.id ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    {`${r.firstName || ""} ${r.lastName || ""}`.trim() || "N/A"}
                  </TableCell>
                  <TableCell>{r.email || "N/A"}</TableCell>
                  <TableCell>{r.phoneNumber || "N/A"}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {r.requestType || "N/A"}
                  </TableCell>
                  <TableCell>{getStatusChip(r.status)}</TableCell>
                  <TableCell>{formatDate(r.timestamp)}</TableCell>
                  <TableCell align="right">
                    {r.status === "PENDING" ? (
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          disabled={actionLoading}
                          onClick={() => onApproveClick(r)}
                          startIcon={<CheckCircleIcon fontSize="small" />}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={actionLoading}
                          onClick={() => onRejectClick(r)}
                          startIcon={<CancelIcon fontSize="small" />}
                        >
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<VisibilityIcon fontSize="small" />}
                      >
                        Closed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
  