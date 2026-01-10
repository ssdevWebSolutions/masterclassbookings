"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchTerms,
  fetchTermById,
  createTerm,
  updateTerm,
  deleteTerm,
  clearSelectedTerm,
} from "../../../../../Redux/terms/termsSlice";

export default function useTerms() {
  const dispatch = useDispatch();

  const {
    list = [],
    selected = null,
    loading = false,
    error = null,
  } = useSelector((state) => state.terms || {});

  return {
    // state
    terms: list,
    selectedTerm: selected,
    loading,
    error,

    // actions
    fetchTerms: () => dispatch(fetchTerms()),
    fetchTermById: (id) => dispatch(fetchTermById(id)),
    createTerm: (payload) => dispatch(createTerm(payload)),
    updateTerm: (id, payload) =>
      dispatch(updateTerm({ id, payload })),
    deleteTerm: (id) => dispatch(deleteTerm(id)),
    clearSelectedTerm: () => dispatch(clearSelectedTerm()),
  };
}
