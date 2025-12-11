import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    const comicTypes = [
        { name: "Manga", count: 150, seed: "manga" },
        { name: "Manhwa", count: 89, seed: "manhwa" },
        { name: "Manhua", count: 67, seed: "manhua" },
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <nav className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-white">
                                Look 'N Read
                            </h1>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                Latest
                            </button>
                            <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                Popular
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Type Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {comicTypes.map((type) => (
                        <div
                            key={type.name}
                            className="group cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">
                                    {type.name}
                                </h2>
                                <span className="text-sm text-gray-400">
                                    {type.count} titles
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="aspect-[2/3] rounded-lg overflow-hidden"
                                    >
                                        <img
                                            src={`https://picsum.photos/seed/${type.seed}${i}/200/300`}
                                            alt={`${type.name} ${i}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Latest Updates */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Latest Updates
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                                    <img
                                        src={`https://picsum.photos/seed/comic${i}/300/450`}
                                        alt={`Comic ${i}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-sm font-medium text-gray-300 truncate group-hover:text-purple-400 transition-colors">
                                        Comic Title {i}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Chapter {i * 5}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
