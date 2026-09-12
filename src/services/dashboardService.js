import axios from "axios";

const API = 'https://restuarant-backend-95ir.onrender.com/api/dashboard'

export const getStats = () => {
    return axios.get(API)
}