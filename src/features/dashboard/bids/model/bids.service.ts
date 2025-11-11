import { ApiService } from "@/shared/lib/services";
import { ApplicationDetail } from "@/features/dashboard/bids/details";

export class BidsService {
  static async getDetail(id: string): Promise<ApplicationDetail> {
    return await ApiService.$get<ApplicationDetail>(
      `/application?application_id=${id}`,
    );
  }

  static create(form: unknown) {
    return ApiService.$post<unknown>("/application", form);
  }

  static update(id: string, form: unknown) {
    return ApiService.$patch<unknown>(
      `/application?application_id=${id}`,
      form,
    );
  }

  static delete(id: string) {
    return ApiService.$delete<unknown>("/application", {
      application_id: id,
    });
  }

  static forecast(id: string, form: unknown): Promise<ApplicationDetail> {
    return ApiService.$put<ApplicationDetail>(
      `/application/forecast?application_id=${id}`,
      form,
    );
  }

  static forecastServices(applicationId: number | string) {
    return ApiService.$post<{
      payload: any;
      results: {
        services: Array<{
          name: string;
          features: string | null;
          price_uzs: number;
          price_usd: number;
          measure: string | null;
          service_id: number;
          quantity: number;
        }>;
        additionalServices?: Array<{
          name: string;
          features: string | null;
          price_uzs: number;
          price_usd: number;
          measure: string | null;
          quality_id: number;
          quantity: number;
        }>;
      };
    }>(
      "/application/forecast",
      undefined,
      { params: { application_id: applicationId } },
    );
  }
}
