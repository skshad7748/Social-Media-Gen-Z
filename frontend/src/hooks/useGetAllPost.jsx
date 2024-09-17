import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get('https://social-media-gen-z-2.onrender.com/api/v1/post/all', { withCredentials: true });
                if (res.data.success) { 
                    console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    }, [dispatch]);
};
export default useGetAllPost;