"use client";
export default function FilterSidebar({
  activeKeywords = [],
  onRemoveKeyword,
  onClearAll,

  subcategories = [],
  selectedSubcategory,
  onSelectSubcategory,

  subSubcategories = [],
  selectedSubSubcategory,
  onSelectSubSubcategory,
}) {
  return (
    <aside className="w-full max-w-[240px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Mots-Clés */}
      <div className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Mots-Clés</h3>
          {activeKeywords.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Effacer tout
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {activeKeywords.length === 0 ? (
            <span className="text-xs text-gray-400">Aucun filtre</span>
          ) : (
            activeKeywords.map((k) => (
              <button
                key={k}
                onClick={() => onRemoveKeyword?.(k)}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
              >
                {k}
                <span className="rounded-full bg-gray-300 px-1 text-[10px]">✕</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* sous-catégories */}
      <div className="mb-5">
        <h4 className="mb-3 text-sm font-semibold text-gray-800">Sous-catégories</h4>
        <div className="flex flex-col gap-3">
          {subcategories.map((sc) => {
            const checked = selectedSubcategory?.id === sc.id;
            return (
              <label key={sc.id} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={checked}
                  onChange={() =>
                    onSelectSubcategory?.(checked ? null : sc)
                  }
                />
                <span className="text-sm text-gray-700">{sc.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* sous-sous-catégories */}
      {subSubcategories?.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-800">
            Sous-sous-catégories
          </h4>
          <div className="flex flex-col gap-3">
            {subSubcategories.map((ssc) => {
              const checked = selectedSubSubcategory === ssc.id;
              return (
                <label key={ssc.id} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={checked}
                    onChange={() =>
                      onSelectSubSubcategory?.(checked ? null : ssc.id)
                    }
                  />
                  <span className="text-sm text-gray-700">{ssc.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
