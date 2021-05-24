import Cookies from 'js-cookie'
import { initAesKey, rsaEncrypt } from '@/utils/encryption/utils'

import { getPublckKey } from '@/api/user'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  publicKey: null, // RSA加密公匙
  aesKey: null, // AES加密密匙
  aesEncryptKey: null// AES加密密匙的RSA加密字符串
}

const mutations = {
  SET_PUBLICKEY: (state, publicKey) => {
    state.publicKey = publicKey
  },
  SET_AESKEY: (state, aesKey) => {
    state.aesKey = aesKey
  },
  SET_AESENCRYPTKEY: (state, aesEncryptKey) => {
    state.aesEncryptKey = aesEncryptKey
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  // 初始化请求，获取RSA公匙
  async initPublicKey({
    commit
  }) {
    // 这里的AppApi是我事先封装好的网络请求，用来向服务器获取公匙的，你要替换成你的网络请求\
    const res = await getPublckKey()
    if (res.code) {
      // 存下RSA公匙
      commit('SET_PUBLICKEY', res.data)
      // 随机生成AES密匙，并存下来
      commit('SET_AESKEY', initAesKey())
      // 将AES密匙进行RSA加密，并存下来
      commit('SET_AESENCRYPTKEY', rsaEncrypt(state.aesKey, state.publicKey))
    }
    return res
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
