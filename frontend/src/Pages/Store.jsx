import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from 'react-icons/fi'
import Container from '../Components/Container'
import ProductCard from '../Components/ProductCard'
import Product3 from "../../public/Images/_BG70137.jpg"
import SlickSlider from '../Components/SlickSlider'

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
    )
}

function Store() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [openSections, setOpenSections] = useState({
        categories: true,
        price: true,
        availability: true,
        brand: true,
        size: true,
        color: true,
    })

    const [selectedGender, setSelectedGender] = useState({
        men: false,
        women: false,
    })

    const toggleSection = (key) =>
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))

    const handleGenderChange = (gender) => {
        setSelectedGender((prev) => ({
            ...prev,
            [gender]: !prev[gender],
        }))
    }

    const menCategories = ['Rings', 'Bracelets', 'Accessories']
    const womenCategories = ['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Accessories']

    return (
        <main className="bg-[#faf7f3]">

            {/* Banner */}
            <section aria-label="Promotion" className="pb-4">
                <div className="relative overflow-hidden bg-amber-200/40">
                    <SlickSlider />
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
                        <div className="hidden lg:block sticky top-5 min-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl bg-white p-4 shadow-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                            {/* Categories */}
                            <div className="border-b border-gray-100">
                                <SectionHeader
                                    title="Categories"
                                    isOpen={openSections.categories}
                                    onToggle={() => toggleSection('categories')}
                                />
                                {openSections.categories && (
                                    <div className="pb-4 space-y-2 text-sm text-gray-700">
                                        {/* Men */}
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedGender.men}
                                                onChange={() => handleGenderChange('men')}
                                                className="accent-[#C19B50]"
                                            />
                                            <span>Men</span>
                                        </label>
                                        {selectedGender.men && (
                                            <div className="pl-5 space-y-2">
                                                {menCategories.map((c) => (
                                                    <label key={c} className="flex items-center gap-2">
                                                        <input type="checkbox" className="accent-[#C19B50]" />
                                                        <span>{c}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {/* Women */}
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedGender.women}
                                                onChange={() => handleGenderChange('women')}
                                                className="accent-[#C19B50]"
                                            />
                                            <span>Women</span>
                                        </label>
                                        {selectedGender.women && (
                                            <div className="pl-5 space-y-2">
                                                {womenCategories.map((c) => (
                                                    <label key={c} className="flex items-center gap-2">
                                                        <input type="checkbox" className="accent-[#C19B50]" />
                                                        <span>{c}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="border-b border-gray-100">
                                <SectionHeader title="Price" isOpen={openSections.price} onToggle={() => toggleSection('price')} />
                                {openSections.price && (
                                    <div className="pb-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input type="number" placeholder="Min" className="w-1/2 rounded-md border-gray-200 text-sm" />
                                            <input type="number" placeholder="Max" className="w-1/2 rounded-md border-gray-200 text-sm" />
                                        </div>
                                        <input type="range" min="0" max="500" className="w-full accent-[#C19B50]" />
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>$0</span>
                                            <span>$250</span>
                                            <span>$500+</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="border-b border-gray-100">
                                <SectionHeader title="Availability" isOpen={openSections.availability} onToggle={() => toggleSection('availability')} />
                                {openSections.availability && (
                                    <div className="pb-4 space-y-2 text-sm text-gray-700">
                                        {['In stock', 'Preorder'].map((label) => (
                                            <label key={label} className="flex items-center gap-2">
                                                <input type="checkbox" className="accent-[#C19B50]" />
                                                <span>{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Brand */}
                            <div className="border-b border-gray-100">
                                <SectionHeader title="Brand" isOpen={openSections.brand} onToggle={() => toggleSection('brand')} />
                                {openSections.brand && (
                                    <div className="pb-4 space-y-2 text-sm text-gray-700">
                                        {['Aolie', 'Aurora', 'Eterna'].map((b) => (
                                            <label key={b} className="flex items-center gap-2">
                                                <input type="checkbox" className="accent-[#C19B50]" />
                                                <span>{b}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Size */}
                            <div className="border-b border-gray-100">
                                <SectionHeader title="Size" isOpen={openSections.size} onToggle={() => toggleSection('size')} />
                                {openSections.size && (
                                    <div className="pb-4 flex flex-wrap gap-2">
                                        {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                                            <button key={s} type="button" className="cursor-pointer px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-50">
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Color */}
                            <div>
                                <SectionHeader title="Color" isOpen={openSections.color} onToggle={() => toggleSection('color')} />
                                {openSections.color && (
                                    <div className="pb-1 flex flex-wrap gap-2">
                                        {['#000000', '#9b59b6', '#e74c3c', '#27ae60', '#2980b9', '#f1c40f', '#e67e22', '#ecf0f1'].map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                className="cursor-pointer w-6 h-6 rounded-full border hover:scale-110 transition-transform"
                                                style={{ backgroundColor: c }}
                                                aria-label={`Choose color ${c}`}
                                            />
                                        ))}
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
                                    <button
                                        className="cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                        onClick={() => setMobileFiltersOpen(false)}
                                    >
                                        <FiX className="text-gray-700" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-gray-700">

                                    {/* Categories */}
                                    <div className="border-b border-gray-100">
                                        <SectionHeader
                                            title="Categories"
                                            isOpen={openSections.categories}
                                            onToggle={() => toggleSection('categories')}
                                        />
                                        {openSections.categories && (
                                            <div className="pb-4 space-y-2">
                                                {/* Men */}
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGender.men}
                                                        onChange={() => handleGenderChange('men')}
                                                        className="accent-[#C19B50]"
                                                    />
                                                    <span>Men</span>
                                                </label>
                                                {selectedGender.men && (
                                                    <div className="pl-5 space-y-2">
                                                        {menCategories.map((c) => (
                                                            <label key={c} className="flex items-center gap-2">
                                                                <input type="checkbox" className="accent-[#C19B50]" />
                                                                <span>{c}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Women */}
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGender.women}
                                                        onChange={() => handleGenderChange('women')}
                                                        className="accent-[#C19B50]"
                                                    />
                                                    <span>Women</span>
                                                </label>
                                                {selectedGender.women && (
                                                    <div className="pl-5 space-y-2">
                                                        {womenCategories.map((c) => (
                                                            <label key={c} className="flex items-center gap-2">
                                                                <input type="checkbox" className="accent-[#C19B50]" />
                                                                <span>{c}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="border-b border-gray-100">
                                        <SectionHeader title="Price" isOpen={openSections.price} onToggle={() => toggleSection('price')} />
                                        {openSections.price && (
                                            <div className="pb-4 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <input type="number" placeholder="Min" className="w-1/2 rounded-md border-gray-200 text-sm" />
                                                    <input type="number" placeholder="Max" className="w-1/2 rounded-md border-gray-200 text-sm" />
                                                </div>
                                                <input type="range" min="0" max="500" className="w-full accent-[#C19B50]" />
                                                <div className="flex justify-between text-xs text-gray-600">
                                                    <span>$0</span>
                                                    <span>$250</span>
                                                    <span>$500+</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Availability */}
                                    <div className="border-b border-gray-100">
                                        <SectionHeader title="Availability" isOpen={openSections.availability} onToggle={() => toggleSection('availability')} />
                                        {openSections.availability && (
                                            <div className="pb-4 space-y-2">
                                                {['In stock', 'Preorder'].map((label) => (
                                                    <label key={label} className="flex items-center gap-2">
                                                        <input type="checkbox" className="accent-[#C19B50]" />
                                                        <span>{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Brand */}
                                    <div className="border-b border-gray-100">
                                        <SectionHeader title="Brand" isOpen={openSections.brand} onToggle={() => toggleSection('brand')} />
                                        {openSections.brand && (
                                            <div className="pb-4 space-y-2">
                                                {['Aolie', 'Aurora', 'Eterna'].map((b) => (
                                                    <label key={b} className="flex items-center gap-2">
                                                        <input type="checkbox" className="accent-[#C19B50]" />
                                                        <span>{b}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Size */}
                                    <div className="border-b border-gray-100">
                                        <SectionHeader title="Size" isOpen={openSections.size} onToggle={() => toggleSection('size')} />
                                        {openSections.size && (
                                            <div className="pb-4 flex flex-wrap gap-2">
                                                {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                                                    <button key={s} type="button" className="cursor-pointer px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-50">
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Color */}
                                    <div>
                                        <SectionHeader title="Color" isOpen={openSections.color} onToggle={() => toggleSection('color')} />
                                        {openSections.color && (
                                            <div className="pb-1 flex flex-wrap gap-2">
                                                {['#000000', '#9b59b6', '#e74c3c', '#27ae60', '#2980b9', '#f1c40f', '#e67e22', '#ecf0f1'].map((c) => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        className="cursor-pointer w-6 h-6 rounded-full border hover:scale-110 transition-transform"
                                                        style={{ backgroundColor: c }}
                                                        aria-label={`Choose color ${c}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 border-t bg-white">
                                    <button
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="w-full bg-[#C19B50] hover:bg-[#a4833f] text-white font-semibold py-2.5 rounded-xl shadow-md transition"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    <section className="lg:col-span-10">
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-gray-600">32 Products</p>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <ProductCard
                                    key={i}
                                    image={Product3}
                                    title="Elegant Silver Necklace"
                                    price="120.00"
                                />
                            ))}
                        </div>
                        <div className="mt-5 text-center">
                            <button className=" bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 sm:px-6 px-4 py-2 rounded-md text-white cursor-pointer">Load More</button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Store
