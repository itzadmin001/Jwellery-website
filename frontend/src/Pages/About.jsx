import Container from "../Components/Container";
import About1 from "../assets/Images/1.jpeg";
import About2 from "../assets/Images/2.jpeg";
import About3 from "../assets/Images/3.jpeg";
import About4 from "../assets/Images/4.jpeg";
import About5 from "../assets/Images/7.jpeg";


function About() {
    return (
        <section className="bg-white text-gray-800">
            <Container>
                {/* ===== Logo + Owner ===== */}
                <div className="text-center py-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold">
                        Deen Dayal Rajkumar Jewellers
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        <span className="font-semibold">Dr. Deepak Sankit</span>
                    </p>
                </div>

                {/* ===== Our Journey ===== */}
                <div className="grid md:grid-cols-2 gap-10 items-center mb-20 sm:text-left text-center">
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-4 ">
                            Our Journey & Heritage
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            The art of Meenakari (enamelling on gold ornaments) has been
                            pursued by our family for more than 400 years, passed from
                            grandfather to son, and son to grandson. In 1906, Late Shri
                            Khaniya Lal Ji moved the business from New Delhi to Jaipur—the
                            Pink City. His artistry was recognized by Maharaja Ganga Singhji,
                            who invited him to design ornaments for his son Kunwar Sadul
                            Singhji, bringing life into heritage through expert enameling.
                        </p>
                    </div>
                    <img src={About1} alt="Meenakari Art" className="rounded-lg shadow-md" />
                </div>

                {/* ===== Store Legacy ===== */}
                <div className="grid md:grid-cols-2 gap-10 items-center mb-20 sm:text-left text-center">
                    <img src={About2} alt="Jewellery Store" className="rounded-lg shadow-md order-2 md:order-1" />
                    <div className="order-1 md:order-2">
                        <h2 className="text-2xl font-serif font-bold mb-4">
                            Flagship Store in Jaipur
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Since 1952, our flagship store has stood as a recognized landmark
                            in Jaipur. Nestled in the heart of the city, it reflects the
                            perfect balance of heritage, trust, and contemporary elegance,
                            serving generations of loyal customers.
                        </p>
                    </div>
                </div>

                {/* ===== Owner Story ===== */}
                <div className="grid md:grid-cols-2 gap-10 items-center mb-20 sm:text-left text-center">
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-4">
                            Dr. Deepak Sankit – Reviving Tradition with Innovation
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            A national awardee Meenakari artist, Dr. Deepak Sankit continues
                            the family’s 400-year-old tradition. Honored with the National
                            Merit Award in 2003 and the Raja Bhagwant Das Award in 2018, his
                            work has been showcased globally—from New York to Budapest,
                            Australia, Switzerland, and more. Inspired by the Jaipur City
                            Palace, he crafts exquisite rings, necklaces, earrings, cufflinks,
                            and hand-painted motifs of birds, animals, and florals.
                        </p>
                    </div>
                    <img src={About3} alt="Deepak Sankit Work" className="rounded-lg shadow-md" />
                </div>

                {/* ===== The Craft ===== */}
                <div className="grid md:grid-cols-2 gap-10 items-center mb-20 sm:text-left text-center">
                    <img src={About4} alt="Final Touch Jewellery" className="rounded-lg shadow-md order-2 md:order-1" />
                    <div className="order-1 md:order-2">
                        <h2 className="text-2xl font-serif font-bold mb-4">
                            The Essence of Meenakari
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Meenakari is more than an art; it’s a legacy. Our designs are
                            created with hot enameling and gold foiling techniques, requiring
                            months of craftsmanship. Each creation undergoes meticulous
                            finishing, polishing, and detailing, ensuring every piece is
                            flawless. Today, Deepak Sankit not only preserves this art but
                            also trains thousands of young artisans, inspiring them to embrace
                            change while respecting tradition.
                        </p>
                    </div>
                </div>

                {/* ===== Achievements Section ===== */}
                <div className=" py-12 sm:text-left text-center ">
                    <div className=" mb-10">
                        <img src={About5} alt="" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-4">
                        Achievements & Recognition
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Dr. Sankit’s meenakari art has been honored globally with the World
                        Crafts Council Award of Excellence (2018) and showcased at the United
                        Nations, Honolulu, Vancouver, and other prestigious platforms. His
                        commitment to innovation ensures this age-old art continues to
                        thrive in the modern world.
                    </p>
                </div>
            </Container>
        </section>
    );
}

export default About;
