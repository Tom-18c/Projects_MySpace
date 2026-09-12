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

### 视频下载代理

媒体工具的 Bilibili 下载功能需要同时运行 Node.js 后端代理：

```bash
node backend/server.js
```

代理默认运行在 `http://127.0.0.1:8787`。保持该进程运行后，再通过 Live Server 打开媒体工具页面即可下载视频。

部署到 GitHub Pages 时，GitHub Pages 只提供静态文件，不能运行 `backend/server.js`。需要先将 `backend` 部署到 Render、Railway 或其他支持 Node.js 的公网服务，然后在页面加载媒体脚本前设置代理地址：

```html
<script>
  window.TOOL_MEDIA_PROXY_URL = "https://你的后端域名/api/bilibili/download";
</script>
```

目前未设置公网地址时，页面默认只连接本机 `127.0.0.1:8787`，其他用户无法使用下载功能。

本项目已提供 `Dockerfile` 和 `render.yaml`。在 Render 中连接此 GitHub 仓库并创建 Blueprint 后，Render 会自动安装 FFmpeg 并启动后端。创建服务时，在 Render 的 Environment 中填写私密变量 `BILIBILI_COOKIE`。取得服务域名后，将上面的 `TOOL_MEDIA_PROXY_URL` 改为该服务的 `/api/bilibili/download` 地址，再推送一次前端文件。

如果 GitHub Pages 页面没有配置公网代理地址，下载按钮会提示“下载服务尚未配置”，不会错误地请求访问者自己的电脑。GitHub Pages 无法替代这个后端服务。

代理会请求账号权限内的最高画质，并优先使用 DASH 视频轨道。若要合并 DASH 的独立视频和音频轨道，请先安装 FFmpeg 并确保 `ffmpeg` 在系统 PATH 中。需要登录权限时，可在启动前设置自己的 Cookie：

```powershell
$env:BILIBILI_COOKIE = "SESSDATA=...; bili_jct=..."
node backend/server.js
```

不要将 Cookie 提交到 Git 仓库或分享给他人。

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
