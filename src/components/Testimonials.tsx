const testimonials = [
    {
        name: "Mazi Chi",
        location: "Shanghai, China",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "I finally connected with cousins I never knew existed. This platform helped me trace my family back to 1890s.",
    },
    {
        name: "Matthews John",
        location: "Nottingham, UK",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "The collaboration feature is amazing. My entire family contributes together. Best decision I made this year.",
    },
    {
        name: "Cynthia Henry",
        location: "Oslo, Norway",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        text: "So easy to use! Even my 70-year-old mother enjoys adding stories and photos to the tree.",
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-emerald-50 dark:bg-[#121212]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Real Families, Real Stories</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl shadow-sm border dark:border-gray-800">
                            <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-8">“{t.text}”</p>
                            <div className="flex items-center gap-4">
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}