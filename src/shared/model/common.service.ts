import { ApiService } from "@/shared/lib/services";

type DeleteParams = {
  url: string;
  params: { id: string | number; key: string };
};

export class CommonService {
  static deleteRecord({ url, params }: DeleteParams): Promise<void> {
    return ApiService.$delete(`${url}?${params.key}=${params.id}`);
  }
}
