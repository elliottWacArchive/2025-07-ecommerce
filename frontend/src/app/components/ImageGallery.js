export default function ImageGallery({ images, selectedImage, onImageSelect, productName }) {
    return (
        <div className="space-y-4">
            {/* Image principale */}
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                <img 
                    src={images[selectedImage]} 
                    alt={productName} 
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Miniatures */}
            <div className="flex space-x-3">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => onImageSelect(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index 
                                ? 'border-indigo-600 shadow-md' 
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <img 
                            src={image} 
                            alt={`${productName} ${index + 1}`} 
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
} 