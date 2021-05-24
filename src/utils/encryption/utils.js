import CryptoJS from '@/utils/encryption/crypto-js/crypto-js'
import JSEncrypt from '@/utils/encryption/jsencrypt/jsencrypt'

/**
 * 生成aes密匙
 * 生成规则：md5(当前时间戳 + 随机字符串)
 */
export const initAesKey = () => {
  return CryptoJS.MD5(new Date().getTime() + randomString(32)).toString()
}
/**
 * 接口数据加密函数
 * @param str string 需加密的json字符串
 * @param key_hash string 加密key_hash(16位)
 * @param iv string 加密向量(16位)
 * @return string 加密密文字符串
 */
export const aesEncrypt = (str, key_hash, _iv = 'SUNWEIQSDIEBYWVJ') => {
  if (!str) {
    return str
  }

  var key = CryptoJS.enc.Utf8.parse(key_hash)
  var iv = CryptoJS.enc.Utf8.parse(_iv)
  var encrypted = CryptoJS.AES.encrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return encrypted.toString()
}

/**
 * 接口数据解密函数
 * @param str string 已加密密文
 * @param key_hash string 加密key_hash
 * @param iv string 加密向量
 * @returns {*|string} 解密之后的json字符串
 */
export const aesDecrypt = (str, key_hash, iv = 'SUNWEIQSDIEBYWVJ') => {
  if (!str) {
    return str
  }
  var key = CryptoJS.enc.Utf8.parse(key_hash)
  var iv = CryptoJS.enc.Utf8.parse(iv)
  var decrypted = CryptoJS.AES.decrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * rsa加密（需要先加载jsencrypt.js文件）, 加密最大长度116位，足够应付这里的aes密匙加密传输
 */
export const rsaEncrypt = (word, publicKey) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(word)
}

function randomString(len) {
  len = len || 32
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var maxPos = $chars.length
  var pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
