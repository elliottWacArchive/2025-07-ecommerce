"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import ProductInfo from "@/components/ProductInfo";
import ActionButtons from "@/components/ActionButtons";
import NotesOlfactives from "@/components/NotesOlfactives";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedCapacity, setSelectedCapacity] = useState("50ml");
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const id = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/products/${id.id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id?.id) {
      fetchProduct();
    }
  }, [id]);

  // Fonction pour calculer le prix selon la contenance
  const calculatePrice = (basePrice, capacity) => {
    const capacityMultipliers = {
      "30ml": 0.7,   // 30ml = 70% du prix de base
      "50ml": 1.0,   // 50ml = prix de base (100%)
      "100ml": 1.8   // 100ml = 180% du prix de base
    };
    
    return (basePrice * capacityMultipliers[capacity]).toFixed(2);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-96 text-lg font-semibold text-gray-600">
          Produit non trouvé
        </div>
      </>
    );
  }

  const productImages = [product.image].filter(Boolean);

  return (
    <>
      <Header />

      {showAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-50">
          Article ajouté au panier ✅
        </div>
      )}

      <main className="min-h-screen bg-[#CECDFF]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumb
            productName={product.name}
            categoryName={product.category?.name}
            subcategoryName={product.subcategory?.name}
            subSubcategoryName={product.sub_subcategory?.name}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galerie d'images */}
            <ImageGallery
              images={productImages}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              productName={product.name}
            />

            {/* Informations produit */}
            <div className="space-y-6">
              <ProductInfo 
                product={product} 
                selectedCapacity={selectedCapacity}
                onCapacityChange={setSelectedCapacity}
                calculatePrice={calculatePrice}
              />

              <ActionButtons 
                product={product} 
                selectedCapacity={selectedCapacity}
              />

              <NotesOlfactives />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
