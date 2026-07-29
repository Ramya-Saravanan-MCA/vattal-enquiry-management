import {
  Inbox,
  LogOut,
} from "lucide-react";

function AdminSidebar({ total, onLogout }) {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-[240px] flex-col border-r border-[#160B22]/12 bg-[#F8F5EF] lg:flex">
      <div className="flex h-[88px] items-center border-b border-[#160B22]/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#160B22] text-[13px] font-bold text-[#F2C500] shadow-[0_5px_15px_rgba(22,11,34,0.12)]">
            V
          </div>

          <div>
            <strong
              className="block text-[14px] font-bold tracking-[0.17em] text-[#160B22]"
              style={{
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              VATTAL
            </strong>

            <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.24em] text-[#160B22]/60">
              Studios
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-7">
        <div className="mb-3 px-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#160B22]/55">
            Management
          </span>
        </div>

        <nav>
          <button
            type="button"
            className="group relative flex w-full items-center gap-3 rounded-xl border border-[#F2C500]/55 bg-[#F2C500]/10 px-4 py-3.5 text-left transition-all duration-300 hover:border-[#F2C500] hover:bg-[#F2C500]/20 hover:shadow-[0_7px_20px_rgba(242,197,0,0.10)]"
          >
            <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-[#E2B700]" />

            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#F2C500]/20 text-[#7A6200] transition-all duration-300 group-hover:bg-[#F2C500] group-hover:text-[#160B22]">
              <Inbox
                size={17}
                strokeWidth={2}
              />
            </div>

            <span className="flex-1 text-[11px] font-bold tracking-[0.01em] text-[#160B22]">
              Enquiries
            </span>

            <span className="flex min-w-[28px] items-center justify-center rounded-full border border-[#F2C500]/50 bg-white px-2 py-1 text-[8px] font-bold text-[#765E00] shadow-sm">
              {total}
            </span>
          </button>
        </nav>
      </div>

      <div className="border-t border-[#160B22]/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-[#160B22]/65 transition-all duration-300 hover:border-red-500/10 hover:bg-red-50 hover:text-red-600"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#160B22]/[0.055] transition-all duration-300 group-hover:bg-red-100">
            <LogOut
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </div>

          <span className="text-[10px] font-bold">
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;