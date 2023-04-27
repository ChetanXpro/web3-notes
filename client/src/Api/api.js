import axios from "axios";

const API_BASE_URL = "http://provider.d3akash.cloud:31682";

export const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

export const apiPrivateInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
  },
});

export const login = async (payload) => {
  try {
    const request = await apiInstance.post("/auth", payload);
    return request?.data;
  } catch (err) {
    const error = err;
    return Promise.reject(error.response);
  }
};

export const walletLogin = async (payload) => {
  try {
    const request = await apiInstance.post("/auth/wallet", payload);
    console.log(request.data);
    return request?.data;
  } catch (err) {
    console.log(err);
    const error = err;
    return Promise.reject(error.response);
  }
};

export const signup = async (payload) => {
  try {
    const request = await apiInstance.post("/user", payload);

    return request?.data;
  } catch (err) {
    const error = err;
    return Promise.reject(error.response);
  }
};

export const getUser = async () => {
  try {
    const request = await apiPrivateInstance.get("/user/getUser");
    return request?.data;
  } catch (err) {
    const error = err;
    return Promise.reject(error.response);
  }
};

export const getUniversityList = async (payload) => {
  try {
    const request = await apiInstance.get("/public/university", payload);
    return request?.data?.universityName;
  } catch (err) {
    const error = err;
    return Promise.reject(error.response);
  }
};
export const getUniversityDetails = async (selectedUniversity) => {
  try {
    const request = await apiInstance.post("/public/university", {
      selectedUniversity,
    });
    return request?.data;
  } catch (err) {
    const error = err;
    return Promise.reject(error.response);
  }
};
export const searchNotes = async (payload) => {
  try {
    const request = await apiInstance.post("/public/search", {
      selectedUniversity: payload.selectedUniversity,
      selectedCourse: payload.selectedCourse,
      selectedSemester: payload.selectedSemester,
      selectedSubject: payload.selectedSubject,
    });
    return request?.data;
  } catch (err) {
    const error = err;
    return Promise.reject(error.response);
  }
};
