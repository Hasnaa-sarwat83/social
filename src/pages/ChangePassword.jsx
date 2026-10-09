import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !rePassword) {
      setMessage("Please fill in all fields");
      return;
    }

    if (newPassword !== rePassword) {
      setMessage("New passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: oldPassword,
            newPassword: newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message || "Failed to change password"
        );
        return;
      }

      setMessage("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
      setRePassword("");
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-sm font-semibold text-gray-500 hover:text-[#00298d]"
        >
          ← Back to Home
        </button>

        <h1 className="mb-2 text-2xl font-bold text-[#00298d]">
          Change Password
        </h1>

        <p className="mb-6 text-gray-500">
          Update your account password
        </p>

        <form
          onSubmit={changePassword}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Current Password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(e.target.value)
              }
              placeholder="Enter current password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#00298d]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#00298d]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>

            <input
              type="password"
              value={rePassword}
              onChange={(e) =>
                setRePassword(e.target.value)
              }
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#00298d]"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-gray-100 px-3 py-2 text-center text-sm text-gray-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#00298d] py-3 font-semibold text-white transition hover:bg-blue-900 disabled:opacity-50"
          >
            {loading
              ? "Changing..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
