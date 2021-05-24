const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  en_key: state => state.app.aesEncryptKey,
  aes_key: state => state.app.aesKey,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
