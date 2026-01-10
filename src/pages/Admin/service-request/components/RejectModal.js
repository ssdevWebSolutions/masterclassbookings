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
  import CancelIcon from "@mui/icons-material/Cancel";
  import WarningAmberIcon from "@mui/icons-material/WarningAmber";
  
  export default function RejectModal({
    open,
    onClose,
    onConfirm,
    loading,
    request,
  }) {
    return (
      <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CancelIcon color="error" />
          <Typography variant="h6">Reject Request</Typography>
        </DialogTitle>
  
        <DialogContent dividers>
          <Typography sx={{ mb: 1 }}>
            Are you sure you want to reject this service request?
          </Typography>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
            <WarningAmberIcon fontSize="small" color="error" />
            <Typography variant="body2" color="error.main">
              This action will update the request status. The user will be notified
              of the rejection.
            </Typography>
          </Box>
  
          {request && (
            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 1,
                border: "1px solid rgba(220,53,69,0.7)",
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
            color="error"
          >
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Rejecting...
              </>
            ) : (
              "Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  