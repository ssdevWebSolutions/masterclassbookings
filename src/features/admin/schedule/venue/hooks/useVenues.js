import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "@/Redux/venues/venuesSlice";

export default function useVenues() {
  const dispatch = useDispatch();

  const { items: venues, loading, error } = useSelector(
    (state) => state.venues
  );

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  return {
    venues,
    loading,
    error,
    refresh: () => dispatch(fetchVenues()),
    createVenue: (payload) => dispatch(createVenue(payload)),
    updateVenue: (id, payload) => dispatch(updateVenue({ id, payload })),
    deleteVenue: (id) => dispatch(deleteVenue(id)),
  };
}
