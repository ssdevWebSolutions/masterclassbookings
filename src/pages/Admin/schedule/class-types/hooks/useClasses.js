import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
} from "@/Redux/classes/classesSlice";

export default function useClasses() {
  const dispatch = useDispatch();

  const { items: classes, loading, error } = useSelector(
    (state) => state.classes
  );

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  return {
    classes,
    loading,
    error,
    refresh: () => dispatch(fetchClasses()),
    createClass: (payload) => dispatch(createClass(payload)),
    updateClass: (id, payload) =>
      dispatch(updateClass({ id, payload })),
    deleteClass: (id) => dispatch(deleteClass(id)),
  };
}
