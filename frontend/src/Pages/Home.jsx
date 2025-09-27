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
            backgroundPosition: "center",
        }}>
            <Container classes="flex items-center  ">
                <div className=" font-semibold w-2/3 px-3 mt-5">
                    <h1 className="lg:text-6xl sm:pr-20 text-white md:text-5xl sm:text-4xl text-xl font-serif tracking-tight ">Flagship Store of Deen Dayal Rajkumar Jewellers</h1>
                    <div className="mt-5">
                        <Link to={"/store"} className=" bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 sm:px-6 px-4 py-2 rounded-md text-white cursor-pointer">Shop Now</Link>
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

                                    <CategoryProduct key={i} data={item} />
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
                            to="/store"
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
                            <Link to={"/store"} className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-full shadow-md hover:scale-105 transition cursor-pointer">
                                Shop {item.title}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};




const AboutUs = () => {


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



                <div className="w-full p-2  grid sm:grid-cols-2 gap-4 mt-10">
                    <div className="p-4 flex md:flex-row flex-col items-center gap-6 text-center md:text-left">
                        <img src={ArtJwellery} alt="" className="w-22" />
                        <div>
                            <h1 className=" sm:text-xl font-semibold font-serif">The Art of Meenakari – A Legacy of 400 Years</h1>
                            <p className=" md:text-sm text-xs text-gray-500">For four centuries, the exquisite art of Meenakari has been lovingly pursued by our family, preserving tradition while embracing elegance. Each piece reflects a deep heritage of craftsmanship and timeless beauty.</p>
                        </div>
                    </div>
                    <div className=" p-4 flex  md:flex-row flex-col items-center gap-6 text-center md:text-left">
                        <img src={JwelleryShop} alt="" className="w-22" />
                        <div>
                            <h1 className=" sm:text-xl font-semibold  font-serif">Flagship Store of Deen Dayal Rajkumar Jewellers</h1>
                            <p className="  md:text-sm text-xs text-gray-500">Located in the heart of the city, our flagship store has been a recognized landmark since 1952, offering customers a blend of heritage and contemporary elegance</p>

                        </div>
                    </div>
                    <div className="p-4 flex md:flex-row flex-col items-center gap-6 text-center md:text-left">
                        <img src={BeautyfullArt} alt="" className="w-22" />
                        <div>
                            <h1 className=" sm:text-xl font-semibold  font-serif">USP – Uniquely Striking Designs</h1>
                            <p className="  md:text-sm text-xs text-gray-500">Our jewelry stands out with strangely beautiful designs and exquisite embellishments that draw attention, making every wearer shine with distinction.</p>

                        </div>
                    </div>
                    <div className=" p-4 flex md:flex-row flex-col  items-center gap-6 text-center md:text-left">
                        <img src={FinalTouch} alt="" className="w-22" />
                        <div>
                            <h1 className=" sm:text-xl font-semibold  font-serif">Final Touch</h1>
                            <p className="  md:text-sm text-xs text-gray-500">Every creation receives meticulous finishing, polishing, and detailing, ensuring that the final piece is flawless and ready to make a statement.</p>

                        </div>
                    </div>

                </div>
            </Container>
        </section>
    )
}



export default Home 