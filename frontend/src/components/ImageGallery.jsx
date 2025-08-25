import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images, selectedImage, onImageSelect, productName }) {
    const handlePrevious = () => {
        if (images.length > 1) {
            const newIndex = selectedImage === 0 ? images.length - 1 : selectedImage - 1;
            onImageSelect(newIndex);
        }
    };

    const handleNext = () => {
        if (images.length > 1) {
            const newIndex = selectedImage === images.length - 1 ? 0 : selectedImage + 1;
            onImageSelect(newIndex);
        }
    };

    if (images.length === 0) {
        return (
            <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">Aucune image disponible</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Image principale avec navigation */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                {images[selectedImage] ? (
                    <img 
                        src={`http://localhost:8000${images[selectedImage]}`} 
                        alt={`${productName} - Image ${selectedImage + 1}`} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Image non disponible</p>
                        </div>
                    </div>
                )}

                {/* Navigation gauche/droite */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                            title="Image précédente"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                            title="Image suivante"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Indicateur de position */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                        {selectedImage + 1} / {images.length}
                    </div>
                )}
            </div>
            
            {/* Miniatures */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => onImageSelect(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImage === index 
                                    ? 'border-blue-500 shadow-md' 
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <img 
                                src={`http://localhost:8000${image}`} 
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
