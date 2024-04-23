import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserCourses } from "../../redux/slices/auth/authSlice";
import { Bounce, toast } from "react-toastify";

const useCourse = () => {
  const BASE_URL = import.meta.env.VITE_REACT_APP_URL;
  const CATALOG = import.meta.env.VITE_REACT_APP_CATALOG;
  const COURSES_BY_USER = import.meta.env.VITE_REACT_APP_COURSES_BY_USER;
  const COURSE_BY_ID = import.meta.env.VITE_REACT_APP_COURSE_BY_ID;
  const CATEGORIAS = import.meta.env.VITE_REACT_APP_CREAR_CATEGORIAS;

  const dispatch = useDispatch();

  const getCatalogCourses = async () => {
    const RUTA = `${BASE_URL}${CATALOG}`;
    try {
      const { data } = await axios(RUTA);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const coursesByUser = async () => {
    const RUTA = `${BASE_URL}${COURSES_BY_USER}`;
    const token = localStorage.getItem("jwt");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios(RUTA, config);

      dispatch(setUserCourses(data));
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const postEnrollment = async (id) => {
    const RUTA = `${BASE_URL}${COURSES_BY_USER}${`?courseId=${id}`}`;
    const token = localStorage.getItem("jwt");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(RUTA, id, config);

      if (data) {
        toast.success("Se ha inscrito correctamente", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        dispatch(setUserCourses(data.course));

        return data;
      }
    } catch (error) {
      throw toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const courseById = async (id) => {
    const RUTA = `${BASE_URL}${COURSE_BY_ID}/${id}`;
    const token = localStorage.getItem("jwt");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios(RUTA, config);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getCategorias = async () => {
    const RUTA = `${BASE_URL}${CATEGORIAS}`;
    try {
      const { data } = await axios(RUTA);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    getCatalogCourses,
    coursesByUser,
    courseById,
    getCategorias,
    postEnrollment,
  };
};

export default useCourse;
