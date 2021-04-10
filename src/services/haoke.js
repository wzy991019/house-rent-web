import request from '@/utils/request';

export async function addHouseResource(params) {
  //存在跨域问题：解决——>反向代理。在config.js 中配置代理proxy
  return request('/haoke/house/resources', {
    method: 'POST',
    body: params
  });
}

export async function updateHouseResource(params) {
  return request('/haoke/house/resources', {
    method: 'PUT',
    body: params
  });
}
