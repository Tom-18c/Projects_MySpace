# MySpace - 个人静态网页

基于纯 HTML / CSS / JS 搭建的个人空间，使用 GitHub Pages 托管。

## 项目结构

```
├── index.html          # 主页面
├── css/
│   └── style.css       # 全局样式（CSS 变量驱动，便于主题调整）
├── js/
│   └── main.js         # 交互脚本
├── assets/             # 静态资源（图片、图标等）
└── README.md
```

## 本地预览

直接用浏览器打开 `index.html` 即可，或使用 VS Code 的 Live Server 插件。

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

所有主题变量集中在 `css/style.css` 顶部的 `:root` 中，包括：
- 颜色（主色调、背景色、文字色）
- 间距、圆角、阴影
- 字体与字号
- 过渡动画时长

修改变量即可全局生效，无需逐处查找替换。
