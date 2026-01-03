import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/shared/lib/services";

/**
 * Category section indexes for 2D parts
 */
export const CATEGORY_SECTION_INDEX_2D = {
  frames: 5,    // Рамки
  crowns: 7,    // Короны
  doors: 3,     // Двери
  locks: 21,    // Замок
} as const;

export type PartCategory2D = keyof typeof CATEGORY_SECTION_INDEX_2D;

/**
 * Product image from API
 */
interface ProductImage {
  product_image_id: number;
  assignment: string;
  image_url: string;
}

/**
 * Product from API
 */
export interface CategoryProduct {
  product_id: number;
  name: string;
  feature?: string;
  product_images?: ProductImage[];
}

/**
 * API response for products by category
 */
interface ProductsResponse {
  pagination: {
    total_count: number;
  };
  results: CategoryProduct[];
}

/**
 * Fetch products by category section index
 */
async function fetchCategoryProducts(
  categorySectionIndex: number,
): Promise<CategoryProduct[]> {
  try {
    const response = await ApiService.$get<ProductsResponse>(
      `/product/by/category-section-index?limit=50&offset=0&category_section_index=${categorySectionIndex}`,
    );
    return response?.results || [];
  } catch {
    return [];
  }
}

/**
 * Hook to fetch products for a specific 2D part category
 */
export function useCategoryProducts(category: PartCategory2D) {
  const categorySectionIndex = CATEGORY_SECTION_INDEX_2D[category];

  return useQuery({
    queryKey: ["category-products-2d", category, categorySectionIndex],
    queryFn: () => fetchCategoryProducts(categorySectionIndex),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Sash type extracted from assignment (one-sash, two-sash, etc.)
 */
export type SashType = "one-sash" | "one-half-sash" | "two-sash" | "three-sash" | "four-sash";

/**
 * Extract sash type from assignment string
 */
export function getSashType(assignment: string): SashType | null {
  const match = assignment.match(/^(one|one-half|two|three|four)-sash/);
  if (!match) return null;
  return match[0] as SashType;
}

/**
 * Get part suffix from assignment (door, frame, crown, etc.)
 */
export function getPartSuffix(assignment: string): string | null {
  // Assignment format: "{sash-type}-{part}" e.g., "two-sash-door"
  const parts = assignment.split("-");
  if (parts.length < 3) return null;
  return parts[parts.length - 1]; // Last part is the part type
}

/**
 * Get image URL from product filtered by sash type
 */
export function getProductImageBySashType(
  product: CategoryProduct,
  sashType?: SashType | null,
): ProductImage | undefined {
  if (!product.product_images?.length) return undefined;

  // If no sash type filter, return first image
  if (!sashType) {
    return product.product_images[0];
  }

  // Find image matching sash type
  return product.product_images.find((img) => {
    const imgSashType = getSashType(img.assignment);
    return imgSashType === sashType;
  });
}

/**
 * Get the first SVG image URL from product images
 */
export function getProductSvgUrl(product: CategoryProduct): string | undefined {
  if (!product.product_images?.length) return undefined;

  // Find first image with SVG extension
  const svgImage = product.product_images.find((img) =>
    img.image_url.toLowerCase().endsWith(".svg"),
  );

  return svgImage?.image_url;
}

/**
 * Get any image URL from product (SVG preferred, then any)
 */
export function getProductImageUrl(
  product: CategoryProduct,
  sashType?: SashType | null,
): string | undefined {
  if (!product.product_images?.length) return undefined;

  // Filter by sash type if provided
  const filteredImages = sashType
    ? product.product_images.filter((img) => getSashType(img.assignment) === sashType)
    : product.product_images;

  if (filteredImages.length === 0) return undefined;

  // Prefer SVG
  const svgImage = filteredImages.find((img) =>
    img.image_url.toLowerCase().endsWith(".svg"),
  );
  if (svgImage) return svgImage.image_url;

  // Fall back to first filtered image
  return filteredImages[0]?.image_url;
}

/**
 * Check if product has image for specific sash type
 */
export function hasImageForSashType(
  product: CategoryProduct,
  sashType: SashType,
): boolean {
  if (!product.product_images?.length) return false;
  return product.product_images.some((img) => getSashType(img.assignment) === sashType);
}
