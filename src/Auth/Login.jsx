// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
// } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   serverTimestamp,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { auth, db, googleProvider } from "../firebase";
// import toast from "react-hot-toast";
// import {
//   FaCar,
//   FaUserCog,
//   FaTools,
//   FaUsers,
//   FaGoogle,
// } from "react-icons/fa";
// import { MdEmail, MdLock } from "react-icons/md";
// import { Eye, EyeOff } from "lucide-react";


// const Login = () => {
//   const [identifier, setIdentifier] = useState(""); // email or username
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   // 🔹 Redirect based on role using normalized role
//   const redirectByRole = (role) => {
//     const normalizedRole = normalizeRole(role);
//     const route = getRouteForRole(normalizedRole);
//     const displayName = getRoleDisplayName(normalizedRole);
    
//     // Store role in localStorage for persistent access
//     localStorage.setItem("userRole", normalizedRole);
//     sessionStorage.setItem("userRole", normalizedRole);
    
//     // Show toast message and then navigate
//     toast.success(`Welcome, ${displayName}!`);
    
//     // Use setTimeout to ensure toast is visible before navigation
//     setTimeout(() => {
//       navigate(route);
//     }, 500);
//   };

//   // 🔹 Get email using username
//   const getEmailFromUsername = async (username) => {
//     const q = query(
//       collection(db, "users"),
//       where("username", "==", username)
//     );

//     const snapshot = await getDocs(q);

//     if (snapshot.empty) {
//       throw new Error("Username not found in our system");
//     }

//     return snapshot.docs[0].data().email;
//   };

//   // 🔹 Email / Username Login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);

//     try {
//       let emailToLogin = identifier;

//       // If not an email, treat as username
//       if (!identifier.includes("@")) {
//         emailToLogin = await getEmailFromUsername(identifier);
//       }

//       const res = await signInWithEmailAndPassword(
//         auth,
//         emailToLogin,
//         password
//       );

//       const snap = await getDoc(doc(db, "users", res.user.uid));

//       if (snap.exists()) {
//         const userData = snap.data();
//         const role = userData.role || "patient";
        
//         // Update Firebase Auth displayName if not already set
//         if (!res.user.displayName && userData.username) {
//           await res.user.updateProfile({
//             displayName: userData.username,
//           });
//         }
        
//         redirectByRole(role);
//       } else {
//         // User authenticated but no profile found - default to patient
//         console.warn("User profile not found, assigning patient role");
//         redirectByRole("patient");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
      
//       // Provide user-friendly error messages
//       if (err.code === "auth/user-not-found") {
//         toast.error("User account not found. Please check your credentials.");
//       } else if (err.code === "auth/wrong-password") {
//         toast.error("Incorrect password. Please try again.");
//       } else if (err.message.includes("Username not found")) {
//         toast.error("Username not found. Please use your email or create an account.");
//       } else {
//         toast.error(err.message || "Login failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Google Login
//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     try {
//       const res = await signInWithPopup(auth, googleProvider);

//       const userRef = doc(db, "users", res.user.uid);
//       const snap = await getDoc(userRef);

//       let role = "patient";

//       if (!snap.exists()) {
//         // Create new user with patient role
//         const username = res.user.displayName || res.user.email.split("@")[0];
        
//         await setDoc(userRef, {
//           uid: res.user.uid,
//           email: res.user.email,
//           username: username,
//           displayName: username,
//           role: "user", // ✅ Lowercase
//           photoURL: res.user.photoURL || null,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//           isActive: true,
//         });
//       } else {
//         const userData = snap.data();
//         role = userData.role || "patient";
        
//         // Update Firebase Auth displayName if not already set
//         if (!res.user.displayName && userData.username) {
//           await res.user.updateProfile({
//             displayName: userData.username,
//           });
//         }
//       }

//       redirectByRole(role);
//     } catch (err) {
//       console.error("Google login error:", err);
//       if (err.code !== "auth/popup-closed-by-user") {
//         toast.error("Google login failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//  return (
//   <div className="min-h-screen flex items-center justify-center
//                   bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

