export default function Notification() {
    return(
        <div className="p-4 mt-3">
            <div className="flex items-center pb-3 mb-3 dark:border-gray-700">
                <button
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </button>
                <h5 className="text-lg text-center w-100 mr-4 font-semibold text-gray-800 dark:text-gray-200">
                    Notification
                </h5>
            </div>
            
            <ul className="flex flex-col gap-10 h-auto overflow-y-auto custom-scrollbar">
                <li className="flex">
                    <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                        <img
                        width={40}
                        height={40}
                        src="/images/user/user-04.jpg"
                        alt="User"
                        className="w-full overflow-hidden rounded-full"
                        />
                        <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
                    </span>

                    <span className="block">
                        <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-white/90">
                            Jocelyn Kenter
                        </span>
                        <span> requests permission to change</span>
                        <span className="font-medium text-gray-800 dark:text-white/90">
                            Project - Nganter App
                        </span>
                        </span>

                        <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                        <span>Project</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>15 min ago</span>
                        </span>
                    </span>
                </li>
            </ul>
        </div>
    );
}