import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
})
//本项目仅开发微信小程序端，不产出 H5 网页端。
// 因此未配置server.proxy接口代理（Vite 代理仅浏览器 H5 环境生效，小程序运行时不经过 Vite 服务，代理配置无效）。
//小程序开发环境接口地址统一通过 src/utils/request.js 多环境变量管理，本地联调后端依靠微信开发者工具关闭合法域名校验实现跨域访问。