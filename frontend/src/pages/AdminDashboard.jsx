import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Inbox,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import EnquiryDetails from "../components/EnquiryDetails";

const STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
];

const formatStatus = (status) =>
  status?.replaceAll("_", " ");

const statusStyles = {
  NEW: "border-[#F2C500]/45 bg-[#F2C500]/12 text-[#806600]",
  CONTACTED:
    "border-blue-500/15 bg-blue-50 text-blue-700",
  IN_PROGRESS:
    "border-violet-500/15 bg-violet-50 text-violet-700",
  COMPLETED:
    "border-emerald-500/15 bg-emerald-50 text-emerald-700",
  REJECTED:
    "border-red-500/15 bg-red-50 text-red-600",
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const [selectedEnquiry, setSelectedEnquiry] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

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

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        page_size: pageSize,
      };

      if (search) {
        params.search = search;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await api.get(
        "/admin/enquiries",
        { params }
      );

      setEnquiries(response.data.items);
      setTotal(response.data.total);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/admin/login");
        return;
      }

      setError("Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [navigate, page, search, statusFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const openEnquiry = async (id) => {
    try {
      setDetailLoading(true);
      setError("");

      const response = await api.get(
        `/admin/enquiries/${id}`
      );

      setSelectedEnquiry(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/admin/login");
        return;
      }

      setError("Unable to load enquiry details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (
    enquiryId,
    newStatus
  ) => {
    try {
      setUpdatingId(enquiryId);
      setError("");

      await api.patch(
        `/admin/enquiries/${enquiryId}/status`,
        {
          status: newStatus,
        }
      );

      await fetchEnquiries();

      if (selectedEnquiry?.id === enquiryId) {
        await openEnquiry(enquiryId);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/admin/login");
        return;
      }

      setError("Unable to update enquiry status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const downloadAttachment = async (enquiry) => {
    try {
      const response = await api.get(
        `/admin/enquiries/${enquiry.id}/attachment`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download =
        enquiry.attachment_path
          ?.split(/[\\/]/)
          .pop() || "attachment";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/admin/login");
        return;
      }

      setError("Unable to download attachment.");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/admin/login");
  };

  const stats = useMemo(() => {
    const newCount = enquiries.filter(
      (item) => item.status === "NEW"
    ).length;

    const progressCount = enquiries.filter(
      (item) =>
        item.status === "CONTACTED" ||
        item.status === "IN_PROGRESS"
    ).length;

    const completedCount = enquiries.filter(
      (item) => item.status === "COMPLETED"
    ).length;

    return {
      newCount,
      progressCount,
      completedCount,
    };
  }, [enquiries]);

  const statCards = [
    {
      label: "Total enquiries",
      value: total,
      description: "All customer requests",
      icon: Users,
      accent:
        "bg-[#160B22] text-[#F2C500]",
    },
    {
      label: "New",
      value: stats.newCount,
      description: "Awaiting review",
      icon: Inbox,
      accent:
        "bg-[#F2C500] text-[#160B22]",
    },
    {
      label: "In progress",
      value: stats.progressCount,
      description: "Active conversations",
      icon: Clock3,
      accent:
        "bg-[#160B22]/[0.07] text-[#160B22]",
    },
    {
      label: "Completed",
      value: stats.completedCount,
      description: "Closed successfully",
      icon: CheckCircle2,
      accent:
        "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#F8F5EF] text-[#160B22]"
      style={{
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <AdminSidebar
        total={total}
        onLogout={handleLogout}
      />

      <main className="relative min-h-screen overflow-hidden lg:ml-[260px]">
        <div className="pointer-events-none absolute -right-52 -top-52 h-[550px] w-[550px] rounded-full bg-[#F2C500]/10 blur-[150px]" />

        <div className="pointer-events-none absolute -bottom-64 left-[15%] h-[550px] w-[550px] rounded-full bg-[#160B22]/[0.045] blur-[150px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#160B22 1px, transparent 1px), linear-gradient(90deg, #160B22 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10">
          <header className="flex min-h-[88px] items-center justify-between border-b border-[#160B22]/10 bg-[#F8F5EF]/80 px-6 backdrop-blur-xl sm:px-8 xl:px-10">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-px w-5 bg-[#F2C500]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#8A6E00]">
                  Workspace
                </span>
              </div>

              <h1
                className="text-[22px] font-semibold tracking-[-0.035em] sm:text-[25px]"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                Project enquiries
              </h1>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-[#160B22]/10 bg-white/70 py-2 pl-2 pr-4 shadow-sm backdrop-blur-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#160B22] text-[11px] font-semibold text-[#F2C500]">
                A
              </div>

              <div className="hidden sm:block">
                <strong className="block text-[10px] font-semibold">
                  Administrator
                </strong>

                <span className="mt-0.5 block text-[8px] font-medium uppercase tracking-[0.13em] text-[#160B22]/45">
                  Admin
                </span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 xl:px-10 xl:py-9">
            <section className="relative mb-7 overflow-hidden rounded-[28px] border border-[#160B22]/10 bg-white/70 px-7 py-7 shadow-[0_15px_50px_rgba(22,11,34,0.06)] backdrop-blur-xl sm:px-9 sm:py-8">
              <div className="absolute bottom-0 left-0 top-0 w-[4px] bg-[#F2C500]" />

              <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#F2C500]/10 blur-2xl" />

              <div className="absolute right-8 top-7 hidden h-20 w-20 rotate-12 rounded-[24px] border border-[#F2C500]/25 bg-[#F2C500]/10 lg:block" />

              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F2C500]/35 bg-[#F2C500]/10 px-3.5 py-2">
                  <Sparkles
                    size={13}
                    className="text-[#9A7B00]"
                  />

                  <span className="text-[8px] font-semibold uppercase tracking-[0.19em] text-[#806600]">
                    Enquiry Workspace
                  </span>
                </div>

                <h2
                  className="max-w-[650px] text-[28px] font-medium leading-[1.15] tracking-[-0.04em] sm:text-[36px]"
                  style={{
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Keep every opportunity{" "}
                  <span className="text-[#CDA500]">
                    moving.
                  </span>
                </h2>

                <p className="mt-3 max-w-[650px] text-[11px] font-medium leading-6 text-[#160B22]/60 sm:text-[12px]">
                  Review incoming project requests,
                  track their progress and manage every
                  customer conversation from one
                  focused workspace.
                </p>
              </div>
            </section>

            <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="group relative overflow-hidden rounded-[22px] border border-[#160B22]/10 bg-white/75 p-5 shadow-[0_10px_35px_rgba(22,11,34,0.045)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#F2C500]/50 hover:shadow-[0_18px_45px_rgba(22,11,34,0.08)]"
                  >
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#F2C500]/0 transition-all duration-500 group-hover:bg-[#F2C500]/10" />

                    <div className="relative flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#160B22]/50">
                          {stat.label}
                        </span>

                        <strong
                          className="mt-3 block text-[32px] font-semibold leading-none tracking-[-0.04em]"
                          style={{
                            fontFamily:
                              "'Raleway', sans-serif",
                          }}
                        >
                          {stat.value}
                        </strong>

                        <small className="mt-3 block text-[9px] font-medium text-[#160B22]/45">
                          {stat.description}
                        </small>
                      </div>

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-[14px] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105 ${stat.accent}`}
                      >
                        <Icon size={18} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="overflow-hidden rounded-[28px] border border-[#160B22]/10 bg-white/80 shadow-[0_20px_60px_rgba(22,11,34,0.07)] backdrop-blur-xl">
              <div className="flex flex-col gap-5 border-b border-[#160B22]/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F2C500]" />

                    <span className="text-[8px] font-semibold uppercase tracking-[0.17em] text-[#160B22]/45">
                      Enquiry Management
                    </span>
                  </div>

                  <h3
                    className="text-[21px] font-semibold tracking-[-0.03em]"
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    All enquiries
                  </h3>

                  <p className="mt-1 text-[9px] font-medium text-[#160B22]/45">
                    {total}{" "}
                    {total === 1 ? "record" : "records"}{" "}
                    found
                  </p>
                </div>

                <div className="rounded-full border border-[#160B22]/10 bg-[#F8F5EF] px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#160B22]/50">
                  Page {page} / {Math.max(totalPages, 1)}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-[#160B22]/10 bg-[#FAF8F3]/70 px-6 py-5 lg:flex-row lg:items-center sm:px-7">
                <form
                  className="group flex min-h-[48px] flex-1 items-center rounded-xl border border-[#160B22]/12 bg-white transition-all duration-300 focus-within:border-[#F2C500] focus-within:ring-4 focus-within:ring-[#F2C500]/10"
                  onSubmit={handleSearch}
                >
                  <Search
                    size={16}
                    className="ml-4 shrink-0 text-[#160B22]/35 transition-colors group-focus-within:text-[#A78600]"
                  />

                  <input
                    type="search"
                    placeholder="Search customer, email, company or project..."
                    value={searchInput}
                    onChange={(event) =>
                      setSearchInput(event.target.value)
                    }
                    className="min-w-0 flex-1 bg-transparent px-3 text-[11px] font-medium text-[#160B22] outline-none placeholder:font-normal placeholder:text-[#160B22]/30"
                  />

                  <button
                    type="submit"
                    className="mr-1.5 rounded-[9px] bg-[#160B22] px-5 py-2.5 text-[8px] font-semibold uppercase tracking-[0.13em] text-white transition-all duration-300 hover:bg-[#F2C500] hover:text-[#160B22]"
                  >
                    Search
                  </button>
                </form>

                <div className="relative lg:w-[190px]">
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setPage(1);
                    }}
                    className="min-h-[48px] w-full cursor-pointer appearance-none rounded-xl border border-[#160B22]/12 bg-white px-4 pr-10 text-[10px] font-semibold text-[#160B22]/70 outline-none transition-all duration-300 hover:border-[#160B22]/25 focus:border-[#F2C500] focus:ring-4 focus:ring-[#F2C500]/10"
                  >
                    <option value="">All statuses</option>

                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A78600]"
                  />
                </div>
              </div>

              {error && (
                <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl border border-red-500/15 bg-red-50 p-4 text-[10px] font-medium text-red-600 sm:mx-7">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-white">
                    !
                  </span>

                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#160B22]/10 border-t-[#F2C500]" />

                  <span className="mt-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#160B22]/40">
                    Loading enquiries
                  </span>
                </div>
              ) : enquiries.length === 0 ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2C500]/15 text-[#927500]">
                    <Inbox size={23} />
                  </div>

                  <strong
                    className="text-[18px] font-semibold"
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    No enquiries found
                  </strong>

                  <span className="mt-2 text-[10px] font-medium text-[#160B22]/45">
                    Try changing your search or filters.
                  </span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#160B22]/10 bg-[#F8F5EF]/70">
                        <th className="px-6 py-4 pl-7 text-left text-[8px] font-semibold uppercase tracking-[0.16em] text-[#160B22]/45">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-left text-[8px] font-semibold uppercase tracking-[0.16em] text-[#160B22]/45">
                          Project
                        </th>

                        <th className="px-6 py-4 text-center text-[8px] font-semibold uppercase tracking-[0.16em] text-[#160B22]/45">
                          Budget
                        </th>

                        <th className="px-6 py-4 text-center text-[8px] font-semibold uppercase tracking-[0.16em] text-[#160B22]/45">
                          Status
                        </th>

                        <th className="px-6 py-4 text-center text-[8px] font-semibold uppercase tracking-[0.16em] text-[#160B22]/45">
                          Received
                        </th>

                        <th className="px-6 py-4 pr-7 text-center text-[8px] font-semibold uppercase tracking-[0.16em] text-[#160B22]/45">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {enquiries.map((enquiry) => (
                        <tr
                          key={enquiry.id}
                          onClick={() => openEnquiry(enquiry.id)}
                          className="group cursor-pointer border-b border-[#160B22]/[0.07] transition-all duration-300 last:border-b-0 hover:bg-[#F2C500]/[0.045]"
                        >
                          <td className="px-6 py-5 pl-7">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#160B22]/10 bg-[#F8F5EF] text-[10px] font-semibold text-[#160B22] transition-all duration-300 group-hover:border-[#F2C500]/50 group-hover:bg-[#F2C500]">
                                {enquiry.name
                                  .split(" ")
                                  .map((item) => item[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <strong className="block max-w-[190px] truncate text-[11px] font-semibold text-[#160B22]">
                                  {enquiry.name}
                                </strong>

                                <span className="mt-1 block max-w-[190px] truncate text-[9px] font-medium text-[#160B22]/45">
                                  {enquiry.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div>
                              <strong className="block max-w-[190px] truncate text-[10px] font-semibold text-[#160B22]/80">
                                {enquiry.project_type}
                              </strong>

                              <span className="mt-1 block max-w-[190px] truncate text-[9px] font-medium text-[#160B22]/40">
                                {enquiry.company || "Individual"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-center text-[11px] font-semibold text-[#160B22]">
                            {enquiry.budget
                              ? `₹${Number(enquiry.budget).toLocaleString(
                                  "en-IN"
                                )}`
                              : "—"}
                          </td>

                          <td className="px-6 py-5 text-center">
                            <div className="relative inline-block text-left">
                              <select
                                className={`cursor-pointer appearance-none rounded-full border py-2 pl-3 pr-8 text-[8px] font-semibold uppercase tracking-[0.09em] outline-none transition-all duration-300 disabled:cursor-wait disabled:opacity-50 ${
                                  statusStyles[enquiry.status] ||
                                  "border-[#160B22]/10 bg-[#F8F5EF] text-[#160B22]"
                                }`}
                                value={enquiry.status}
                                disabled={updatingId === enquiry.id}
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                                onChange={(event) => {
                                  event.stopPropagation();

                                  handleStatusChange(
                                    enquiry.id,
                                    event.target.value
                                  );
                                }}
                              >
                                {STATUS_OPTIONS.map((status) => (
                                  <option key={status} value={status}>
                                    {formatStatus(status)}
                                  </option>
                                ))}
                              </select>

                              <ChevronDown
                                size={11}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-55"
                              />
                            </div>
                          </td>

                          <td className="px-6 py-5 text-center">
                            <strong className="block text-[9px] font-semibold text-[#160B22]/75">
                              {new Date(
                                enquiry.created_at
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </strong>

                            <span className="mt-1 block text-[8px] font-medium text-[#160B22]/40">
                              {new Date(
                                enquiry.created_at
                              ).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>

                          <td className="px-6 py-5 pr-7 text-center">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openEnquiry(enquiry.id);
                              }}
                              aria-label="View enquiry"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#160B22]/10 bg-white text-[#160B22]/55 transition-all duration-300 hover:border-[#160B22] hover:bg-[#160B22] hover:text-[#F2C500] group-hover:translate-x-0.5"
                            >
                              <ArrowRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex flex-col gap-4 border-t border-[#160B22]/10 bg-[#FAF8F3]/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <span className="text-[9px] font-semibold text-[#160B22]/45">
                  Page{" "}
                  <strong className="text-[#160B22]">
                    {page}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-[#160B22]">
                    {Math.max(totalPages, 1)}
                  </strong>
                </span>

                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() =>
                      setPage(
                        (current) => current - 1
                      )
                    }
                    className="group flex items-center gap-2 rounded-xl border border-[#160B22]/10 bg-white px-4 py-2.5 text-[9px] font-semibold text-[#160B22]/65 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#160B22] hover:text-[#160B22] disabled:pointer-events-none disabled:opacity-35"
                  >
                    <ArrowLeft
                      size={13}
                      className="transition-transform duration-300 group-hover:-translate-x-0.5"
                    />

                    Previous
                  </button>

                  <button
                    disabled={
                      totalPages === 0 ||
                      page >= totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) => current + 1
                      )
                    }
                    className="group flex items-center gap-2 rounded-xl bg-[#160B22] px-4 py-2.5 text-[9px] font-semibold text-white shadow-[0_8px_20px_rgba(22,11,34,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C500] hover:text-[#160B22] disabled:pointer-events-none disabled:opacity-35"
                  >
                    Next

                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <EnquiryDetails
          enquiry={selectedEnquiry}
          loading={detailLoading}
          updating={
            updatingId === selectedEnquiry?.id
          }
          onClose={() =>
            setSelectedEnquiry(null)
          }
          onDownloadAttachment={
            downloadAttachment
          }
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
}

export default AdminDashboard;