import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../Context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, fireDB } from "../FireBase/FireBaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";

const Signup = () => {

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    // navigate 
    const navigate = useNavigate();

    // User Signup State 
    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    /**========================================================================
     *                          User Signup Function 
    *========================================================================**/

    const userSignupFunction = async () => {
        // validation 
        if (userSignup.name === "" || userSignup.email === "" || userSignup.password === "") {
            toast.error("All Fields are required");
            return;
        }

        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);

            // create user object
            const user = {
                name: userSignup.name,
                email: users.user.email,
                uid: users.user.uid,
                role: userSignup.role,
                time: Timestamp.now(),
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            }

            // create user Reference
            const userReference = collection(fireDB, "user")

            // Add User Detail
            await addDoc(userReference, user);

            setUserSignup({
                name: "",
                email: "",
                password: "",
                role: "user"
            });

            toast.success("Signup Successfully");

            setLoading(false);
            navigate('/sign-in');
        } catch (error) {
            console.error(error);
            toast.error("Signup Failed. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-2">
            {loading && <Loader />}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col gap-6">
                <h3 className="text-2xl font-bold text-primary-500 text-center mb-2">Sign Up</h3>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={userSignup.name}
                    onChange={(e) => {
                        setUserSignup({
                            ...userSignup,
                            name: e.target.value
                        })
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={userSignup.email}
                    onChange={(e) => {
                        setUserSignup({
                            ...userSignup,
                            email: e.target.value
                        })
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                />
                <input
                    placeholder="Password"
                    value={userSignup.password}
                    onChange={(e) => {
                        setUserSignup({
                            ...userSignup,
                            password: e.target.value
                        })
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                />
                <button
                    type="button"
                    onClick={userSignupFunction}
                    className="w-full bg-primary-700 text-white font-semibold py-2 rounded-lg hover:bg-primary-800 transition-colors duration-200 text-lg"
                >
                    Sign up
                </button>
                <div className="text-center text-gray-600 text-sm mt-2">
                    <p>
                        Already have an account?{' '}
                        <b>
                            <Link className="text-primary-500 hover:underline" to={'/sign-in'}>
                                Sign-in
                            </Link>
                        </b>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
