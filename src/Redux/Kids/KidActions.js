// Fetch kids for parent
import { setKidsList, setLoading, setError} from  './KidsSlice'
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const fetchKids = (parentId, token) => async(dispatch) => {
    try {
        console.log(token,"tpop");
      const response = await fetch(`${BASE_URL}/kids/parent/${parentId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch kids:", errorText);
        return;
      }
  
      const result = await response.json();
      console.log("Server response for kids:", result);
  
      dispatch(setKidsList(result));
    } catch (error) {
      console.error("Error fetching kids:", error);
    }
  };
  
  // Add kid
  export const addKid = (parentId, kid, token) => async(dispatch) => {
    try {
        console.log("post",parentId, kid, token);
      const response = await fetch(`${BASE_URL}/kids/add/${parentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(kid),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to add kid:", errorText);
        return;
      }
  
      
      const result = await response;
      console.log("Kid added:", result);
  
      // After adding, fetch updated kids list
      dispatch(fetchKids(parentId, token));
    } catch (error) {
      console.error("Error adding kid:", error);
    }
  };
  
  // Update kid
  export const updateKid = (kidId, kid, token) => async(dispatch) => {
    try {
      const response = await fetch(`${BASE_URL}/kids/update/${kidId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(kid),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update kid:", errorText);
        return;
      }
  
      const result = await response;
      console.log("Kid updated:", result);
  
      // Ideally refresh list after update
      // You'll need parentId in scope if you want to call fetchKids again
    } catch (error) {
      console.error("Error updating kid:", error);
    }
  };
  
  // Delete kid
  export const deleteKid = (kidId, parentId, token) => async(dispatch) => {
    try {
      const response = await fetch(`${BASE_URL}/kids/delete/${kidId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete kid:", errorText);
        return;
      }
  
      console.log("Kid deleted:", kidId);
  
      // Refresh kids list after deletion
      dispatch(fetchKids(parentId, token));
    } catch (error) {
      console.error("Error deleting kid:", error);
    }
  };