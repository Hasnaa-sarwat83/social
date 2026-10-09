import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  AtSign,
  Users,
  Calendar,
  KeyRound,
} from "lucide-react";
import { signup } from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    rePassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.rePassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await signup(formData);

      localStorage.setItem("token", response.data.token);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0] ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f0f2f5] px-4 py-8 sm:py-12 lg:flex lg:items-center"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        <section className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left">
          <h1 className="hidden text-5xl font-extrabold tracking-tight text-[#00298d] sm:text-6xl lg:block">
            Route Posts
          </h1>

          <p className="hidden mt-4 text-2xl font-medium leading-snug text-slate-800 lg:block">
            Connect with friends and the world around you on Route Posts.
          </p>

          <div className="mt-6 rounded-2xl border border-[#c9d5ff] bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#00298d]">
              About Route Academy
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              Egypt's Leading IT Training Center Since 2012
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Route Academy is the premier IT training center in Egypt,
              established in 2012. We specialize in delivering high-quality
              training courses in programming, web development, and application
              development. We've identified the unique challenges people may
              face when learning new technology and made efforts to provide
              strategies to overcome them.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">2012</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Founded
                </p>
              </div>

              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">40K+</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Graduates
                </p>
              </div>

              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">50+</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Partner Companies
                </p>
              </div>

              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">5</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Branches
                </p>
              </div>

              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">20</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Diplomas Available
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="order-1 w-full max-w-[430px] lg:order-2">
          <div className="rounded-2xl bg-white p-4 sm:p-6">
            <div className="mb-4 text-center lg:hidden">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
                Route Posts
              </h1>

              <p className="mt-1 text-base font-medium leading-snug text-slate-700">
                Connect with friends and the world around you on Route Posts.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-lg py-2 text-sm font-extrabold text-slate-600 transition hover:text-slate-800"
              >
                Login
              </button>

              <button
                type="button"
                className="rounded-lg bg-white py-2 text-sm font-extrabold text-[#00298d] shadow-sm transition"
              >
                Register
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              Create a new account
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              It is quick and easy.
            </p>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form
              noValidate
              className="mt-5 space-y-3.5"
              onSubmit={handleSubmit}
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </span>

                <input
                  placeholder="Full name"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <AtSign size={18} />
                </span>

                <input
                  placeholder="Username (optional)"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <AtSign size={18} />
                </span>

                <input
                  placeholder="Email address"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <Users
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Calendar size={18} />
                </span>

                <input
                  placeholder="Date of birth"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <KeyRound size={18} />
                </span>

                <input
                  placeholder="Password"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <KeyRound size={18} />
                </span>

                <input
                  placeholder="Confirm password"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="password"
                  name="rePassword"
                  value={formData.rePassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b]"
              >
                {loading ? "Creating Account..." : "Create New Account"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Signup;
