import axios from "axios";

// 建立一個 Axios 實例，設定好 API 的基本 URL
const api = axios.create({
  baseURL: "http://localhost:8000/", // 你的 FastAPI 後端服務位址
  timeout: 5000, // 請求超時時間（毫秒）
  headers: {
    "Content-Type": "application/json",
  },
});

// 建立一個函式，用來獲取資料
export const getData = async () => {
  try {
    const response = await api.get("/data");
    return response.data;
  } catch (error) {
    // 這裡可以處理 API 錯誤，並拋出錯誤
    console.error("API 請求失敗:", error);
    throw error;
  }
};
