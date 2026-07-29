import {
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Download,
  FileText,
  Mail,
  Phone,
  X,
} from "lucide-react";

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
  NEW: "border-[#F2C500]/50 bg-[#F2C500]/15 text-[#806600]",
  CONTACTED:
    "border-blue-500/20 bg-blue-50 text-blue-700",
  IN_PROGRESS:
    "border-violet-500/20 bg-violet-50 text-violet-700",
  COMPLETED:
    "border-emerald-500/20 bg-emerald-50 text-emerald-700",
  REJECTED:
    "border-red-500/20 bg-red-50 text-red-600",
};

function EnquiryDetails({
  enquiry,
  loading,
  onClose,
  onStatusChange,
  onDownloadAttachment,
  updating,
}) {
  if (!enquiry && !loading) {
    return null;
  }

  const initials = enquiry?.name
    ? enquiry.name
        .split(" ")
        .map((item) => item[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end overflow-hidden bg-[#160B22]/25 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <aside
        className="relative h-full w-full max-w-[540px] overflow-x-hidden overflow-y-auto border-l border-[#160B22]/10 bg-[#F8F5EF] shadow-[-25px_0_70px_rgba(22,11,34,0.14)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#160B22 1px, transparent 1px), linear-gradient(90deg, #160B22 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="pointer-events-none absolute -right-32 -top-32 h-[320px] w-[320px] rounded-full bg-[#F2C500]/10 blur-[100px]" />

        <div className="relative z-10 w-full min-w-0 overflow-x-hidden">
          <div className="sticky top-0 z-30 flex items-start justify-between border-b border-[#160B22]/10 bg-[#F8F5EF]/90 px-6 py-5 backdrop-blur-xl sm:px-7">
            <div className="min-w-0 pr-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-5 bg-[#F2C500]" />

                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#806600]">
                  Enquiry details
                </span>
              </div>

              <h2
                className="max-w-[350px] truncate text-[23px] font-semibold tracking-[-0.035em] text-[#160B22]"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                {enquiry?.name || "Loading..."}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry"
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#160B22]/10 bg-white text-[#160B22]/60 shadow-sm transition-all duration-300 hover:border-[#F2C500]/60 hover:bg-[#F2C500] hover:text-[#160B22]"
            >
              <X
                size={17}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#160B22]/10 border-t-[#F2C500]" />

              <span className="mt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#160B22]/55">
                Loading enquiry
              </span>
            </div>
          ) : (
            <div className="w-full min-w-0 space-y-5 overflow-x-hidden px-5 py-6 sm:px-7">
              <section className="w-full min-w-0 overflow-hidden rounded-[22px] border border-[#160B22]/10 bg-white/85 shadow-[0_10px_35px_rgba(22,11,34,0.05)]">
                <div className="h-1 w-full bg-[#F2C500]" />

                <div className="p-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#160B22] text-[12px] font-bold tracking-wide text-[#F2C500] shadow-[0_7px_20px_rgba(22,11,34,0.13)]">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="truncate text-[16px] font-semibold tracking-[-0.02em] text-[#160B22]"
                        style={{
                          fontFamily: "'Raleway', sans-serif",
                        }}
                      >
                        {enquiry.name}
                      </h3>

                      <p className="mt-1 truncate text-[10px] font-medium text-[#160B22]/60">
                        {enquiry.company || "Individual enquiry"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 border-t border-[#160B22]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-[#160B22]/50">
                        Current status
                      </span>

                      <span className="mt-1 block text-[9px] font-medium text-[#160B22]/50">
                        Update enquiry progress
                      </span>
                    </div>

                    <div className="relative w-fit">
                      <select
                        value={enquiry.status}
                        disabled={updating}
                        onChange={(event) =>
                          onStatusChange(
                            enquiry.id,
                            event.target.value
                          )
                        }
                        className={`cursor-pointer appearance-none rounded-full border py-2.5 pl-4 pr-9 text-[8px] font-bold uppercase tracking-[0.09em] outline-none transition-all duration-300 focus:ring-4 focus:ring-[#F2C500]/10 disabled:cursor-wait disabled:opacity-50 ${
                          statusStyles[enquiry.status] ||
                          "border-[#160B22]/15 bg-[#F8F5EF] text-[#160B22]"
                        }`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={12}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="w-full min-w-0 rounded-[22px] border border-[#160B22]/10 bg-white/80 p-5 shadow-[0_8px_30px_rgba(22,11,34,0.04)]">
                <SectionTitle>
                  Contact information
                </SectionTitle>

                <div className="mt-5 space-y-1">
                  <InfoRow
                    icon={<Mail size={16} />}
                    label="Email address"
                    value={enquiry.email}
                  />

                  <InfoRow
                    icon={<Phone size={16} />}
                    label="Phone number"
                    value={enquiry.phone || "Not provided"}
                  />

                  <InfoRow
                    icon={<Building2 size={16} />}
                    label="Company / Brand"
                    value={enquiry.company || "Not provided"}
                    last
                  />
                </div>
              </section>

              <section className="w-full min-w-0 rounded-[22px] border border-[#160B22]/10 bg-white/80 p-5 shadow-[0_8px_30px_rgba(22,11,34,0.04)]">
                <SectionTitle>
                  Project overview
                </SectionTitle>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0 rounded-[16px] border border-[#160B22]/10 bg-[#FAF8F3] p-4 transition-all duration-300 hover:border-[#F2C500]/50 hover:bg-[#FFFBEA]">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F2C500]/20 text-[#806600]">
                      <FileText
                        size={16}
                        strokeWidth={1.9}
                      />
                    </div>

                    <span className="block text-[8px] font-bold uppercase tracking-[0.14em] text-[#160B22]/50">
                      Project type
                    </span>

                    <strong className="mt-2 block break-words text-[10px] font-semibold leading-5 text-[#160B22]">
                      {enquiry.project_type}
                    </strong>
                  </div>

                  <div className="min-w-0 rounded-[16px] border border-[#160B22]/10 bg-[#FAF8F3] p-4 transition-all duration-300 hover:border-[#F2C500]/50 hover:bg-[#FFFBEA]">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#160B22]/[0.06] text-[#160B22]">
                      <CircleDollarSign
                        size={16}
                        strokeWidth={1.9}
                      />
                    </div>

                    <span className="block text-[8px] font-bold uppercase tracking-[0.14em] text-[#160B22]/50">
                      Estimated budget
                    </span>

                    <strong className="mt-2 block break-words text-[12px] font-bold text-[#160B22]">
                      {enquiry.budget
                        ? `₹${Number(
                            enquiry.budget
                          ).toLocaleString("en-IN")}`
                        : "Not specified"}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="w-full min-w-0 rounded-[22px] border border-[#160B22]/10 bg-white/80 p-5 shadow-[0_8px_30px_rgba(22,11,34,0.04)]">
                <SectionTitle>
                  Project requirements
                </SectionTitle>

                <div className="relative mt-5 w-full min-w-0 overflow-hidden rounded-[16px] border border-[#160B22]/10 bg-[#FAF8F3] p-5">
                  <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#F2C500]" />

                  <p className="max-w-full whitespace-pre-wrap break-words text-[11px] font-medium leading-7 text-[#160B22]/80 [overflow-wrap:anywhere]">
                    {enquiry.message}
                  </p>
                </div>
              </section>

              <section className="w-full min-w-0 rounded-[22px] border border-[#160B22]/10 bg-white/80 p-5 shadow-[0_8px_30px_rgba(22,11,34,0.04)]">
                <SectionTitle>
                  Attachment
                </SectionTitle>

                {enquiry.attachment_path ? (
                  <div className="group mt-5 flex min-w-0 items-center gap-4 rounded-[16px] border border-[#160B22]/10 bg-[#FAF8F3] p-4 transition-all duration-300 hover:border-[#F2C500]/60 hover:bg-[#FFFBEA]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2C500]/20 text-[#806600] transition-all duration-300 group-hover:bg-[#F2C500] group-hover:text-[#160B22]">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <strong className="block max-w-full truncate text-[10px] font-semibold text-[#160B22]">
                        {enquiry.attachment_path
                          .split(/[\\/]/)
                          .pop()}
                      </strong>

                      <span className="mt-1 block text-[8px] font-medium text-[#160B22]/50">
                        Customer attachment
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onDownloadAttachment(enquiry)
                      }
                      aria-label="Download attachment"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#160B22]/10 bg-white text-[#160B22]/65 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#160B22] hover:bg-[#160B22] hover:text-[#F2C500]"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 flex items-center gap-3 rounded-[16px] border border-dashed border-[#160B22]/15 bg-[#FAF8F3] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#160B22]/[0.05] text-[#160B22]/45">
                      <FileText size={15} />
                    </div>

                    <span className="text-[9px] font-semibold text-[#160B22]/50">
                      No attachment provided
                    </span>
                  </div>
                )}
              </section>

              <section className="w-full min-w-0 rounded-[22px] border border-[#160B22]/10 bg-white/80 p-5 shadow-[0_8px_30px_rgba(22,11,34,0.04)]">
                <SectionTitle>Activity</SectionTitle>

                <div className="mt-6">
                  <TimelineItem
                    title="Enquiry received"
                    date={enquiry.created_at}
                    active
                  />

                  {enquiry.audit_logs?.map((log) => (
                    <TimelineItem
                      key={log.id}
                      title={`${formatStatus(
                        log.old_value
                      )} → ${formatStatus(log.new_value)}`}
                      date={log.created_at}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#F2C500]" />

      <h4 className="shrink-0 text-[9px] font-bold uppercase tracking-[0.17em] text-[#160B22]/70">
        {children}
      </h4>

      <div className="h-px min-w-0 flex-1 bg-[#160B22]/10" />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last = false,
}) {
  return (
    <div
      className={`group flex min-w-0 items-center gap-4 py-3.5 ${
        last
          ? ""
          : "border-b border-[#160B22]/[0.07]"
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#160B22]/[0.055] text-[#160B22]/65 transition-all duration-300 group-hover:bg-[#F2C500]/20 group-hover:text-[#806600]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-[#160B22]/45">
          {label}
        </span>

        <strong className="mt-1.5 block max-w-full break-words text-[10px] font-semibold leading-5 text-[#160B22]/85 [overflow-wrap:anywhere]">
          {value}
        </strong>
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  date,
  active = false,
}) {
  return (
    <div className="relative flex min-w-0 gap-4 pb-6 last:pb-0">
      <div className="relative flex w-4 shrink-0 justify-center">
        <span
          className={`relative z-10 mt-1 h-2.5 w-2.5 rounded-full border-[2px] ${
            active
              ? "border-[#F2C500] bg-[#F2C500] shadow-[0_0_0_4px_rgba(242,197,0,0.12)]"
              : "border-[#160B22]/25 bg-[#F8F5EF]"
          }`}
        />

        <span className="absolute bottom-[-5px] top-3 w-px bg-[#160B22]/10" />
      </div>

      <div className="min-w-0 flex-1">
        <strong className="block break-words text-[10px] font-semibold text-[#160B22]/85">
          {title}
        </strong>

        <span className="mt-2 flex flex-wrap items-center gap-1.5 text-[8px] font-medium text-[#160B22]/50">
          <CalendarDays
            size={12}
            className="shrink-0"
          />

          {new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default EnquiryDetails;