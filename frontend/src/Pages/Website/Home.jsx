import { lazy, Suspense, memo } from "react";

import Container from "../../Components/Website/Container"
import BunnerImage from "../../../public/Images/Bunner.jpg"
const ProductCard = lazy(() => import("../../Components/Website/ProductCard"));

// categroy product 
import { Link } from "react-router-dom"

const CategoryProduct = lazy(() => import("../../Components/Website/CategoryProduct"));



// About Us
import JwelleryShop from "../../assets/Images/jewelry-shop.png"
import ArtJwellery from "../../assets/Images/jewellery.png"
import FinalTouch from "../../assets/Images/jewelry.png"
import BeautyfullArt from "../../assets/Images/jewels.png"
import { useContext, useEffect } from "react"
import { MainContext } from "../../ContextMain"



function Home() {
    const { Category, Productdata, fetchProduct, SetProductdata } = useContext(MainContext)





    useEffect(() => {
        const cached = localStorage.getItem("productData");
        if (cached) {
            SetProductdata(JSON.parse(cached));
        } else {
            fetchProduct({ limit: 20 })
                .then((res) => {
                    SetProductdata(res.data);
                    localStorage.setItem("productData", JSON.stringify(res.data));
                })
                .catch(console.log);
        }
    }, []);


    return (
        <div>
            <Hero />
            <CategoryDisplay Category={Category} />
            <FeaturedCategory Productdata={Productdata} />
            <CustomProduct />
            <AboutUs />
        </div>
    )
}


const Hero = () => {
    return (
        <section className="relative w-full bg-[#FDFDFD] md:h-[100vh] h-[60vh] overflow-hidden flex items-center">
            <img
                src={BunnerImage}
                alt="Luxury jewelry background"
                loading="eager"
                fetchpriority="high"
                className="absolute inset-0 w-full h-full object-cover object-center"
                width="1920"
                height="1080"
            />

            <div className="absolute inset-0 bg-black/30" /> {/* overlay */}
            <Container classes=" relative z-10 flex lg:ml-10">
                <div className="font-semibold w-2/3 mt-5 text-white ">
                    <h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-xl font-serif tracking-tight ">
                        Flagship Store of Deen Dayal Rajkumar Jewellers
                    </h1>
                    <div className="mt-5">
                        <Link
                            to="/store"
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 sm:px-6 px-4 py-2 rounded-md text-white"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </Container>
        </section>

    )
}


const CategoryDisplay = memo(({ Category }) => {



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
                    <div className=" flex items-center gap-3 justify-center mt-10 overflow-x-auto scroll">
                        {/* product category */}
                        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
                            {Category.map((item, index) => (
                                <CategoryProduct key={item._id} data={item} index={index} />
                            ))}
                        </Suspense>

                    </div>
                </div>
            </Container>
            <div className="mt-20 flex justify-center">
                <div className=" bg-black grid md:grid-cols-3 overflow-hidden w-full ">
                    <img
                        src="https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Exquisite Jewelry Collection"
                        loading="lazy"
                        className="object-cover object-center w-full h-full"
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
})


const FeaturedCategory = memo(({ Productdata }) => {



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
                    {Productdata
                        .filter((item) => item.featured === true)
                        .map((item) => (
                            <ProductCard key={item._id} data={item}
                            />
                        ))}
                </div>
            </Container>
        </section>
    )
})



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