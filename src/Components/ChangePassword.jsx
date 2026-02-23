import { useState } from "react";
import { auth } from "../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { MdLock } from "react-icons/md";

const ChangePassword = () => {
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!currentPassword)
      return toast.error("Enter current password");

    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);

    try {
      // 🔐 Reauthenticate
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // 🔄 Update Password
      await updatePassword(user, newPassword);

      toast.success("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Current password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">

      {/* CURRENT PASSWORD */}
      <div className="relative">
        <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={showCurrent ? "text" : "password"}
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full pl-10 pr-11 p-2.5 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <button
          type="button"
          onClick={() => setShowCurrent(!showCurrent)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400"
        >
          {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* NEW PASSWORD */}
      <div className="relative">
        <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full pl-10 pr-11 p-2.5 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400"
        >
          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="relative">
        <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full pl-10 pr-11 p-2.5 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400"
        >
          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <button
        disabled={loading}
        className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-sky-500 to-cyan-400 text-black disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default ChangePassword;