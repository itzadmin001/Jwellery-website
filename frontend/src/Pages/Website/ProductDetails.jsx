import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainContext } from "../../ContextMain";
import { useDispatch } from "react-redux";
import { addToCart, Changeqty } from "../../Reducers/CartSlice";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { Productdata, fetchProduct, setCartOpen } = useContext(MainContext);
    const [product, setproduct] = useState(null)
    const [qty, setQty] = useState(1);
    const dispatch = useDispatch();

    // New state to manage main image and related images
    const [mainImage, setMainImage] = useState(null);
    const [relatedImages, setRelatedImages] = useState([]);

    const ScrollOfTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }


    useEffect(() => {
        ScrollOfTop()
        fetchProduct({ id: id })
            .then((success) => {
                const p = success.data;
                setproduct(p)
                // initialize main and related images (safe guards)
                setMainImage(p?.image ?? null);
                setRelatedImages(Array.isArray(p?.relatedImage) ? p.relatedImage : []);
            }).catch((err) => {
                console.log(err)
                setproduct(null)
                setMainImage(null);
                setRelatedImages([]);
            })

    }, []);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Product not found.</p>
            </div>
        );
    }

    // Handler to swap clicked related image with main image
    const handleRelatedImageClick = (index) => {
        const clicked = relatedImages[index];
        if (!clicked) return;
        const newRelated = [...relatedImages];
        newRelated[index] = mainImage; // put previous main into the clicked slot
        setRelatedImages(newRelated);
        setMainImage(clicked);
    };


    const handleAddToCart = () => {
        dispatch(addToCart({
            pId: id,
            qty: qty,
            price: product.price
        }))
        setCartOpen(true)
    };

    const handleBuyNow = () => {
        dispatch(addToCart({
            pId: id,
            qty: qty,
            price: product.price
        }))
        console.log(qty, "under"),
            navigate("/checkout");
    };

    const suggestions = Productdata.filter((item) => item.id !== product.id).slice(0, 4);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 md:flex md:gap-8">
                <div className="md:w-1/2 flex items-center flex-col gap-4   mb-6 md:mb-0">
                    <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full max-w-sm h-auto object-cover rounded-sm"
                    />
                    <div className=" flex items-center gap-2 ">
                        {

                            relatedImages.map((item, i) => {
                                return (
                                    <img
                                        key={`${i}-${item}`}
                                        src={item}
                                        alt={`related-${i}`}
                                        className="sm:w-32 w-22 shadow-lg  rounded-md cursor-pointer"
                                        onClick={() => handleRelatedImageClick(i)}
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                <div className="md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800 mb-2">{product.title}</h1>
                        <p className="text-gray-500 text-sm mb-4">Category: Jewelry</p>
                        <p className="text-2xl font-bold text-yellow-600 mb-6">₹{product.price}</p>
                        <p className="text-gray-600 mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Pellentesque efficitur, nisl sit amet convallis feugiat,
                            urna massa sagittis leo, eget tincidunt nunc metus ut nisi.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            className="w-8 cursor-pointer h-8 flex items-center justify-center border hover:bg-gray-100 transition"
                            onClick={() => setQty(Math.max(1, qty - 1))}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={qty}
                            readOnly
                            className="w-10 text-center text-black border rounded"
                        />
                        <button
                            className="w-8 cursor-pointer h-8 flex items-center justify-center border hover:bg-gray-100 transition"
                            onClick={() => setQty(qty + 1)}
                        >
                            +
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 flex-wrap">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleAddToCart()
                            }}
                            className="flex-1 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 rounded-lg transition"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleBuyNow()
                            }}
                            className="flex-1 cursor-pointer border border-yellow-500 hover:bg-yellow-50 text-yellow-600 font-medium py-3 rounded-lg transition"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">You might also like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {suggestions.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                            <p className="text-yellow-600 font-semibold">₹{item.price}</p>
                            <button
                                onClick={() => {
                                    ScrollOfTop()
                                    navigate(`/productdetails/${item.id}`)
                                }}
                                className="mt-2 w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded transition text-sm"
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
