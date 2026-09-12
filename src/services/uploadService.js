import axios from "axios";

const API = "https://restuarant-backend-95ir.onrender.com/api/uploads";

export const uploadImage = (file) => {
  const formData = new FormData();

  formData.append("image", file);

  return axios.post(API, formData);
};