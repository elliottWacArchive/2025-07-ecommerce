import ProductImage from "./ProductImage";

export default function ImageGallery({
    images,
    selectedImage,
    onImageSelect,
    productName,
}) {
    return (
        <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <ProductImage
                    src={
                        images && images.length > 0
                            ? images[selectedImage]
                            : null
                    }
                    alt={productName}
                    className="w-full h-full object-cover"
                    placeholderClassName="rounded-lg"
                />

                <button className="absolute top-4 left-4 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </button>
            </div>

            {images && images.length > 1 && (
                <div className="flex space-x-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => onImageSelect(index)}
                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImage === index
                                    ? "border-gray-400 shadow-md"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <ProductImage
                                src={image}
                                alt={`${productName} ${index + 1}`}
                                className="w-full h-full object-cover"
                                width="80px"
                                height="80px"
                                placeholderClassName="rounded-lg"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
