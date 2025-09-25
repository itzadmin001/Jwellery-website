import Container from "../Components/Container"
import JwelleryShop from "../assets/Images/jewelry-shop.png"
import ArtJwellery from "../assets/Images/jewellery.png"
import FinalTouch from "../assets/Images/jewelry.png"
import BeautyfullArt from "../assets/Images/jewels.png"

function About() {

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
                <div className="text-center mt-20">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                        <div className="font-serif text-2xl md:text-3xl tracking-wider">
                            <span className="text-gray-800">About Us</span>
                        </div>
                        <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                    </div>
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

export default About
