import {
    Box,
    TextField,
    InputAdornment,
    Typography,
    Button,
    MenuItem,
    Paper,
  } from "@mui/material";
  import SearchIcon from "@mui/icons-material/Search";
  import RefreshIcon from "@mui/icons-material/Refresh";
  
  export default function ServiceRequestFilters({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    total,
    filtered,
    onRefresh,
    loading,
  }) {
    return (
      <Paper sx={{ p: 2, mb: 2, border: "1px solid rgba(255,193,8,0.5)" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { md: "flex-end" },
          }}
        >
          {/* Search */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, color: "accent.main" }}>
              Search
            </Typography>
            <TextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, or ID..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
  
          {/* Status filter */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, color: "accent.main" }}>
              Filter by Status
            </Typography>
            <TextField
              select
              fullWidth
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Requests</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </TextField>
          </Box>
  
          {/* Right side: stats + refresh */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-end" },
              flexShrink: 0,
              gap: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: "accent.main" }}>
              Showing {filtered} of {total} requests
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={onRefresh}
              disabled={loading}
              startIcon={
                <RefreshIcon fontSize="small" sx={{ transform: "scale(0.9)" }} />
              }
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }
  