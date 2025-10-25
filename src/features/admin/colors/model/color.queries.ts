import { useQuery } from "@tanstack/react-query";
import { ColorService } from "./color.service";

export const useColorsList = () => {
  return useQuery({
    queryKey: ["colors"],
    queryFn: () => ColorService.getAll(),
  });
};

export const useColorDetail = (colorId: number) => {
  return useQuery({
    queryKey: ["colors", colorId],
    queryFn: () => ColorService.getById(colorId),
    enabled: !!colorId,
  });
};
