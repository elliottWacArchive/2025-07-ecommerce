export default function ImageGallery({ images, selectedImage, onImageSelect, productName }) {
    return (
        <div className="space-y-4">
            {/* Image principale avec bouton favori */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {images && images.length > 0 && images[selectedImage] ? (
                    <img 
                        src={images[selectedImage]} 
                        alt={productName} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Image du produit</p>
                        </div>
                    </div>
                )}
                
                {/* Bouton favori */}
                <button className="absolute top-4 left-4 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            
            {/* Miniatures (optionnelles) */}
            {images && images.length > 1 && (
                <div className="flex space-x-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => onImageSelect(index)}
                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImage === index 
                                    ? 'border-gray-400 shadow-md' 
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
            )}
        </div>
    );
} 