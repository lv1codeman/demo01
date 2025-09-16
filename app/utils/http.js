import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getData = async () => {
  try {
    const response = await api.get("/classdeptshort");
    return response.data;
  } catch (error) {
    console.error("API 請求失敗:", error);
    throw error;
  }
};

export const getDepData = async () => {
  try {
    const response = await api.get("/deptlist");
    return response.data;
  } catch (error) {
    console.error("API 請求失敗:", error);
    throw error;
  }
};
