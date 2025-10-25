export interface DataType {
  key: string;
  code: string;
  name: AuthorType;
  country: string;
  group: string;
  note: string;
  status: string;
  created: AuthorType;
  action?: string;
}

interface AuthorType {
  image?: string;
  title: string;
  subtitle?: string;
}

export interface OrganizationFormValues {
  code: string;
  note: string;
  title: string;
  country: {
    id: number;
    guid: string;
    title: string;
  } | null;
  group: {
    id: number;
    guid: string;
    title: string;
  } | null;
  photo: string;
  status: number;
}
