// Fetch kids for parent
import api from '@/api';
import { setKidsList, setLoading, setError} from  './KidsSlice'
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const fetchKids = (parentId) => async (dispatch) => {
  try {
    const { data } = await api.get(`/kids/parent/${parentId}`);

    console.log("Server response for kids:", data);

    dispatch(setKidsList(data));
  } catch (error) {
    console.error("Error fetching kids:", error);
  }
};
  
  // Add kid
  export const addKid = (parentId, kid) => async (dispatch) => {
    try {
      console.log("post", parentId, kid);
      const { data } = await api.post(`/kids/add/${parentId}`, kid);

      console.log("Kid added:", data);

      // After adding, fetch updated kids list
      dispatch(fetchKids(parentId));
    } catch (error) {
      console.error("Error adding kid:", error);
    }
  };

  // Update kid
  export const updateKid = (kidId, kid) => async (dispatch) => {
    try {
      const { data } = await api.put(`/kids/update/${kidId}`, kid);

      console.log("Kid updated:", data);

      // Ideally refresh list after update
      // You'll need parentId in scope if you want to call fetchKids again
    } catch (error) {
      console.error("Error updating kid:", error);
    }
  };

  // Delete kid
  export const deleteKid = (kidId, parentId) => async (dispatch) => {
    try {
      await api.delete(`/kids/delete/${kidId}`);

      console.log("Kid deleted:", kidId);

      // Refresh kids list after deletion
      dispatch(fetchKids(parentId));
    } catch (error) {
      console.error("Error deleting kid:", error);
    }
  };