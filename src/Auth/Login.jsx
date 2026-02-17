import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { FaCar, FaGoogle, FaTools } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🔹 Redirect by role
  const redirectByRole = (role) => {
    role === "admin" ? navigate("/admin") : navigate("/");
  };

  // 🔹 Find email by username
  const getEmailFromUsername = async (username) => {
    const q = query(
      collection(db, "users"),
      where("username", "==", username)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("Username not found");
    }

    return snapshot.docs[0].data().email;
  };

  // 🔹 Email / Username Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      let emailToLogin = identifier;

      // If not email → treat as username
      if (!identifier.includes("@")) {
        emailToLogin = await getEmailFromUsername(identifier);
      }

      const res = await signInWithEmailAndPassword(
        auth,
        emailToLogin,
        password
      );

      const snap = await getDoc(doc(db, "users", res.user.uid));

      redirectByRole(snap.exists() ? snap.data().role : "user");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

 // 🔹 Google Login
const handleGoogleLogin = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);

    const uid = res.user.uid;
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    let role = "user";

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: uid, // ✅ store uid inside document
        email: res.user.email || "",
        username: res.user.displayName || "",
        role: "user",
        photoURL: res.user.photoURL || "", // optional but useful
        createdAt: serverTimestamp(),
      });
    } else {
      role = snap.data().role;
    }

    redirectByRole(role);
  } catch (err) {
    toast.error(err.message);
  }
};


return (
  <div className="min-h-screen flex items-center justify-center
                  bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2
                    rounded-3xl overflow-hidden shadow-2xl
                    bg-slate-900/80 backdrop-blur-xl">

      {/* LEFT – BRAND */}
      <div className="hidden md:flex flex-col justify-center px-14
                      bg-gradient-to-br from-orange-500 via-orange-600 to-red-500
                      text-white relative">

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <FaCar className="text-4xl" />
            <h1 className="text-3xl font-extrabold">AutoCare Pro</h1>
          </div>

          <p className="text-orange-100 text-lg leading-relaxed">
            Smart dashboard for car service, repair & maintenance management.
          </p>

          <ul className="mt-10 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaTools /> Manage services & repairs
            </li>
            <li className="flex items-center gap-2">
              <FaTools /> Track vehicles & bookings
            </li>
            <li className="flex items-center gap-2">
              <FaTools /> Admin & staff control
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT – FORM */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-white">

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full
                            bg-gradient-to-br from-orange-500 to-red-500
                            flex items-center justify-center shadow-lg">
              <FaCar className="text-3xl text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center">
            Car Service Login
          </h2>

          <p className="text-center text-slate-400 mt-2 mb-8">
            Sign in to manage vehicles & service bookings
          </p>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL / USERNAME */}
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2
                                 text-slate-400" />
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-11 p-3 rounded-xl bg-slate-800
                           border border-slate-700 text-white
                           focus:ring-2 focus:ring-orange-500
                           outline-none transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2
                                text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 p-3 rounded-xl bg-slate-800
                           border border-slate-700 text-white
                           focus:ring-2 focus:ring-orange-500
                           outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center
                           text-slate-400 hover:text-orange-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* LOGIN */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-orange-500 to-red-500
                         hover:scale-[1.03] hover:shadow-xl transition
                         disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* OR */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-sm text-slate-400">OR</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-slate-700
                       flex items-center justify-center gap-3
                       hover:bg-slate-800 transition"
          >
            <FaGoogle className="text-red-500 text-lg" />
            <span className="font-medium text-slate-300">
              Continue with Google
            </span>
          </button>

          {/* FOOTER */}
          <p className="text-sm mt-6 text-center text-slate-400">
            New user?{" "}
            <Link
              to="/register"
              className="text-orange-400 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);

};

export default Login;
