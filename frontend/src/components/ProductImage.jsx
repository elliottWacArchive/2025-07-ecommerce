"use client";

import { useState } from "react";

export default function ProductImage({
    src,
    alt,
    className = "",
    style = {},
    width = "100%",
    height = "100%",
    showPlaceholder = true,
    placeholderClassName = "",
}) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageError(false);
        setImageLoading(false);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;

        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        if (imagePath.startsWith("/")) {
            return `http://localhost:8000${imagePath}`;
        }

        return `http://localhost:8000/products/${imagePath}`;
    };

    const imageUrl = getImageUrl(src);

    if (!imageUrl || imageError) {
        return showPlaceholder ? (
            <div
                className={`flex items-center justify-center bg-gray-100 ${placeholderClassName}`}
                style={{ width, height, ...style }}
            >
                <div className="text-center">
                    <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-gray-500 text-xs">Image du produit</p>
                </div>
            </div>
        ) : null;
    }

    return (
        <>
            {imageLoading && showPlaceholder && (
                <div
                    className={`flex items-center justify-center bg-gray-100 animate-pulse ${placeholderClassName}`}
                    style={{ width, height, ...style }}
                >
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-300 rounded mx-auto mb-2"></div>
                        <div className="w-16 h-3 bg-gray-300 rounded mx-auto"></div>
                    </div>
                </div>
            )}
            <img
                src={imageUrl}
                alt={alt}
                className={className}
                style={{
                    ...style,
                    display: imageLoading ? "none" : "block",
                    width,
                    height,
                }}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </>
    );
}
