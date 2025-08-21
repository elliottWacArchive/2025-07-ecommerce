"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Truck, MapPin, Clock, Euro } from "lucide-react";

export function ShippingCalculator({ orderAmount, onShippingChange }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/shipping/countries"
                );
                if (response.ok) {
                    const data = await response.json();
                    setCountries(data.countries);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des pays:", error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        if (selectedCountry && orderAmount > 0) {
            fetchShippingOptions();
        }
    }, [selectedCountry, orderAmount]);

    const fetchShippingOptions = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/api/shipping/options?country=${encodeURIComponent(
                    selectedCountry
                )}&order_amount=${orderAmount}`
            );

            if (response.ok) {
                const data = await response.json();
                setShippingOptions(data.shipping_options);

                if (data.shipping_options.length > 0) {
                    const cheapestOption = data.shipping_options.reduce(
                        (prev, current) =>
                            prev.cost < current.cost ? prev : current
                    );
                    setSelectedShipping(cheapestOption);
                    onShippingChange(cheapestOption);
                }
            } else {
                setShippingOptions([]);
                setSelectedShipping(null);
                onShippingChange(null);
            }
        } catch (error) {
            console.error(
                "Erreur lors du chargement des options de livraison:",
                error
            );
            setShippingOptions([]);
            setSelectedShipping(null);
            onShippingChange(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        setShippingOptions([]);
        setSelectedShipping(null);
        onShippingChange(null);
    };

    const handleShippingChange = (shippingId) => {
        const option = shippingOptions.find(
            (opt) => opt.id.toString() === shippingId
        );
        setSelectedShipping(option);
        onShippingChange(option);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Frais de livraison
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label
                        htmlFor="country"
                        className="flex items-center gap-2"
                    >
                        <MapPin className="h-4 w-4" />
                        Pays de livraison
                    </Label>
                    <Select
                        value={selectedCountry}
                        onValueChange={handleCountryChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre pays" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                    {country}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedCountry && (
                    <div className="space-y-3">
                        <Label>Mode de livraison</Label>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Calcul des frais de port...
                                </p>
                            </div>
                        ) : shippingOptions.length > 0 ? (
                            <div className="space-y-2">
                                {shippingOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                            selectedShipping?.id === option.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                        onClick={() =>
                                            handleShippingChange(
                                                option.id.toString()
                                            )
                                        }
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        checked={
                                                            selectedShipping?.id ===
                                                            option.id
                                                        }
                                                        onChange={() =>
                                                            handleShippingChange(
                                                                option.id.toString()
                                                            )
                                                        }
                                                        className="text-primary"
                                                    />
                                                    <span className="font-medium">
                                                        {option.delivery_method}
                                                    </span>
                                                </div>
                                                {option.estimated_delivery_days && (
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground ml-6">
                                                        <Clock className="h-3 w-3" />
                                                        {
                                                            option.estimated_delivery_days
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold flex items-center gap-1">
                                                    {option.cost > 0 ? (
                                                        <>
                                                            <Euro className="h-4 w-4" />
                                                            {parseFloat(
                                                                option.cost
                                                            ).toFixed(2)}
                                                        </>
                                                    ) : (
                                                        <span className="text-green-600">
                                                            Gratuit
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-muted-foreground">
                                <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>
                                    Aucune option de livraison disponible pour
                                    ce pays
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {selectedShipping && (
                    <div className="pt-3 border-t">
                        <div className="flex justify-between items-center text-sm">
                            <span>Livraison sélectionnée :</span>
                            <span className="font-medium">
                                {selectedShipping.delivery_method} -{" "}
                                {selectedShipping.country}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-semibold mt-2">
                            <span>Frais de port :</span>
                            <span>
                                {selectedShipping.cost > 0
                                    ? `${parseFloat(
                                          selectedShipping.cost
                                      ).toFixed(2)}€`
                                    : "Gratuit"}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
