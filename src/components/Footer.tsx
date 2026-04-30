import Link from 'next/link';
import { FaTree, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-600 text-gray-400 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-5 gap-10">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 text-white mb-6">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                                <FaTree size={26} />
                            </div>
                            <span className="text-3xl font-bold">AncestryLink</span>
                        </div>
                        <p className="max-w-md">
                            Preserving African families' legacies, one branch at a time.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="hover:text-white">Features</Link></li>
                            <li><Link href="#" className="hover:text-white">How it Works</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="hover:text-white">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-white">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p>© 2026 Voostech. All rights reserved.</p>

                    <div className="flex gap-6 text-2xl">
                        <a href="#" className="hover:text-white"><FaTwitter /></a>
                        <a href="#" className="hover:text-white"><FaInstagram /></a>
                        <a href="#" className="hover:text-white"><FaFacebook /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}