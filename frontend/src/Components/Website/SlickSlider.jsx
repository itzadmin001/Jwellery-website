import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Dummy Container component (if you already have it, remove this and use yours)
function Container({ classes, children }) {
    return <div className={classes}>{children}</div>;
}

function SlickSlider({ title, images, settings }) {


    if (title === "Promotion") {

        return (
            <div className="slider-container w-full">
                <Slider {...settings}>
                    {images?.map((image, index) => (
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

    if (title === "Hero-Slider") {
        return (
            <div className="slider-container w-full h-full">
                <Slider {...settings}>
                    {images?.map((item, index) => (
                        <div key={index} className="relative w-full  h-[60vh] ">

                            {/* Background Image */}
                            <img
                                src={item.image}
                                alt={`Slide ${index}`}
                                className="w-full h-full object-cover "
                            />

                        </div>
                    ))}
                </Slider>
            </div>
        );
    }

}

export default SlickSlider;
