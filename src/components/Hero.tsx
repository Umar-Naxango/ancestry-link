import Link from 'next/link';
import { FaArrowRight, FaUsers, FaTree } from 'react-icons/fa';

export default function Hero() {
    return (
        <section className="pt-20 pb-16 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#121212]">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-[#252525] rounded-full px-4 py-2 shadow-sm border dark:border-gray-800">
                        <FaTree className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Preserve Your Legacy</span>
                    </div>

                    <h1 className="text-6xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                        Build Your <span className="text-emerald-600 dark:text-emerald-400">Family Tree</span><br />
                        Like Never Before
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg">
                        Connect generations, discover stories, and preserve memories.
                        The beautiful, easy-to-use family tree builder loved by families worldwide.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/sign-up"
                            className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition shadow-lg shadow-emerald-200"
                        >
                            Start Building Free
                            <FaArrowRight />
                        </Link>

                        <Link
                            href="#demo"
                            className="flex items-center justify-center gap-3 border-2 border-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-gray-800 hover:text-white dark:hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition"
                        >
                            Watch Demo
                        </Link>
                    </div>

                    <div className="flex items-center gap-8 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-3">
                                {['👴', '👵', '👨‍👩‍👧'].map((emoji, i) => (
                                    <span key={i} className="text-2xl">{emoji}</span>
                                ))}
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">10,000+ families</span>
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-medium">4.9/5 from 2.3k reviews</div>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="relative">
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl p-4 overflow-hidden border dark:border-gray-800">
                        <img
                            src="https://i.ibb.co/SWMnBM4/A-breathtaking-wide-angle-cinematic-shot-202604291510.jpg"
                            alt="Interactive Family Tree"
                            className="rounded-2xl shadow-inner w-full"
                        />
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -top-6 right-0 md:-right-6 bg-white dark:bg-[#252525] rounded-2xl shadow-xl p-4 flex items-center gap-3 border dark:border-gray-800">
                        <div className="text-3xl">🌳</div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">8 Generations</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Connected</p>
                        </div>
                    </div>

                    <div className="absolute -bottom-6 left-0 md:-left-6 bg-white dark:bg-[#252525] rounded-2xl shadow-xl p-4 border dark:border-gray-800">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <FaUsers size={24} />
                            <span className="font-bold">124 Members</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}