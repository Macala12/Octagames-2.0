import {
  ArrowUpIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function DashboardWallet() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Card Start --> */}
      <div className="rounded-2xl p-2 dark: dark: md:p-6">
        <div className="relative flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Withdrawalable Balance
            </span>
            <h4 className="mt-6 font-bold text-gray-800 text-[25px] dark:text-white/90">
              ₦3,782<span className="text-[20px] text-white/40">.00</span>
            </h4>
            <a href="/wallet" className="absolute font-semibold right-0 top-0 text-[#000] text-[12px] bg-brand-500 px-4 py-2 rounded-[20px]">
                Withdraw
            </a>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            +₦11.00
          </Badge>
        </div>
      </div>
    </div>
  );
}
