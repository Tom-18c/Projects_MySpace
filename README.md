# MySpace - 个人静态网页

基于纯 HTML / CSS / JS 搭建的个人空间，使用 GitHub Pages 托管。

## 项目结构

```
├── README.md
├── index.html                    # 首页（站点入口）
├── assets/                       # 全局静态资源
│   ├── css/
│   │   ├── global.css            # 全局样式（CSS 变量驱动）
│   │   └── layout.css            # 公共布局样式（预留）
│   ├── js/
│   │   ├── common.js             # 公共脚本（导航、动画等）
│   │   └── utils.js               # 通用工具脚本（预留）
│   └── images/                   # 全局图片、图标
├── layout-parts/                 # 公共页面片段
│   ├── header.html               # 公共页头（预留）
│   └── footer.html               # 公共页脚（预留）
└── pages/                        # 所有子页面
   ├── tool_media/
   │   └── index.html            # 媒体工具页
   └── sub/                      # 当前模块的子页面（预留）
```

## 本地预览

由于导航栏和页脚通过公共 HTML 片段动态加载，请使用 VS Code 的 Live Server 插件或其他本地 HTTP 服务预览，不能直接通过浏览器打开 `index.html`。

## 在线访问

项目发布到 GitHub Pages 后，可通过以下地址访问：

https://tom-18c.github.io/Projects_MySpace/

## 部署到 GitHub Pages

1. 在 GitHub 上创建仓库（如 `username.github.io` 或任意名称）
2. 推送代码到仓库：
   ```bash
   git init
   git add .
   git commit -m "init: 个人静态网页基础框架"
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. 进入仓库 **Settings → Pages**，Source 选择 `main` 分支的 `/ (root)`，保存
4. 等待几分钟后即可通过 `https://<username>.github.io/<repo>/` 访问

## 样式定制

所有主题变量集中在 `assets/css/global.css` 顶部的 `:root` 中，包括：
- 颜色（主色调、背景色、文字色）
- 间距、圆角、阴影
- 字体与字号
- 过渡动画时长

修改变量即可全局生效，无需逐处查找替换。
