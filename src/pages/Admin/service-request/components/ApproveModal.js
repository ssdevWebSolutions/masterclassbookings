import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
  } from "@mui/material";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import InfoIcon from "@mui/icons-material/Info";
  
  export default function ApproveModal({
    open,
    onClose,
    onConfirm,
    loading,
    request,
  }) {
    return (
      <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleIcon color="success" />
          <Typography variant="h6">Approve Request</Typography>
        </DialogTitle>
  
        <DialogContent dividers>
          <Typography sx={{ mb: 1 }}>
            Are you sure you want to approve this service request?
          </Typography>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
            <InfoIcon fontSize="small" color="warning" />
            <Typography variant="body2" color="warning.main">
              This will create a user account and send an approval email with a
              default password.
            </Typography>
          </Box>
  
          {request && (
            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 1,
                border: "1px solid rgba(255,193,8,0.7)",
                backgroundColor: "background.default",
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>ID:</strong> #{request.id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Name:</strong> {request.firstName} {request.lastName}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {request.email}
              </Typography>
            </Box>
          )}
        </DialogContent>
  
        <DialogActions>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={loading}
            color="success"
          >
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Approving...
              </>
            ) : (
              "Approve"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  