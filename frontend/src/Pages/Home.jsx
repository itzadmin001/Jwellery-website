import Container from "../Components/Container"
import BunnerImage from "../../public/Images/BG1.jpg"
import Product1 from "../../public/Images/Product1.png"
import Product2 from "../../public/Images/Product2.png"
import Product3 from "../../public/Images/_BG70137.jpg"
import ProductCard from "../Components/ProductCard"
import { Link } from "react-router-dom"
import CustomerReview from "../Components/CustomerReview"




function Home() {
    return (
        <div>
            <Hero />
            <AboutUs />
            <FeaturedCategory />
        </div>
    )
}


const Hero = () => {
    return (
        <section className="w-full bg-[#FDFDFD]">
            <Container classes="flex items-center justify-between">

                <div className=" font-semibold w-2/3 p-2">
                    <h3 className="text-gray-700 md:text-xl text-sm uppercase">Emporia Dr </h3>
                    <h1 className="md:text-4xl font-serif ">Flagship Store of Deen Dayal Rajkumar Jewellers</h1>
                    <div className="mt-5 ">
                        <button className=" bg-yellow-400 hover:bg-yellow-500 duration-300 px-6 py-2 rounded-md text-white cursor-pointer">Shop Now</button>
                    </div>
                </div>

                <div className="flex items-center justify-center h-full w-1/2">
                    <img src={BunnerImage} alt="Banner" className="max-h-[80%] object-contain mt-10" />
                </div>
            </Container>
        </section>

    )
}


const AboutUs = () => {
    return (
        <section>
            <Container>
                <div className="text-center mt-10">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                        <div className="font-serif text-2xl md:text-3xl tracking-wider">
                            <span className="text-gray-800">About Us</span>
                        </div>
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                    </div>
                </div>


                <div className="w-full p-2  grid grid-cols-2 gap-4 mt-10">
                    <div className=" p-4 ">
                        <h1 className=" md:text-xl font-semibold font-serif">The Art of Meenakari – A Legacy of 400 Years</h1>
                        <p className=" md:text-sm text-xs text-gray-500">For four centuries, the exquisite art of Meenakari has been lovingly pursued by our family, preserving tradition while embracing elegance. Each piece reflects a deep heritage of craftsmanship and timeless beauty.</p>
                    </div>
                    <div className=" p-4 ">
                        <h1 className=" text-xl font-semibold  font-serif">Flagship Store of Deen Dayal Rajkumar Jewellers</h1>
                        <p className="  md:text-sm text-xs text-gray-500">Located in the heart of the city, our flagship store has been a recognized landmark since 1952, offering customers a blend of heritage and contemporary elegance</p>
                    </div>
                    <div className=" p-4 ">
                        <h1 className=" text-xl font-semibold  font-serif">USP – Uniquely Striking Designs</h1>
                        <p className="  md:text-sm text-xs text-gray-500">Our jewelry stands out with strangely beautiful designs and exquisite embellishments that draw attention, making every wearer shine with distinction.</p>
                    </div>
                    <div className=" p-4 ">
                        <h1 className=" text-xl font-semibold  font-serif">Final Touch</h1>
                        <p className="  md:text-sm text-xs text-gray-500">Every creation receives meticulous finishing, polishing, and detailing, ensuring that the final piece is flawless and ready to make a statement.</p>
                    </div>

                </div>

                <div className="w-full grid md:grid-cols-2 gap-4 font-semibold  items-center justify-between mt-10 p-4 ">
                    <div className=" flex items-center cursor-pointer  gap-2 bg-[#FDFDFD] rounded-lg">
                        <img src={Product1} alt="" className="w-52" />
                        <div >
                            <h1 className="text-xl ">Shop For Silver Bangle</h1>
                            <button className=" border-b mt-2 cursor-pointer hover:text-yellow-400 duration-300">Shop Now</button>
                        </div>
                    </div>
                    <div className=" cursor-pointer flex items-center gap-2 bg-[#FDFDFD] rounded-lg">
                        <img src={Product2} alt="" className=" w-52 " />
                        <div>
                            <h1 className="text-xl ">Silver Afghani Earring</h1>
                            <button className=" border-b mt-2 cursor-pointer hover:text-yellow-400 duration-300">Shop Now</button>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    )
}


const FeaturedCategory = () => {
    const reviewsData = [
        {
            id: 1,
            name: "Mr. Reema Cyrus",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has...",
            image: "https://i.pravatar.cc/100?img=5",
        },
        {
            id: 2,
            name: "Stephanie MacMohan",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has...",
            image: "https://i.pravatar.cc/100?img=8",
        },
    ];

    return (
        <section>
            <Container>
                <div className="text-center mt-10">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                        <div className="font-serif text-2xl md:text-3xl tracking-wider">
                            <span className="text-gray-800">Featured category</span>
                        </div>
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                    </div>
                </div>


                <div className="flex items-center justify-center p-4 gap-4">
                    <Link className=" px-3 py-2 bg-[#fdfdfd] rounded-md hover:text-yellow-500 duration-300">Eearings</Link>
                    <Link className=" px-3 py-2 bg-[#fdfdfd] rounded-md hover:text-yellow-500 duration-300">Jhumki</Link>
                    <Link className=" px-3 py-2 bg-[#fdfdfd] rounded-md hover:text-yellow-500 duration-300">Bangle</Link>
                    <Link className=" px-3 py-2 bg-[#fdfdfd] rounded-md hover:text-yellow-500 duration-300">Gold</Link>

                </div>

                <div className="mt-10 grid lg:grid-cols-5 sm:grid-cols-3  grid-cols-2 gap-6">
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
            <div className=" mt-20 bg-[#FDFDFD]">
                <div className="text-center mt-10">
                    <div className="flex items-center justify-center gap-4 py-10">
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                        <div className="font-serif text-2xl md:text-3xl tracking-wider">
                            <span className="text-gray-800 " >Customer Reviews</span>
                        </div>
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                    </div>
                </div>
                <CustomerReview reviews={reviewsData} />;
            </div>
        </section>
    )
}




export default Home
