import { useQuery } from "@tanstack/react-query";
import { BranchService } from "./branch.service";

export const useBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () => BranchService.getAll(),
  });
};

export const useBranch = (branchId: number) => {
  return useQuery({
    queryKey: ["branch", branchId],
    queryFn: () => BranchService.getById(branchId),
    enabled: branchId > 0,
  });
};
