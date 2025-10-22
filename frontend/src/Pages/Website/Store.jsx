// Store.jsx
import React, { useContext, useState, Suspense, lazy, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from "react-icons/fi";
import Container from "../../Components/Website/Container";
import Product3 from "../../../public/Images/_BG70137.jpg";
import SlickSlider from "../../Components/Website/SlickSlider";
import { MainContext } from "../../ContextMain";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ProductCard = lazy(() => import("../../Components/Website/ProductCard"));

function SectionHeader({ title, isOpen, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-800"
            aria-expanded={isOpen}
        >
            <span>{title}</span>
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
    );
}

function LoaderFallback() {
    return (
        <div className="w-full py-10 flex items-center justify-center">
            <div className="animate-pulse text-gray-600">Loading products...</div>
        </div>
    );
}

function Store() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const {
        Productdata,
        Category,
        SetProductdata,
        fetchProduct,
        fectchCategory,
        loading,
        categoryImages
    } = useContext(MainContext);

    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [limit, Setlimit] = useState(20);
    const { category } = useParams()
    const [SearchParams] = useSearchParams()
    const [price, setPrice] = useState("");
    const [debouncedPrice, setDebouncedPrice] = useState(price);
    const [activeSubCategory, SetActiveSubcategory] = useState(null)

    const [openSections, setOpenSections] = useState({
        categories: true,
        price: true,
        availability: true,
    });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedPrice(price), 500);
        return () => clearTimeout(timer);
    }, [price]);




    const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

    const params = useParams();
    const navigate = useNavigate();


    const getData = () => {
        fetchProduct(limit, category)
            .then((success) => {
                SetProductdata(success.data)
            }).catch((err) => {
                SetProductdata([])
            })
    }

    const seturlQuery = () => {
        const Urlquery = new URLSearchParams({ limit })
        const curruntUrl = window.location.pathname;
        const newurl = curruntUrl + "?" + Urlquery.toString()
        window.history.pushState({ path: newurl }, "", newurl)
    }

    useEffect(() => {
        getData()
        fectchCategory();
    }, [])

    useEffect(
        () => {
            const Searchlimit = SearchParams.get("limit");
            if (Searchlimit != null) {
                if (Searchlimit != null) Setlimit(Searchlimit);
            }
        }, []
    )

    useEffect(() => {
        seturlQuery()
    }, [limit, category])


    useEffect(
        () => {
            fetchProduct({
                limit,
                price: debouncedPrice,
                category
            })
                .then((success) => {
                    SetProductdata(success.data)

                }).catch((err) => {
                    SetProductdata([])
                })
        }, [limit, debouncedPrice, category]
    )

    useEffect(
        () => {
            const Searchlimit = SearchParams.get("limit");
            if (Searchlimit != null) {
                if (Searchlimit != null) Setlimit(Searchlimit);
            }
        }, []
    )

    const handleCategorySelect = (item) => {
        if (activeCategoryId === item._id) {
            setActiveCategoryId(null);
        } else {
            const slug = item.slug || item._id;
            setActiveCategoryId(item._id);
        }
    };

    const NavigateHandler = (Category, data) => {
        if (activeSubCategory === data) {
            navigate(`/store/${Category}`)
        } else {
            navigate(`/store/${Category}/${data}`)
        }
    }


    return (
        <main className="bg-[#faf7f3]">
            {/* Banner */}
            <section aria-label="Promotion" className="pb-4">
                <div className="relative overflow-hidden bg-amber-200/40">
                    <SlickSlider Category={Category} categoryImages={categoryImages} />
                </div>
            </section>

            {/* Content */}
            <div className="py-4 sm:px-10 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <aside className="lg:col-span-2">
                        {/* Mobile filter toggle */}
                        <div className="lg:hidden mb-3">
                            <button
                                type="button"
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm text-sm font-semibold"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <FiFilter /> Filters
                            </button>
                        </div>

                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block sticky top-5  overflow-y-auto rounded-2xl bg-white p-4 shadow-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {/* Categories */}
                            <div className="border-b border-gray-100">
                                <SectionHeader title="Categories" isOpen={openSections.categories} onToggle={() => toggleSection("categories")} />
                                {openSections.categories && (
                                    <div className="pb-4 space-y-2 text-sm text-gray-700">
                                        {Category.map((item) => {
                                            return (
                                                <div key={item._id}>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={activeCategoryId === item._id}
                                                            onChange={() => {
                                                                handleCategorySelect(item)
                                                                NavigateHandler(item.slug, activeSubCategory)
                                                            }}
                                                            className="accent-[#C19B50] cursor-pointer"
                                                        />
                                                        <span>{item?.name}</span>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="border-b border-gray-100">
                                <SectionHeader title="Price" isOpen={openSections.price} onToggle={() => toggleSection("price")} />
                                {openSections.price && (
                                    <div className="pb-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input type="number" placeholder="Min" className="w-1/2 rounded-md border-gray-200 text-sm" />
                                            <input type="number" placeholder="Max" className="w-1/2 rounded-md border-gray-200 text-sm" />
                                        </div>
                                        <input type="range" min="0" max="20000" className="w-full accent-[#C19B50]" onChange={(e) => setPrice(e.target.value)} />
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>₹0</span>
                                            <span>₹5000</span>
                                            <span>₹2000+</span>
                                        </div>
                                    </div>
                                )}
                            </div>



                        </div>
                    </aside>

                    {/* Mobile Filters Drawer */}
                    {mobileFiltersOpen && (
                        <div className="lg:hidden fixed inset-0 z-50">
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
                            <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-white rounded-r-2xl shadow-2xl flex flex-col">
                                <div className="flex items-center justify-between p-5 border-b">
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FiFilter /> Filters
                                    </h2>
                                    <button className="cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition" onClick={() => setMobileFiltersOpen(false)}>
                                        <FiX className="text-gray-700" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-gray-700">
                                    {/* Mobile categories: same logic as desktop */}
                                    <div className="border-b border-gray-100">
                                        <SectionHeader title="Categories" isOpen={openSections.categories} onToggle={() => toggleSection("categories")} />
                                        {openSections.categories && (
                                            <div className="pb-4 space-y-2">
                                                {Category.map((item) => (
                                                    <label key={item._id} className="flex items-center gap-2">
                                                        <input type="checkbox" checked={activeCategoryId === item._id} onChange={() => handleCategorySelect(item)} className="accent-[#C19B50]" />
                                                        <span>{item?.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="p-4 border-t bg-white">
                                    <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-[#C19B50] hover:bg-[#a4833f] text-white font-semibold py-2.5 rounded-xl shadow-md transition">
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    <section className="lg:col-span-10">
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-gray-600">{Productdata?.length} Products</p>
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-gray-700">Sort by</label>
                                <select className="rounded-md border-gray-200 text-sm">
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Top Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Use Suspense for lazy-loaded product card rendering; show local loader when context.loading is true */}
                        {loading ? (
                            <LoaderFallback />
                        ) : (
                            <Suspense fallback={<LoaderFallback />}>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {Productdata?.map((item, i) => {
                                        return <ProductCard key={item._id || i} data={item} />;
                                    })}
                                </div>
                            </Suspense>
                        )}

                        <div className="mt-5 text-center">
                            <button className=" bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 sm:px-6 px-4 py-2 rounded-md text-white cursor-pointer">Load More</button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Store;
