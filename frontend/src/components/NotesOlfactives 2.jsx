import { useState } from "react";

export default function NotesOlfactives() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="border-t border-gray-200 pt-6">
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-lg font-semibold text-gray-900">Notes olfactives</h3>
                <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            
            {isExpanded && (
                <div className="mt-4">
                    <p className="text-gray-700 leading-relaxed">
                        Répondez à la question fréquemment posée dans une phrase simple, un paragraphe un peu long ou même sous forme de liste. Découvrez les notes de tête, de cœur et de fond qui composent cette fragrance unique.
                    </p>
                </div>
            )}
        </div>
    );
} 