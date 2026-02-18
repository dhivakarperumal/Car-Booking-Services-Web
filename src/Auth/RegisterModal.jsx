import RegisterForm from "./RegisterForm";

const RegisterModal = ({ open, onClose, onSwitchToLogin }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-black rounded-2xl p-6">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        <RegisterForm
          onSuccess={onClose}
          onSwitchToLogin={onSwitchToLogin}
        />

      </div>
    </div>
  );
};

export default RegisterModal;