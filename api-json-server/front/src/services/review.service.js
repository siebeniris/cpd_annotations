import axios from 'axios';

export default {
    getAll: async () => {
        let res = await axios.get(`http://localhost:9000/`);
        return res.data || [];
    },
    // add: async (name, lastName) => {
    //     let res = await axios.post(`/api/review/`, { name, lastName })
    //     return res.data || {};
    // },
    getReview: async (name) => {
        let res = await axios.get(`http://localhost:9000/`+name)
        return res.data || {};
    },
    // delete: async (id) => {
    //     let res = await axios.delete(`/api/user/${id}`);
    //     return res.data || [];
    // }
}