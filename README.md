# Live Photos for WordPress

<p align="center">
  <img src="images/live-icon.png" alt="Live Photos Icon" width="64" height="64">
</p>

<p align="center">
  在 WordPress 中展示苹果 Live Photos 动态照片效果
</p>

<p align="center">
  <a href="https://github.com/Feirobot/Live-Photos-for-WordPress/releases">
    <img src="https://img.shields.io/badge/version-1.4.1-blue.svg" alt="Version">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-GPL--2.0%2B-green.svg" alt="License">
  </a>
  <a href="https://wordpress.org/">
    <img src="https://img.shields.io/badge/WordPress-5.0%2B-blue.svg" alt="WordPress">
  </a>
  <a href="https://www.php.net/">
    <img src="https://img.shields.io/badge/PHP-7.4%2B-purple.svg" alt="PHP">
  </a>
</p>

---

## 📖 简介

Live Photos for WordPress 是一款实现苹果 Live Photos 动态照片效果的 WordPress 插件。无需第三方 JS 库，使用原生 HTML5 技术，让你的 WordPress 网站完美展示实况照片。

参考实现：[hsuyeung.com](https://www.hsuyeung.com/article/support-live-photo) | [blog.twofei.com](https://blog.twofei.com/1603/)

## 🎬 效果演示

![效果演示](demo.gif)

👉 [在线演示](https://eatbbq.cn/archives/260)

## ✨ 功能特性

- **🚀 原生 HTML5** - 零依赖，纯原生技术实现
- **📐 自适应比例** - 自动识别并保持照片原始比例
- **💻 桌面端支持** - 鼠标悬停 LIVE 图标播放
- **📱 移动端支持** - 长按播放，滑动不影响页面滚动
- **📳 震动反馈** - 播放时触发触觉反馈（设备支持时）
- **🔇 声音控制** - 支持静音/非静音模式
- **📱 响应式设计** - 完美适配各种屏幕尺寸
- **🧩 古腾堡区块** - 可视化编辑器，拖拽配置

## 📋 系统要求

| 项目 | 最低版本 |
|------|----------|
| WordPress | 5.0+ |
| PHP | 7.4+ |
| 浏览器 | Chrome, Firefox, Safari, Edge 最新版 |

## 📦 安装

### 方法一：后台上传（推荐）

1. 下载 [最新版本](https://github.com/Feirobot/Live-Photos-for-WordPress/releases/latest)
2. 进入 WordPress 后台 → **插件** → **安装插件** → **上传插件**
3. 选择 `Live-Photos-for-WordPress.zip` 文件
4. 点击 **立即安装**，然后 **启用**

### 方法二：手动安装

```bash
# 下载并解压到插件目录
wget https://github.com/Feirobot/Live-Photos-for-WordPress/releases/latest/download/Live-Photos-for-WordPress.zip
unzip Live-Photos-for-WordPress.zip -d /path/to/wordpress/wp-content/plugins/
```

然后在 WordPress 后台启用插件。

## 🎯 使用指南

### 添加实况照片

1. 在文章编辑器中点击 **+** 添加区块
2. 搜索 **「实况照片」** 或 **「Live Photo」**
3. 分别上传/选择**静态图片**和**视频**文件
4. 在右侧边栏配置：
   - **最大宽度**：200-1200px（默认 600px）
   - **静音播放**：开启/关闭（默认开启）

![区块设置](https://eatbbqcici.oss-cn-shenzhen.aliyuncs.com/images/eatbbq/2025/09/屏幕截图-2025-09-14-232908.png)

### 交互方式

| 设备 | 操作 | 效果 |
|------|------|------|
| 桌面 | 鼠标悬停 LIVE 图标 | 播放实况照片 |
| 移动端 | 长按图片 | 播放实况照片 |
| 移动端 | 点击 LIVE 图标 | 播放实况照片（微信推荐） |
| 所有 | 松开/移开 | 停止播放 |

## ⚙️ 技术实现

### 工作原理

1. **层叠架构**：视频在下层，静态背景图在上层
2. **默认状态**：显示静态图片，视频隐藏
3. **播放触发**：隐藏背景图，显示并播放视频
4. **自适应**：自动读取图片比例并应用到容器

### 架构说明

```
live-photos/
├── live-photos.php      # 主插件文件
├── assets/
│   ├── css/
│   │   ├── style.css    # 前端样式
│   │   └── editor.css   # 编辑器样式
│   └── js/
│       ├── frontend.js  # 前端交互
│       └── block-editor.js  # 区块编辑器
└── images/
    └── live-icon.png    # LIVE 图标
```

## 📝 更新日志

### v1.4.1 (2025-04-09)
- 📳 新增播放震动反馈（Haptic Feedback）
- 🐛 修复 ZIP 文件路径格式问题

### v1.4.0 (2025-04-08)
- 🗑️ 移除短代码功能，仅保留古腾堡区块
- 📱 优化移动端交互（长按播放，滑动不干扰）
- 🎨 重构为背景图架构，避免微信长按菜单

### v1.3.0 (2025-04-08)
- ✨ 重构后端 UI，现代化卡片式布局
- 🎨 添加渐变背景、阴影和圆角效果
- 🗑️ 删除视频加载警告气泡

### v1.2.0 (2025-04-08)
- 🎉 初始版本发布
- 🧩 古腾堡区块支持
- 📱 响应式设计

## ⚠️ 注意事项

1. **图片视频比例** - 建议保持相同比例以获得最佳效果
2. **视频格式** - 推荐 MP4 (H.264)，兼容性最佳
3. **视频大小** - 建议压缩至 5MB 以内，优化加载速度
4. **微信浏览器** - 推荐使用「点击 LIVE 图标」方式播放
5. **震动反馈** - 仅在支持的移动设备上触发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

## 📮 反馈与支持

- **问题反馈**：[GitHub Issues](https://github.com/Feirobot/Live-Photos-for-WordPress/issues)
- **项目主页**：[github.com/Feirobot/Live-Photos-for-WordPress](https://github.com/Feirobot/Live-Photos-for-WordPress)
- **作者博客**：[eatbbq.cn](https://eatbbq.cn)

## 📚 参考资料

- [网站支持 Live Photo 图片展示](https://www.hsuyeung.com/article/support-live-photo)
- [测试不基于 LivePhotoKit JS 实现实况照片](https://blog.twofei.com/1603/)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)

## 📄 许可证

本项目采用 [GPL v2 或更高版本](LICENSE) 开源协议。

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Feirobot">Feirobot</a>
</p>
