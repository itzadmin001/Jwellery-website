import Container from "./Container";

function CustomerReview({ reviews }) {
    return (
        <div className="py-12">


            <Container classes=" cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="flex flex-col items-center text-center bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                        <img
                            src={review.image}
                            alt={review.name}
                            className="w-20 h-20 rounded-full object-cover mb-4"
                        />
                        <p className="text-gray-600 mb-3 text-sm md:text-base">{review.text}</p>
                        <h4 className="text-sm md:text-base font-medium text-yellow-600">
                            - {review.name}
                        </h4>
                    </div>
                ))}
            </Container>

            {/* Dots */}
            <div className="flex justify-center mt-6 space-x-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
            </div>
        </div>
    );
}

export default CustomerReview;
