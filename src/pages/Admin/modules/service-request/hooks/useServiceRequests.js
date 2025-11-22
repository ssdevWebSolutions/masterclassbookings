import { useEffect, useState } from "react";
import {
  fetchServiceRequestsApi,
  approveServiceRequestApi,
  rejectServiceRequestApi,
} from "../api/serviceRequest.api";

export default function useServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchServiceRequestsApi();
      setRequests(data);
      setFiltered(data);
    } catch (e) {
      setRequests([]);
      setFiltered([]);
      setError(e.message || "Unable to load service requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // filter
  useEffect(() => {
    let list = [...requests];

    if (statusFilter !== "ALL") {
      list = list.filter((r) => r?.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((r) => {
        const firstName = r?.firstName?.toLowerCase() || "";
        const lastName = r?.lastName?.toLowerCase() || "";
        const email = r?.email?.toLowerCase() || "";
        const phoneNumber = r?.phoneNumber || "";
        const id = r?.id?.toString() || "";

        return (
          firstName.includes(q) ||
          lastName.includes(q) ||
          email.includes(q) ||
          phoneNumber.includes(q) ||
          id.includes(q)
        );
      });
    }

    setFiltered(list);
  }, [statusFilter, search, requests]);

  // auto-clear messages
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (error && !loading) {
      const t = setTimeout(() => setError(""), 8000);
      return () => clearTimeout(t);
    }
  }, [error, loading]);

  const openApprove = (req) => {
    setSelectedRequest(req);
    setApproveOpen(true);
  };

  const openReject = (req) => {
    setSelectedRequest(req);
    setRejectOpen(true);
  };

  const closeModals = () => {
    setApproveOpen(false);
    setRejectOpen(false);
    setSelectedRequest(null);
  };

  const confirmApprove = async () => {
    if (!selectedRequest?.id) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      await approveServiceRequestApi(selectedRequest.id);
      setSuccess(
        `Request #${selectedRequest.id} approved successfully! User account created and email sent.`
      );
      closeModals();
      await loadRequests();
    } catch (e) {
      setError(
        e.message || "Unable to approve request. Please try again later."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedRequest?.id) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      await rejectServiceRequestApi(selectedRequest.id);
      setSuccess(`Request #${selectedRequest.id} has been rejected.`);
      closeModals();
      await loadRequests();
    } catch (e) {
      setError(
        e.message || "Unable to reject request. Please try again later."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  return {
    // data
    requests,
    filtered,
    loading,
    error,
    success,

    // filters
    statusFilter,
    setStatusFilter,
    search,
    setSearch,

    // actions
    loadRequests,
    openApprove,
    openReject,
    confirmApprove,
    confirmReject,
    closeModals,

    // modal state
    selectedRequest,
    approveOpen,
    rejectOpen,
    actionLoading,

    // helpers
    formatDate,
    setError,
    setSuccess,
  };
}
