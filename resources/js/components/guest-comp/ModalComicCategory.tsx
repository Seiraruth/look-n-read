import { Fragment } from "react/jsx-runtime";
import CardComic from "./CardComic";
import { useContext, useEffect } from "react";
import { Context } from "@/context/Context";

const ModalComicCategory = () => {
    const {
        categoryComics,
        isCategoryLoading,
        expandedCategory,
        setExpandedCategory,
        setCategoryComics,
    } = useContext(Context);

    const closeModal = () => {
        setExpandedCategory(null);
        setCategoryComics([]);
    };

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        if (expandedCategory) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [expandedCategory]);

    return (
        <>
            {/* Modal Overlay for Expanded Category */}
            {expandedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop with blur effect */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-7xl mx-4 max-h-[90vh] bg-slate-900/95 rounded-2xl border border-purple-500/30 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                            <h2 className="text-3xl font-bold text-white">
                                {expandedCategory} Comics
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-300 hover:text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {categoryComics.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {categoryComics
                                        .filter((comic) => comic && comic.id)
                                        .map((comic) => (
                                            <Fragment key={comic.id}>
                                                <CardComic
                                                    comic={comic}
                                                    isLoading={
                                                        isCategoryLoading
                                                    }
                                                    closeModal={closeModal}
                                                />
                                            </Fragment>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                        No {expandedCategory?.toLowerCase()}{" "}
                                        found
                                    </h3>
                                    <p className="text-gray-400">
                                        Try checking back later for new
                                        additions!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalComicCategory;
