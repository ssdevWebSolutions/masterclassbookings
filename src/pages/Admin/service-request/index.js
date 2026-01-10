"use client";

import { Container, Snackbar, Alert } from "@mui/material";
import useServiceRequests from "./hooks/useServiceRequests";
import ServiceRequestFilters from "./components/ServiceRequestFilters";
import ServiceRequestTable from "./components/ServiceRequestTable";
import ApproveModal from "./components/ApproveModal";
import RejectModal from "./components/RejectModal";
import LoadingState from "../../../sharedComponents/LoadingState";
import EmptyState from "../../../sharedComponents/EmptyState";

import AdminLayout from "../../adminlayouts/AdminLayout";

export default function ServiceRequestPage() {
  const {
    filtered,
    requests,
    loading,
    error,
    success,
    setError,
    setSuccess,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    loadRequests,
    openApprove,
    openReject,
    confirmApprove,
    confirmReject,
    closeModals,
    approveOpen,
    rejectOpen,
    selectedRequest,
    actionLoading,
    formatDate,
  } = useServiceRequests();

  return <>
  <AdminLayout activeNav="ServiceRequest">
     <Container sx={{ py: 3 }}>
      <ServiceRequestFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        total={requests.length}
        filtered={filtered.length}
        onRefresh={loadRequests}
        loading={loading}
      />

      {loading ? (
        <LoadingState message="Loading service requests..." />
      ) : filtered.length === 0 ? (
        <EmptyState message="No service requests found" />
      ) : (
        <ServiceRequestTable
          rows={filtered}
          formatDate={formatDate}
          onApproveClick={openApprove}
          onRejectClick={openReject}
          actionLoading={actionLoading}
        />
      )}

      <ApproveModal
        open={approveOpen}
        onClose={closeModals}
        onConfirm={confirmApprove}
        loading={actionLoading}
        request={selectedRequest}
      />

      <RejectModal
        open={rejectOpen}
        onClose={closeModals}
        onConfirm={confirmReject}
        loading={actionLoading}
        request={selectedRequest}
      />

      <Snackbar
        open={!!success}
        autoHideDuration={5000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={8000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
    </AdminLayout>
  </>
   
}
