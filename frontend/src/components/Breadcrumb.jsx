import Link from "next/link";

export default function Breadcrumb({ productName, categoryName }) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-900">
        <li>
          <Link href="/shop" className="hover:text-[#DBEAFF]">
            Shop
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link
            href={`/category?category=${encodeURIComponent(categoryName)}`}
            className="hover:text-[#DBEAFF]"
          >
            {categoryName}
          </Link>
        </li>
        <li>/</li>
        <li className="text-gray-900 font-medium hover:text-[#DBEAFF]">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
