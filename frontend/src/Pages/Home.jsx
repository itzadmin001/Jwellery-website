import Container from "../Components/Container"
import BunnerImage from "../../public/Images/Bunner.jpg"
import Product1 from "../../public/Images/Product1.png"
import Product2 from "../../public/Images/Product2.png"
import Product3 from "../../public/Images/_BG70137.jpg"
import ProductCard from "../Components/ProductCard"
import { Link } from "react-router-dom"
import About from "./About"




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
                    <h3 className="text-gray-200 sm:text-xl text-xs uppercase">Emporia <span className=" text-yellow-500">Dr</span> </h3>
                    <h1 className="lg:text-6xl text-white md:text-5xl sm:text-4xl text-xl font-serif tracking-tighter ">Flagship Store of Deen Dayal Rajkumar Jewellers</h1>
                    <div className="mt-5 ">
                        <button className=" bg-yellow-400 hover:bg-yellow-500 duration-300 sm:px-6 px-4 py-2 rounded-md text-white cursor-pointer">Shop Now</button>
                    </div>
                </div>

                {/* <div className="flex items-center justify-center h-full w-1/2">
                    <img src={BunnerImage} alt="Banner" className="max-h-[80%] object-contain mt-10" />
                </div> */}
            </Container>
        </section>

    )
}


const Category = () => {
    return (
        <section>
            <Container>
                <div className="w-full grid sm:grid-cols-2  gap-4 font-semibold  items-center sm:justify-between justify-center mt-10 p-4 ">
                    <div className="flex flex-col sm:flex-row items-center cursor-pointer gap-4 bg-[#FDFDFD] rounded-lg p-4">
                        <img src={Product1} alt="" className="w-40 md:w-52" />
                        <div className="text-center sm:text-left mt-2 sm:mt-0">
                            <h1 className="text-xl">Shop For Silver Bangle</h1>
                            <button className="border-b mt-2 cursor-pointer hover:text-yellow-400 duration-300">
                                Shop Now
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center cursor-pointer gap-4 bg-[#FDFDFD] rounded-lg p-4">
                        <img src={Product2} alt="" className="w-40 md:w-52" />
                        <div className="text-center sm:text-left mt-2 sm:mt-0">
                            <h1 className="text-xl">Silver Afghani Earring</h1>
                            <button className="border-b mt-2 cursor-pointer hover:text-yellow-400 duration-300">
                                Shop Now
                            </button>
                        </div>
                    </div>


                </div>
            </Container>
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
                            <span className="text-gray-800">Featured category</span>
                        </div>
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                    </div>
                </div>


                <div className="sm:flex hidden items-center justify-center p-4 gap-4">
                    {
                        category.map((item, i) => {
                            return (
                                <Link key={i} className=" px-3 py-2 bg-[#fdfdfd] rounded-md hover:text-yellow-500 duration-300">{item.name}</Link>

                            )
                        })
                    }

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

                </div>


            </Container>

        </section>
    )
}






export default Home
