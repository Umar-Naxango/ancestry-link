import { FaTree, FaUsers, FaMobileAlt, FaSearch, FaLock, FaCloud } from 'react-icons/fa';

const features = [
    {
        icon: <FaTree className="text-4xl text-emerald-600" />,
        title: "Interactive Family Tree",
        desc: "Build beautiful, drag & drop family trees with unlimited generations."
    },
    {
        icon: <FaUsers className="text-4xl text-emerald-600" />,
        title: "Family Collaboration",
        desc: "Invite relatives to contribute photos, stories, and information together."
    },
    {
        icon: <FaMobileAlt className="text-4xl text-emerald-600" />,
        title: "Mobile Friendly",
        desc: "Access and edit your tree anytime from your phone or tablet."
    },
    {
        icon: <FaSearch className="text-4xl text-emerald-600" />,
        title: "Smart Matching",
        desc: "Automatically find and suggest connections from public records."
    },
    {
        icon: <FaLock className="text-4xl text-emerald-600" />,
        title: "Privacy First",
        desc: "Full control over who sees what. Share privately or publicly."
    },
    {
        icon: <FaCloud className="text-4xl text-emerald-600" />,
        title: "Cloud Backup",
        desc: "Your family history is safely stored and automatically backed up."
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 bg-gray-50 dark:bg-[#121212]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Everything You Need to Preserve Your Legacy
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Powerful tools designed for families who want to stay connected across generations.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group border dark:border-gray-800"
                        >
                            <div className="mb-6">{feature.icon}</div>
                            <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}