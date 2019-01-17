const CONF = {
    port: '5757',
    rootPathname: '',

  //腾讯云云 API 密钥
  qcloudAppId: '1258514560',
  qcloudSecretId: 'AKIDtZ5A1dULLairtgs0A4iCS0lTxPcbovNj',
  qcloudSecretKey: 'iBPeS3GFzVnkTRGp8DhJZFhwJhu96peG',

    // 微信小程序 App ID
  appId: 'wxe506827493809fe5',

    // 微信小程序 App Secret
  appSecret: '7c395e43d1b93f53a4ab73a99c5d3ae2',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,
    
    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: '13423801208a',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-shanghai',
        // Bucket 名称
        fileBucket: 'product-1258460918',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
