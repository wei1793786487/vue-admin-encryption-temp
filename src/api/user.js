import request from '@/utils/request'

export function getPublckKey() {
  return request({
    url: 'auth',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/demo',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
