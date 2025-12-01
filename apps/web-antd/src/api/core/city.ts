import { requestClient } from '#/api/request';

export namespace CityApi {
  /** 城市列表接口参数 */
  export interface GetCityListParams {
    parent_id?: number;
  }

  /** 城市项 */
  export interface CityItem {
    id: number;
    name: string;
  }
}

/**
 * 获取城市列表
 */
export async function getCityListApi(params?: CityApi.GetCityListParams) {
  return requestClient.get<CityApi.CityItem[]>('/getCityList', {
    params,
  });
}
