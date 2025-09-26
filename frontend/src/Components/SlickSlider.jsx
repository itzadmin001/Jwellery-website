import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Dummy Container component (if you already have it, remove this and use yours)
function Container({ classes, children }) {
    return <div className={classes}>{children}</div>;
}

function SlickSlider() {
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const slides = [
        {
            image: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg",
            title: "Luxury at a price you’ll love",
            subtitle: "Weekly Highlight",
            desc: "Discover handcrafted pieces with timeless elegance.",
        },
        {
            image: "https://images.pexels.com/photos/2987880/pexels-photo-2987880.jpeg",
            title: "Elegance in Every Detail",
            subtitle: "New Collection",
            desc: "Handcrafted diamond & gold pieces for every occasion.",
        },
        {
            image: "https://images.pexels.com/photos/3266703/pexels-photo-3266703.jpeg",
            title: "Shine with Confidence",
            subtitle: "Trending Now",
            desc: "Make your style unforgettable with our exclusive designs.",
        },
        {
            image: "https://images.pexels.com/photos/13787988/pexels-photo-13787988.jpeg",
            title: "Timeless Beauty",
            subtitle: "Classic Collection",
            desc: "Discover the power of tradition with modern elegance.",
        },
        {
            image: "https://images.pexels.com/photos/3641055/pexels-photo-3641055.jpeg",
            title: "Luxury You Deserve",
            subtitle: "Special Offer",
            desc: "Get exclusive deals on fine jewellery this week.",
        },
    ];

    return (
        <div className="slider-container w-full">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="relative h-[60vh]">
                        {/* Background Image */}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay Text */}
                        <Container classes="absolute inset-0 flex items-center bg-black/40">
                            <div className="px-6 sm:px-10">
                                <p className="text-xs uppercase tracking-widest text-white font-semibold">
                                    {slide.subtitle}
                                </p>
                                <h2 className="mt-1 text-xl sm:text-4xl font-extrabold text-white">
                                    {slide.title}
                                </h2>
                                <p className="mt-1 text-sm text-white max-w-md">
                                    {slide.desc}
                                </p>
                            </div>
                        </Container>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default SlickSlider;
