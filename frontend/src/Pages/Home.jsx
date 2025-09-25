import Container from "../Components/Container"
import BunnerImage from "../../public/Images/Bunner.jpg"
import Product1 from "../../public/Images/Product1.png"
import Product2 from "../../public/Images/Product2.png"
import Product3 from "../../public/Images/_BG70137.jpg"
import ProductCard from "../Components/ProductCard"
import LOGO from "../../public/LOGO.png"

// categroy product 
import EaringCategory from "../assets/Images/earing.JPG"
import { Link } from "react-router-dom"
import About from "./About"
import CategoryProduct from "../Components/CategoryProduct"
import PliqueEaring from "../assets/Images/Plique-earing.JPEG"
import AfghaniEarring from "../assets/Images/Afgani-earing.JPEG"
import MeenaKariJhumki from "../assets/Images/Minakari-Jhumki.JPEG"
import TiePin from "../assets/Images/Tie-pin.jpg"


function Home() {
    return (
        <div>
            <Hero />
            <Category />
            <FeaturedCategory />
            <About />
        </div>
    )
}


const Hero = () => {
    return (
        <section className="w-full bg-[#FDFDFD] md:h-[100vh] h-[60vh] flex items-center" style={{
            backgroundImage: `url(${BunnerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            <Container classes="flex items-center">
                <div className=" font-semibold w-2/3 px-4">
                    {/* <h3 className="text-gray-200 sm:text-xl text-xs uppercase">Emporia <span className=" text-yellow-500">Dr</span> </h3> */}
                    <img src={LOGO} alt="" className="w-1/3" />
                    <h1 className="lg:text-6xl text-white md:text-5xl sm:text-4xl text-xl font-serif tracking-tighter ">Flagship Store of Deen Dayal Rajkumar Jewellers</h1>
                    <div className="mt-5 ">
                        <button className=" border-2 border-yellow-500 hover:bg-yellow-600 duration-300 sm:px-6 px-4 py-2 rounded-md text-white cursor-pointer">Shop Now</button>
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
                        src="https://images.pexels.com/photos/1165615/pexels-photo-1165615.jpeg"
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






export default Home
