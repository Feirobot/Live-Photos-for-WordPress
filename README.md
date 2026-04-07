# Live Photos for WordPress

实现与苹果 Live Photos 相同效果的 WordPress 插件

![Version](https://img.shields.io/badge/version-1.3-blue.svg)
![License](https://img.shields.io/badge/license-GPL--2.0%2B-green.svg)

## 前言

想在 WordPress 实现 Live Photos 的效果？这样手机的动态照片就可以分享在 WordPress 上了！

本插件参考了 [hsuyeung.com](https://www.hsuyeung.com/article/support-live-photo) 和 [blog.twofei.com](https://blog.twofei.com/1603/) 的实现思路，利用原生 HTML5 技术，不依赖第三方 JS 库，完美实现 Live Photo 动态照片效果。

## 效果演示

<video src="https://github.com/Feirobot/Live-Photos-for-WordPress/releases/download/v1.3/demo.mp4" controls width="100%"></video>

访问 [演示页面](https://eatbbq.cn/archives/260) 查看实际效果。

## 核心功能

- **原生 HTML5 实现**：无需依赖第三方 JS 库，使用纯原生技术
- **自适应图片比例**：自动识别并保持照片原始比例
- **双平台交互支持**：
  - **桌面设备**：鼠标悬停左上角 LIVE 图标播放
  - **移动设备**：触摸/长按照片播放
- **声音控制**：支持静音/非静音模式切换
- **响应式设计**：自动适应不同屏幕尺寸
- **古腾堡区块支持**：可视化配置图片与视频
- **短代码支持**：支持使用短代码插入

## 安装方法

### 方法一：通过 WordPress 后台安装

1. 下载插件 ZIP 文件：[Live-Photos-for-WordPress.zip](https://github.com/Feirobot/Live-Photos-for-WordPress/releases)
2. 进入 WordPress 后台 → 插件 → 安装插件 → 上传插件
3. 选择下载的 ZIP 文件并安装
4. 激活插件

### 方法二：手动安装

1. 下载插件文件并解压
2. 将文件夹上传到 `/wp-content/plugins/` 目录
3. 在 WordPress 后台激活插件

## 使用方法

### 使用古腾堡区块

1. 在编辑器中点击「+」添加区块
2. 搜索并选择「实况照片」区块
3. 分别上传/选择**图片**和**视频**文件
4. 在右侧边栏设置：
   - 最大宽度（200-1200px）
   - 是否静音播放

![区块编辑](https://eatbbqcici.oss-cn-shenzhen.aliyuncs.com/images/eatbbq/2025/09/屏幕截图-2025-09-14-232908.png)

### 使用短代码

```
[live_photo photo="图片URL或附件ID" video="视频URL或附件ID" width="600" muted="true"]
```

**参数说明：**

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `photo` | 静态图片 URL 或附件 ID | 必填 |
| `video` | 视频 URL 或附件 ID | 必填 |
| `width` | 显示最大宽度（像素） | 600 |
| `muted` | 是否静音播放（true/false） | true |
| `class` | 自定义 CSS 类名 | 空 |

**示例：**

```
[live_photo photo="https://example.com/photo.jpg" video="https://example.com/video.mp4" width="500" muted="true"]
```

使用附件 ID：
```
[live_photo photo="123" video="456" width="600"]
```

## 技术实现

### 工作原理

1. **图片与视频叠加**：静态图片在上层，视频在下层
2. **默认状态**：显示静态图片，视频隐藏
3. **播放触发**：鼠标悬停/触摸时隐藏图片，播放视频
4. **自适应比例**：自动读取图片原始比例并应用

### 兼容性

- WordPress 5.0+
- PHP 7.4+
- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 支持移动端浏览器

## 更新日志

### v1.3 (2025-04-08)
- ✨ 重构后端 UI：现代化卡片式布局设计
- 🎨 添加渐变背景、阴影和圆角效果
- 🗑️ 删除视频加载时的警告气泡
- 🔧 优化编辑器界面交互

### v1.2 (2025-04-08)
- 初始化版本发布
- 支持古腾堡区块
- 支持短代码
- 响应式设计

## 注意事项

1. **图片和视频比例**：建议保持相同比例以获得最佳效果
2. **视频格式**：推荐使用 MP4 格式，兼容性最好
3. **视频大小**：建议压缩视频以优化加载速度
4. **移动端**：触摸图片即可播放，松开停止

## 相关链接

- [项目主页](https://github.com/Feirobot/Live-Photos-for-WordPress)
- [问题反馈](https://github.com/Feirobot/Live-Photos-for-WordPress/issues)
- [作者博客](https://eatbbq.cn)

## 参考资源

- [网站支持 Live Photo 图片展示](https://www.hsuyeung.com/article/support-live-photo)
- [测试不基于 LivePhotoKit JS 实现实况照片](https://blog.twofei.com/1603/)
- [WordPress LivePhotos Block](https://github.com/yuazhi/WordPress-LivePhotos)

## License

GPL v2 or later

---

Made with ❤️ by Feirobot
