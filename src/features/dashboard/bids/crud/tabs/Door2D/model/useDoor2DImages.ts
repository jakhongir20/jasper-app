import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/shared/lib/services";
import type { ProductImageAssignmentEnumEntity } from "@/shared/lib/api/generated/gateway/model";

/**
 * Product image from API
 */
export interface ProductImage {
  product_image_id: number;
  assignment: string;
  image_url: string;
  created_at: number;
}

/**
 * Product with images
 */
interface ProductWithImages {
  product_id: number;
  product_images?: ProductImage[];
}

/**
 * Door 2D images grouped by part type
 */
export interface Door2DImages {
  door?: ProductImage;
  frame?: ProductImage;
  crown?: ProductImage;
  transom?: ProductImage;
  upFrame?: ProductImage;
  underFrame?: ProductImage;
  trim?: ProductImage;
}

/**
 * Get sash prefix from assignment (one-sash, two-sash, etc.)
 */
function getSashPrefix(assignment: string): string | null {
  const match = assignment.match(/^(one|one-half|two|three|four)-sash/);
  return match ? match[0] : null;
}

/**
 * Get part type from assignment
 */
function getPartType(assignment: string): keyof Door2DImages | null {
  if (assignment.endsWith("-door")) return "door";
  if (assignment.endsWith("-frame") && !assignment.includes("up-frame") && !assignment.includes("under-frame")) return "frame";
  if (assignment.endsWith("-crown")) return "crown";
  if (assignment.endsWith("-transom")) return "transom";
  if (assignment.endsWith("-up-frame")) return "upFrame";
  if (assignment.endsWith("-under-frame")) return "underFrame";
  if (assignment.endsWith("-trim")) return "trim";
  return null;
}

/**
 * Filter images by sash type to ensure matching sizes
 * e.g., if door is "one-sash-door", only use "one-sash-*" images
 */
export function filterImagesBySashType(
  images: ProductImage[],
  primaryAssignment?: string,
): Door2DImages {
  const result: Door2DImages = {};

  // Determine target sash prefix from primary (door) assignment
  const targetSashPrefix = primaryAssignment ? getSashPrefix(primaryAssignment) : null;

  for (const image of images) {
    const imageSashPrefix = getSashPrefix(image.assignment);
    const partType = getPartType(image.assignment);

    if (!partType) continue;

    // If we have a target sash prefix, only include matching images
    if (targetSashPrefix && imageSashPrefix !== targetSashPrefix) {
      continue;
    }

    // Use first matching image for each part type
    if (!result[partType]) {
      result[partType] = image;
    }
  }

  return result;
}

/**
 * Fetch product by ID
 */
async function fetchProduct(productId: number): Promise<ProductWithImages | null> {
  try {
    return await ApiService.$get<ProductWithImages>(`/product?product_id=${productId}`);
  } catch {
    return null;
  }
}

/**
 * Hook to fetch door 2D images from product
 */
export function useDoor2DImages(productIds: {
  doorProductId?: number | null;
  frameProductId?: number | null;
  crownProductId?: number | null;
}) {
  const { doorProductId, frameProductId, crownProductId } = productIds;

  // Primary product ID to fetch images from
  // Priority: door > frame > crown
  const primaryProductId = doorProductId || frameProductId || crownProductId;

  return useQuery({
    queryKey: ["door2d-images", primaryProductId],
    queryFn: async () => {
      if (!primaryProductId) return null;

      const product = await fetchProduct(primaryProductId);
      if (!product?.product_images?.length) return null;

      // Find primary door assignment to determine sash type
      const doorImage = product.product_images.find(img => img.assignment.endsWith("-door"));

      return filterImagesBySashType(product.product_images, doorImage?.assignment);
    },
    enabled: !!primaryProductId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Assignment enum values for type safety
 */
export const DoorAssignments = {
  ONE_SASH_DOOR: "one-sash-door" as ProductImageAssignmentEnumEntity,
  ONE_SASH_FRAME: "one-sash-frame" as ProductImageAssignmentEnumEntity,
  ONE_SASH_CROWN: "one-sash-crown" as ProductImageAssignmentEnumEntity,
  TWO_SASH_DOOR: "two-sash-door" as ProductImageAssignmentEnumEntity,
  TWO_SASH_FRAME: "two-sash-frame" as ProductImageAssignmentEnumEntity,
  TWO_SASH_CROWN: "two-sash-crown" as ProductImageAssignmentEnumEntity,
} as const;
