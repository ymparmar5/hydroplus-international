import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import myContext from "../Context/myContext";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../FireBase/FireBaseConfig";
import Loader from "../Components/Loader";
import { collection, onSnapshot, query, where,getDocs  } from "firebase/firestore";


const SignIN = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    // navigate 
    const navigate = useNavigate();

    // User Signup State 
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    /**========================================================================
    *========================================================================**/

    const userLoginFunction = async () => {
    if (userLogin.email === "" || userLogin.password === "") {
        toast.error("All Fields are required");
        return;
    }

    setLoading(true);
    try {
        const users = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);
        console.log(users,)
        const q = query(collection(fireDB, "user"), where("uid", "==", users?.user?.uid));
        const querySnapshot = await getDocs(q);

        let user = null;
        querySnapshot.forEach((doc) => {
            user = doc.data();
        });

        if (!user) {
            toast.error("User not found in Firestore");
            setLoading(false);
            return;
        }

        localStorage.setItem("users", JSON.stringify(user));
        setUserLogin({ email: "", password: "" });
        toast.success("Login Successfully");
        setLoading(false);

        if (user.role === "user") {
            navigate('/user');
        } else {
            navigate('/admin');
        }
    } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Login Failed");
    }
};

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-2">
            {loading && <Loader />}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col gap-6">
                <h3 className="text-2xl font-bold text-primary-500 text-center mb-2">Sign In</h3>
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={userLogin.email}
                    onChange={(e) => {
                        setUserLogin({
                            ...userLogin,
                            email: e.target.value
                        })
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                />
                <input
                    placeholder="Password"
                    value={userLogin.password}
                    onChange={(e) => {
                        setUserLogin({
                            ...userLogin,
                            password: e.target.value
                        })
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                />
                <button
                    type="button"
                    onClick={userLoginFunction}
                    className="w-full bg-primary-700 text-white font-semibold py-2 rounded-lg hover:bg-primary-800 transition-colors duration-200 text-lg"
                >
                    Sign In
                </button>
                <div className="text-center text-gray-600 text-sm mt-2">
                    <p>
                        Don't have an account?{' '}
                        <b>
                            <Link className="text-primary-500 hover:underline" to={'/sign-up'}>
                                Sign up
                            </Link>
                        </b>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIN;