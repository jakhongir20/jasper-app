import { IconType } from "@/shared/types/icons";

export interface BaseRecord {
  id: number;
  unique_id: string;
  application_id: number;
}

// JUST DELETE THEM, IM WRITING THESE CUZ THERE FILES THAT NEEDS TO BE CHANGED, FAM.
export enum SalaryBillStatusTypes {
  draft = 1,
  paid = 11,
  canceled = 9,
}

export type BreadcrumbItem = {
  label: string;
  link?: string;
  icon?: IconType;
};
