import Link from "next/link";

export default function Breadcrumb({ productName, categoryName, subcategoryName, subSubcategoryName }) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-900 flex-wrap">
        <li>
          <Link href="/shop" className="hover:text-[#DBEAFF]">Shop</Link>
        </li>
        {categoryName && (
          <>
            <li>/</li>
            <li>
              <Link href={`/category?category=${encodeURIComponent(categoryName)}`} className="hover:text-[#DBEAFF]">
                {categoryName}
              </Link>
            </li>
          </>
        )}
        {subcategoryName && (
          <>
            <li>/</li>
            <li>
              <Link href={`/subcategory?subcategory=${encodeURIComponent(subcategoryName)}`} className="hover:text-[#DBEAFF]">
                {subcategoryName}
              </Link>
            </li>
          </>
        )}
        {subSubcategoryName && (
          <>
            <li>/</li>
            <li>
              <Link href={`/subsubcategory?subsubcategory=${encodeURIComponent(subSubcategoryName)}`} className="hover:text-[#DBEAFF]">
                {subSubcategoryName}
              </Link>
            </li>
          </>
        )}
        <li>/</li>
        <li className="text-gray-900 font-medium">{productName}</li>
      </ol>
    </nav>
  );
}
