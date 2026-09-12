import axios from "axios";

const API = 'https://restuarant-backend-95ir.onrender.com/api/categories'

export const getCategories = () => {
    return axios.get(API)
}
export const createCategory = (category) => {
    return axios.post(API, category)
}
export const updateCategory = (id, category) => {
    return axios.put(`${API}/${id}`, category)
}
export const deleteCategory = (id) => {
    return axios.delete(`${API}/${id}`)
}