//     <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2
//                     rounded-3xl overflow-hidden shadow-2xl
//                     bg-slate-900/80 backdrop-blur-xl">

//       {/* LEFT – BRAND */}
//       <div className="hidden md:flex flex-col justify-center px-14
//                       bg-gradient-to-br from-orange-500 via-orange-600 to-red-500
//                       text-white relative">

//         <div className="absolute inset-0 bg-black/20" />

//         <div className="relative z-10">
//           <div className="flex items-center gap-3 mb-6">
//             <FaCar className="text-4xl" />
//             <h1 className="text-3xl font-extrabold">AutoCare Pro</h1>
//           </div>

//           <p className="text-orange-100 text-lg">
//             Complete dashboard for car service & maintenance.
//           </p>

//           <ul className="mt-10 space-y-3 text-sm">
//             <li className="flex items-center gap-2">
//               <FaTools /> Service & repair management
//             </li>
//             <li className="flex items-center gap-2">
//               <FaUsers /> Customer & vehicle tracking
//             </li>
//             <li className="flex items-center gap-2">
//               <FaUserCog /> Staff & admin control
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* RIGHT – FORM */}
//       <div className="flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-md text-white">

//           {/* Icon */}
//           <div className="flex justify-center mb-6">
//             <div className="w-16 h-16 rounded-full
//                             bg-gradient-to-br from-orange-500 to-red-500
//                             flex items-center justify-center
//                             shadow-lg">
//               <FaCar className="text-3xl text-white" />
//             </div>
//           </div>

//           <h2 className="text-3xl font-bold text-center">
//             Car Service Login
//           </h2>

//           <p className="text-center text-slate-400 mt-2 mb-8">
//             Sign in to manage vehicles & bookings
//           </p>

//           <form onSubmit={handleLogin} className="space-y-5">

//             {/* Email / Username */}
//             <div className="relative">
//               <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2
//                                  text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Email or Username"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 disabled={loading}
//                 required
//                 className="w-full pl-11 p-3 rounded-xl bg-slate-800
//                            border border-slate-700 text-white
//                            focus:ring-2 focus:ring-orange-500
//                            outline-none transition"
//               />
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <MdLock className="absolute left-4 top-1/2 -translate-y-1/2
//                                 text-slate-400" />

//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//                 required
//                 className="w-full pl-11 pr-12 p-3 rounded-xl bg-slate-800
//                            border border-slate-700 text-white
//                            focus:ring-2 focus:ring-orange-500
//                            outline-none transition"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-4 flex items-center
//                            text-slate-400 hover:text-orange-400 transition"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-xl font-semibold text-white
//                          bg-gradient-to-r from-orange-500 to-red-500
//                          hover:scale-[1.03] hover:shadow-xl
//                          transition transform disabled:opacity-50"
//             >
//               Sign In
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="my-6 flex items-center gap-3">
//             <div className="flex-1 h-px bg-slate-700" />
//             <span className="text-sm text-slate-400">OR</span>
//             <div className="flex-1 h-px bg-slate-700" />
//           </div>

//           {/* Google */}
//           <button
//             onClick={handleGoogleLogin}
//             disabled={loading}
//             className="w-full py-3 rounded-xl border border-slate-700
//                        flex items-center justify-center gap-3
//                        hover:bg-slate-800 transition"
//           >
//             <FaGoogle className="text-lg text-red-500" />
//             <span className="font-medium text-slate-300">
//               Continue with Google
//             </span>
//           </button>

//           {/* Footer */}
//           <p className="text-sm mt-6 text-center text-slate-400">
//             New user?{" "}
//             <Link
//               to="/register"
//               className="text-orange-400 font-semibold hover:underline"
//             >
//               Create account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// };

// export default Login;


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

      const userRef = doc(db, "users", res.user.uid);
      const snap = await getDoc(userRef);

      let role = "user";

      if (!snap.exists()) {
        await setDoc(userRef, {
          email: res.user.email,
          username: res.user.displayName || "",
          role: "user",
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
