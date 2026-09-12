import axios from "axios";

const API = 'https://restuarant-backend-95ir.onrender.com/api/menu-items'

export const getMenuItems = () => {
    return axios.get(API)
}
export const createMenuItem = (category) => {
    return axios.post(API, category)
}
export const updateMenuItem = (id, category) => {
    return axios.put(`${API}/${id}`, category)
}
export const deleteMenuItem = (id) => {
    return axios.delete(`${API}/${id}`)
}