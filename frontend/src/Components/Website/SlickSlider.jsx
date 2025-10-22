import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Dummy Container component (if you already have it, remove this and use yours)
function Container({ classes, children }) {
    return <div className={classes}>{children}</div>;
}

function SlickSlider({ Category, categoryImages }) {
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        speed: 800,
        slidesToShow: 2,
        slidesToScroll: 1,
    };



    return (
        <div className="slider-container w-full">
            <Slider {...settings}>
                {categoryImages?.map((image, index) => (
                    <div key={index} className="relative h-[60vh] bg-white">
                        {/* Background Image */}
                        <img
                            src={image}
                            alt={`Slide ${index}`}
                            className="w-full h-full object-contain"
                        />

                        {/* Overlay Text */}
                        <Container classes="absolute inset-0 flex items-center bg-black/10">

                        </Container>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default SlickSlider;
