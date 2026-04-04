import PageMeta from "../../components/common/PageMeta";
import OctaCoinGrid from "../../components/game/OctacoinGrid";

export default function Octacoin() {
  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | Octagames - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for Octagames - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="p-4 dark: xl:px-10 xl:py-12">
        <div className="flex items-center gap-3 pt-3 pb-0 mb-6">
          <button 
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
              bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10
              active:scale-90 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-gray-500 dark:text-white/50">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-extrabold text-gray-900 dark:text-white">Octacoin</h1>
          </div>
        </div>
        <OctaCoinGrid limit={20} />
      </div>
    </div>
  );
}
