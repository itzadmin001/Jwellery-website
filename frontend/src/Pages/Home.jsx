import Container from "../Components/Container"
import BunnerImage from "../../public/Images/Bunner.jpg"
import Product3 from "../../public/Images/_BG70137.jpg"
import ProductCard from "../Components/ProductCard"
import LOGO from "../../public/LOGO.png"

// categroy product 
import { Link } from "react-router-dom"

import CategoryProduct from "../Components/CategoryProduct"
import MeenaKariJhumki from "../assets/Images/Minakari-Jhumki.JPEG"



// About Us
import JwelleryShop from "../assets/Images/jewelry-shop.png"
import ArtJwellery from "../assets/Images/jewellery.png"
import FinalTouch from "../assets/Images/jewelry.png"
import BeautyfullArt from "../assets/Images/jewels.png"



function Home() {
    return (
        <div>
            <Hero />
            <Category />
            <FeaturedCategory />
            <CustomProduct />
            <AboutUs />
        </div>
    )
}


const Hero = () => {
    return (
        <section className="w-full bg-[#FDFDFD] md:h-[100vh] h-[60vh] flex items-center overflow-hidden" style={{
            backgroundImage: `url(${BunnerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            <Container classes="flex items-center">
                <div className=" font-semibold w-2/3 px-4">
                    <img src={LOGO} alt="" className="w-1/3" />
                    <h1 className="lg:text-6xl text-white md:text-5xl sm:text-4xl text-xl font-serif tracking-tighter ">Flagship Store of Deen Dayal Rajkumar Jewellers</h1>
                    <div className="mt-5 ">
                        <button className=" bg-yellow-500 hover:bg-yellow-600 duration-300 sm:px-6 px-4 py-2 rounded-md text-white cursor-pointer">Shop Now</button>
                    </div>
                </div>
            </Container>
        </section>

    )
}


const Category = () => {



    const Categories = [
        {
            name: "Earring",
            imageUrl: "https://images.pexels.com/photos/13595301/pexels-photo-13595301.jpeg"
        },
        {
            name: "Gold",
            imageUrl: "https://images.pexels.com/photos/230289/pexels-photo-230289.jpeg"
        },
        {
            name: "Bangle",
            imageUrl: "https://i.pinimg.com/736x/a7/d0/4a/a7d04a9662dd4fd48c9a032e7bbcc8ec.jpg"
        },
        {
            name: "Silver collection",
            imageUrl: "https://images.pexels.com/photos/5409533/pexels-photo-5409533.jpeg"
        },
        {
            name: "Plique Earring",
            imageUrl: "https://i.pinimg.com/1200x/80/6e/db/806edb82642ffc7161f094e943bb660e.jpg"
        },
        {
            name: " Jhumki",
            imageUrl: MeenaKariJhumki
        },
        {
            name: " Jhumki",
            imageUrl: MeenaKariJhumki
        },
    ]


    return (
        <section>
            <Container>
                <div className="w-full mt-10 sm:p-4">

                    <div className="text-center ">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                            <div className="font-serif text-2xl md:text-3xl tracking-wider">
                                <span className="text-gray-800">Popular Category</span>
                            </div>
                            <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                        </div>
                    </div>
                    <div className=" flex items-center gap-8 justify-center mt-10 overflow-x-auto scroll">

                        {
                            Categories.map((item, i) => {
                                return (

                                    <CategoryProduct data={item} />
                                )
                            })
                        }
                    </div>




                </div>
            </Container>
            <div className="mt-20 flex justify-center">
                <div className=" bg-black grid md:grid-cols-3 overflow-hidden w-full ">

                    <img
                        src="https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg "
                        alt="Exquisite Jewelry Collection"
                        className=" object-cover object-center w-full h-full"
                    />

                    <div className="md:col-span-2 flex flex-col justify-center p-8 text-white space-y-3">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Discover Timeless Elegance in Every Piece
                        </h2>
                        <p className="text-lg md:text-xl">
                            Emporia DR offers exquisitely handcrafted jewelry inspired by four centuries of Meenakari artistry. From vibrant necklaces to statement rings, each design captures heritage and sophistication.
                        </p>
                        <p className="text-lg md:text-xl">
                            Personalize your favorite creations or explore our curated collections to make every moment unforgettable.
                        </p>
                        <Link
                            to="/shop"
                            className="w-fit border-2 border-white  text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-black transition duration-300"
                            title="Shop Our Exclusive Jewelry Collection"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>

        </section>
    )
}


const FeaturedCategory = () => {



    const category = [
        {
            path: "/",
            name: "Eearings"
        },
        {
            name: "Jhumki",
            path: "/"
        },
        {
            name: "Bangle",
            path: "/"
        },
        {
            name: "Gold",
            path: "/"
        },
        {
            name: "Necklace",
            path: "/"
        }
    ]

    return (
        <section>
            <Container>
                <div className="text-center mt-10">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                        <div className="font-serif text-2xl md:text-3xl tracking-wider">
                            <span className="text-gray-800">Featured Products   </span>
                        </div>
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                    </div>
                </div>


                <div className="mt-10 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2  sm:gap-6 gap-2">
                    <ProductCard
                        image={Product3}
                        title="Elegant Silver Necklace"
                        price="120.00"
                    />
                    <ProductCard
                        image={Product3}
                        title="Elegant Silver Necklace"
                        price="120.00"
                    />
                    <ProductCard
                        image={Product3}
                        title="Elegant Silver Necklace"
                        price="120.00"
                    />
                    <ProductCard
                        image={Product3}
                        title="Elegant Silver Necklace"
                        price="120.00"
                    />
                    <ProductCard
                        image={Product3}
                        title="Elegant Silver Necklace"
                        price="120.00"
                    />

                    <ProductCard
                        image={Product3}
                        title="Elegant Silver Necklace"
                        price="120.00"
                    />
                    <ProductCard
                        image={Product3}
                        title="Elegant Silver Necklace"
                        price="120.00"
                    />
                    <ProductCard
                        image={Product3}
                        title="Elegant Silver Necklace"
                        price="120.00"
                    />

                </div>


            </Container>

        </section>
    )
}



const CustomProduct = () => {
    const sections = [
        {
            id: "rings",
            title: "Luxury Rings",
            description:
                "Handcrafted diamond & gold rings that sparkle with elegance. Perfect for engagements, anniversaries, or just to celebrate yourself.",
            image:
                "https://images.pexels.com/photos/3266703/pexels-photo-3266703.jpeg",
        },
        {
            id: "necklaces",
            title: "Designer Necklaces",
            description:
                "Discover our premium necklaces designed to elevate your beauty. From minimal gold chains to statement diamond pieces, we have it all.",
            image:
                "https://images.pexels.com/photos/6387623/pexels-photo-6387623.jpeg",
        },
        {
            id: "bracelets",
            title: "Premium Bangles",
            description:
                "Modern & traditional Bangles crafted with precision and passion. A perfect balance of culture and style.",
            image:
                "https://images.pexels.com/photos/29169323/pexels-photo-29169323.jpeg",
        },
    ];

    return (
        <section className="w-full relative font-sans py-12">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
                Explore Our Jewelry Collections
            </h2>

            <div className="flex flex-col gap-20 w-[90%] md:w-[85%] lg:w-[75%] mx-auto">
                {sections.map((item, index) => (
                    <div
                        key={item.id}
                        className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        {/* Image Section */}
                        <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={item.image}
                                alt={`${item.title} jewelry`}
                                className="w-full h-[350px] md:h-[400px] object-cover hover:scale-105 transition duration-500"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-5">
                                {item.description}
                            </p>
                            <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full shadow-md hover:scale-105 transition cursor-pointer">
                                Shop {item.title}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};


const AboutUs = () => {
    const features = [
        {
            icon: JwelleryShop,
            title: "Flagship Store of Deen Dayal Rajkumar Jewellers",
            description: "Our flagship store has been a recognized landmark in the city since 1952, serving as a beacon of heritage and contemporary elegance. Located in the heart of the city, we have been the trusted destination for generations of jewelry lovers.",
            color: "from-blue-500 to-cyan-500",
            stats: "Since 1952"
        },
        {
            icon: ArtJwellery,
            title: "400 Years of Meenakari Heritage",
            description: "The exquisite art of Meenakari has been lovingly pursued by our family for four centuries, preserving this traditional craft while embracing modern elegance. Each piece reflects our deep heritage of craftsmanship and timeless beauty.",
            color: "from-purple-500 to-pink-500",
            stats: "400+ Years"
        },
        {
            icon: BeautyfullArt,
            title: "Uniquely Striking Designs",
            description: "Our jewelry stands out with strangely beautiful designs and exquisite embellishments that make the beholder stand out. We create pieces that are not just accessories, but statements of individuality and elegance.",
            color: "from-green-500 to-teal-500",
            stats: "Unique Designs"
        },
        {
            icon: FinalTouch,
            title: "Meticulous Craftsmanship",
            description: "Every creation receives meticulous finishing, polishing, and detailing, ensuring that the final piece is flawless and ready to make a statement. Our commitment to perfection is evident in every piece we create.",
            color: "from-orange-500 to-red-500",
            stats: "Perfect Finish"
        }
    ]

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <Container>
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                        About Deen Dayal Rajkumar Jewellers
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Four centuries of tradition, craftsmanship, and excellence in jewelry making.
                        We are more than just a jewelry store - we are the custodians of an ancient art form
                        that has been passed down through generations.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <div key={index} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                            <div className="sm:flex  items-start gap-6">
                                <div className={`p-6 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg sm:group-hover:scale-105 transition-transform duration-300`}>
                                    <img src={feature.icon} alt={feature.title} className="w-16 mx-auto h-16 object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <span className="bg-yellow-100 text-yellow-800 sm:text-sm text-xs font-semibold text-center px-3 py-1 rounded-full">
                                            {feature.stats}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed sm:text-sm text-xs">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Company Stats */}
                <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                            Our Legacy in Numbers
                        </h3>
                        <p className="text-xl text-gray-300">
                            Four centuries of excellence, one family's commitment to perfection
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="text-5xl font-bold text-yellow-500 mb-2">400+</div>
                            <div className="text-gray-300 text-lg">Years of Heritage</div>
                            <div className="text-sm text-gray-400">Meenakari Art Tradition</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-5xl font-bold text-yellow-500 mb-2">1952</div>
                            <div className="text-gray-300 text-lg">Established</div>
                            <div className="text-sm text-gray-400">Flagship Store</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-5xl font-bold text-yellow-500 mb-2">100%</div>
                            <div className="text-gray-300 text-lg">Authentic</div>
                            <div className="text-sm text-gray-400">Handcrafted Pieces</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-5xl font-bold text-yellow-500 mb-2">∞</div>
                            <div className="text-gray-300 text-lg">Legacy</div>
                            <div className="text-sm text-gray-400">Timeless Beauty</div>
                        </div>
                    </div>
                </div>

                {/* Contact & Location Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-8   rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Our Store</h3>
                        <p className="text-gray-700 text-sm">
                            A139, Nadpuri Colony, Gurusharan Chabra Marg,
                            Hawa Sadak, Jaipur 302019,<br />
                            Rajasthan, India
                        </p>
                    </div>

                    <div className="text-center p-8  rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                        <p className="text-gray-600">+91-9414051055</p>
                    </div>

                    <div className="text-center p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                        <p className="text-gray-600">info@emporiadr.com</p>
                    </div>
                </div>
            </Container>
        </section>
    )
}




export default Home