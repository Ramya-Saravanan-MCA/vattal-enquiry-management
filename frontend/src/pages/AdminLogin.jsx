import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Raleway:wght@400;500;600&display=swap";

    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      navigate("/admin");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fontPrimary = {
    fontFamily: "'Montserrat', sans-serif",
  };

  const fontDisplay = {
    fontFamily: "'Raleway', sans-serif",
  };

  const inputStyle =
    "w-full rounded-xl border border-[#160B22]/15 bg-white/85 px-4 py-3.5 text-[13px] font-medium text-[#160B22] outline-none transition-all duration-300 placeholder:font-normal placeholder:text-[#160B22]/30 hover:border-[#160B22]/30 hover:bg-white focus:-translate-y-[1px] focus:border-[#E6B900] focus:bg-white focus:shadow-[0_8px_30px_rgba(230,185,0,0.10)] focus:ring-4 focus:ring-[#F2C500]/10";

  const labelStyle =
    "mb-2 block text-[9px] font-semibold uppercase tracking-[0.17em] text-[#160B22]/70";

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#F8F5EF] text-[#160B22]"
      style={fontPrimary}
    >
      <div className="pointer-events-none absolute -left-52 -top-52 h-[550px] w-[550px] rounded-full bg-[#F2C500]/10 blur-[140px]" />

      <div className="pointer-events-none absolute -right-52 top-[20%] h-[550px] w-[550px] rounded-full bg-[#160B22]/[0.055] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-280px] left-[35%] h-[550px] w-[550px] rounded-full bg-[#F2C500]/10 blur-[150px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#160B22 1px, transparent 1px), linear-gradient(90deg, #160B22 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="pointer-events-none absolute left-[9%] top-[25%] hidden h-2.5 w-2.5 animate-pulse rounded-full bg-[#F2C500] lg:block" />

      <div className="pointer-events-none absolute left-[12%] top-[30%] hidden h-1.5 w-1.5 rounded-full bg-[#160B22]/35 lg:block" />

      <div className="pointer-events-none absolute bottom-[15%] right-[12%] hidden h-2 w-2 animate-pulse rounded-full bg-[#F2C500]/70 lg:block" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <nav className="flex items-center justify-between px-6 py-7 sm:px-10 lg:px-16">
          <div className="group flex cursor-default items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#160B22] text-sm font-semibold text-[#F2C500] shadow-sm transition-all duration-500 group-hover:-rotate-6 group-hover:shadow-[0_8px_25px_rgba(22,11,34,0.18)]">
              <span className="relative z-10">V</span>

              <span className="absolute inset-x-0 bottom-0 h-0 bg-[#F2C500] transition-all duration-500 group-hover:h-full" />

              <span className="absolute z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:text-[#160B22]">
                V
              </span>
            </div>

            <div>
              <p
                className="text-[13px] font-semibold tracking-[0.2em]"
                style={fontDisplay}
              >
                VATTAL
              </p>

              <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#160B22]/60">
                Studios
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 rounded-full border border-[#160B22]/10 bg-white/70 px-4 py-2.5 text-[9px] font-medium tracking-wide text-[#160B22]/65 shadow-sm backdrop-blur-xl sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2C500] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F2C500]" />
            </span>

            Admin workspace
          </div>
        </nav>

        <div className="relative flex flex-1 items-center justify-center px-5 pb-16 pt-6 sm:px-8 lg:pb-20">
          <div className="relative w-full max-w-[470px]">
            <div className="absolute -left-6 -top-6 h-24 w-24 rotate-6 rounded-[30px] bg-[#F2C500] opacity-90 shadow-[0_18px_50px_rgba(242,197,0,0.20)] transition-transform duration-700 hover:rotate-12" />

            <div className="absolute -bottom-7 -right-7 h-32 w-32 rounded-full bg-[#160B22]/10" />

            <div className="absolute -right-4 top-[30%] h-14 w-14 rotate-12 rounded-2xl border border-[#F2C500]/30 bg-[#F2C500]/15" />

            <section className="relative z-10 rounded-[32px] border border-white/90 bg-white/[0.86] p-7 shadow-[0_35px_100px_rgba(22,11,34,0.12)] backdrop-blur-2xl sm:p-10">
              <div className="mb-9">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-6 bg-[#F2C500]" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8A6E00]">
                    Admin Portal
                  </span>
                </div>

                <h1
                  className="text-[36px] font-medium leading-tight tracking-[-0.04em] text-[#160B22] sm:text-[42px]"
                  style={fontDisplay}
                >
                  Welcome back
                  <span className="text-[#CDA500]">.</span>
                </h1>

                <p className="mt-3 max-w-[330px] text-[12px] font-medium leading-6 text-[#160B22]/55">
                  Sign in to access your workspace and manage project
                  enquiries.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className={labelStyle}>
                    Email address
                  </label>

                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="email"
                      placeholder="admin@vattalstudios.com"
                      className={`${inputStyle} pl-11`}
                    />

                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#160B22]/40">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 6.5L12 13L20 6.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#160B22]/70"
                    >
                      Password
                    </label>

                    <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-[#160B22]/35">
                      Secure access
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={`${inputStyle} px-11`}
                    />

                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#160B22]/40">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />

                        <path
                          d="M8 10V7.5C8 5.01472 9.79086 3 12 3C14.2091 3 16 5.01472 16 7.5V10"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#160B22]/40 transition-colors duration-300 hover:text-[#A78600]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 3L21 21"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />

                          <path
                            d="M10.6 10.7C10.2 11.1 10 11.5 10 12C10 13.1 10.9 14 12 14C12.5 14 12.9 13.8 13.3 13.4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />

                          <path
                            d="M9.4 5.2C10.2 5.07 11.1 5 12 5C17.5 5 21 12 21 12C20.4 13.2 19.6 14.3 18.7 15.2M6.2 6.3C4.2 7.7 3 10 3 12C3 12 6.5 19 12 19C13.4 19 14.7 18.6 15.8 18"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 12C3 12 6.5 5 12 5C17.5 5 21 12 21 12C21 12 17.5 19 12 19C6.5 19 3 12 3 12Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/15 bg-red-50/80 p-4 text-[11px] font-medium text-red-600"
                    role="alert"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                      !
                    </span>

                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-7 w-full overflow-hidden rounded-xl border border-[#160B22] bg-[#160B22] shadow-[0_12px_30px_rgba(22,11,34,0.16)] transition-all duration-500 hover:-translate-y-1 hover:border-[#F2C500] hover:shadow-[0_18px_40px_rgba(242,197,0,0.20)] active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                >
                  <span className="absolute inset-0 translate-y-full bg-[#F2C500] transition-transform duration-500 ease-out group-hover:translate-y-0" />

                  <span className="absolute -left-[80%] top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                  <span className="relative flex items-center justify-center gap-3 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-500 group-hover:text-[#160B22]">
                    {loading && (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-[#F2C500] group-hover:border-[#160B22]/20 group-hover:border-t-[#160B22]" />
                    )}

                    {loading ? "Signing in..." : "Sign in to dashboard"}
                  </span>
                </button>
              </form>

              <div className="mt-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#160B22]/10" />

                <div className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.15em] text-[#160B22]/35">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 3L19 6V11C19 15.4 16.2 19.3 12 21C7.8 19.3 5 15.4 5 11V6L12 3Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9.5 12L11 13.5L14.5 10"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  Authorized access only
                </div>

                <div className="h-px flex-1 bg-[#160B22]/10" />
              </div>
            </section>

            <div className="mt-7 text-center">
              <p
                className="text-[11px] font-medium tracking-[0.06em] text-[#160B22]/45"
                style={fontDisplay}
              >
                Vattal Studios
                <span className="mx-2 text-[#CDA500]">•</span>
                Admin Workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;