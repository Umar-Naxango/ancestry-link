import { FaUserPlus, FaTree, FaUsers, FaShareAlt } from 'react-icons/fa';

const steps = [
    {
        number: "01",
        icon: <FaUserPlus className="text-5xl text-emerald-600" />,
        title: "Create Your Account",
        desc: "Sign up in seconds and start adding yourself and your immediate family."
    },
    {
        number: "02",
        icon: <FaTree className="text-5xl text-emerald-600" />,
        title: "Build Your Tree",
        desc: "Add parents, siblings, children, and watch your family tree grow beautifully."
    },
    {
        number: "03",
        icon: <FaUsers className="text-5xl text-emerald-600" />,
        title: "Invite Family Members",
        desc: "Collaborate in real-time. Everyone can contribute memories and photos."
    },
    {
        number: "04",
        icon: <FaShareAlt className="text-5xl text-emerald-600" />,
        title: "Share & Preserve",
        desc: "Export, print, or share your family story with loved ones."
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-white dark:bg-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Four simple steps to build your family legacy</p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative text-center">
                            {index !== steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-emerald-100 dark:bg-emerald-900/30 -z-10" />
                            )}
                            <div className="mx-auto w-24 h-24 bg-emerald-50 dark:bg-[#121212] border dark:border-gray-800 rounded-2xl flex items-center justify-center mb-6">
                                {step.icon}
                            </div>
                            <div className="text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold mb-2" suppressHydrationWarning>{step.number}</div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{step.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}