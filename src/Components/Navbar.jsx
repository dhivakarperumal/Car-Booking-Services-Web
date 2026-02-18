import React, { useState } from "react";
import PageContainer from "./PageContainer";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "lucide-react";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { setDoc } from "firebase/firestore";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setUserData(null);
    setShowMenu(false);
    navigate("/login");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoadingUser(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // 🔹 If user exists in Firestore
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
      // 🔹 FIRST TIME GOOGLE LOGIN → SAVE USER
      else {
        const newUserData = {
          uid: user.uid,
          username: user.displayName || "",
          displayName: user.displayName || "",
          email: user.email,
          photoURL: user.photoURL || "",
          role: "user",
          createdAt: new Date(),
        };

        await setDoc(userRef, newUserData);
        setUserData(newUserData);
      }

      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);
  const links = [
    { label: "HOME", path: "/" },
    { label: "SERVICES", path: "/services" },
    { label: "PRICING", path: "/pricing" },
    { label: "PRODUCTS", path: "/products" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT US", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50">

      <div className="bg-black backdrop-blur-md border-b border-sky-400/20">
        <PageContainer>
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src="/logo.png"
                alt="DucatiBox Logo"
                className="h-12 w-auto object-contain transition
                           group-hover:scale-105
                           drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]"
              />
            </div>

            {/* DESKTOP MENU */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`relative cursor-pointer text-[14px] font-bold tracking-[0.2em]
    transition-all duration-300
    ${location.pathname === item.path
                      ? "text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                      : "text-gray-300 hover:text-sky-400 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                    }
    after:absolute after:left-1/2 after:-bottom-2
    after:h-[2px] after:-translate-x-1/2
    after:bg-gradient-to-r after:from-sky-400 after:to-cyan-300
    after:transition-all after:duration-300
    ${location.pathname === item.path
                      ? "after:w-full"
                      : "after:w-0 hover:after:w-full"
                    }
  `}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:block">
              <button
                onClick={() => navigate("/bookservice")}
                className="relative px-6 py-2.5 cursor-pointer rounded-md font-bold text-xs tracking-[0.2em]
                           text-sky-400 border border-sky-400/60
                           transition-all duration-300
                           hover:text-black hover:bg-sky-400
                           hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]"
              >
                BOOK SERVICE
              </button>
            </div>

            {/* USER ICON / AVATAR */}
            <div className="relative hidden md:flex items-center ml-6">
              {!loadingUser && userData && (
                <>
                  {/* Avatar */}
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="h-9 w-9 rounded-full flex items-center justify-center
        bg-gradient-to-br from-sky-500 to-cyan-400
        text-black font-bold text-sm
        shadow-[0_0_15px_rgba(56,189,248,0.6)]"
                    title={userData.username}
                  >
                    {(
                      userData.username ||
                      userData.displayName ||
                      userData.email
                    )?.charAt(0).toUpperCase()}
                  </button>

                  {/* Dropdown */}
                  {showMenu && (
                    <div className="absolute right-0 top-12 w-40 rounded-xl
        bg-black border border-sky-400/20 backdrop-blur
        shadow-xl overflow-hidden z-50">

                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-300
            hover:bg-sky-400/10 hover:text-sky-400"
                      >
                        Account
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-400
            hover:bg-red-400/10"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}

              {!loadingUser && !userData && (
                <button
                  onClick={() => navigate("/login")}
                  className="text-sky-400 hover:text-white transition"
                >
                  <User size={22} />
                </button>
              )}
            </div>

            {/* HAMBURGER */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col gap-1"
            >
              <span className={`w-6 h-[2px] bg-white transition ${isOpen && "rotate-45 translate-y-2"}`} />
              <span className={`w-6 h-[2px] bg-white transition ${isOpen && "opacity-0"}`} />
              <span className={`w-6 h-[2px] bg-white transition ${isOpen && "-rotate-45 -translate-y-2"}`} />
            </button>
          </div>
        </PageContainer>
      </div>

      <div className="h-[0.5px] bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-pulse" />


      {/* MOBILE MENU */}
      <div
        className={`md:hidden bg-black/95 backdrop-blur transition-all duration-300 overflow-hidden
        ${isOpen ? "max-h-[420px] border-t border-sky-400/20" : "max-h-0"}`}
      >
        <nav className="flex flex-col px-6 py-6 gap-6">
          {/* USER – MOBILE */}
          {!loadingUser && (
            <button
              onClick={() => {
                navigate(userData ? "/profile" : "/login");
                setIsOpen(false);
              }}
              className="flex items-center gap-3 text-left"
            >
              <div className="h-9 w-9 rounded-full flex items-center justify-center
      bg-gradient-to-br from-sky-500 to-cyan-400
      text-black font-bold text-sm">
                {userData ? (
                  userData.username ||
                  userData.displayName ||
                  userData.email
                )?.charAt(0).toUpperCase() : <User size={18} />}
              </div>

              <span className="text-sm text-gray-300 tracking-widest">
                {userData ? userData.username : "LOGIN"}
              </span>
            </button>
          )}
          {links.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`text-xs font-bold tracking-[0.2em] text-left transition
    ${location.pathname === item.path
                  ? "text-sky-400 pl-3 border-l-2 border-sky-400"
                  : "text-gray-300 hover:text-sky-400"
                }
  `}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              navigate("/bookservice");
              setIsOpen(false);
            }}
            className="mt-4 px-5 py-2.5 rounded-md font-bold text-xs tracking-[0.2em]
                       text-black bg-sky-400
                       shadow-[0_0_25px_rgba(56,189,248,0.6)]"
          >
            BOOK SERVICE
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;