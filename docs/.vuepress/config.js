import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { slimsearchPlugin } from "@vuepress/plugin-slimsearch";
//使用 nodejs-jieba 进行分词
import { cut } from "nodejs-jieba";

export default defineUserConfig({
  base: "/",
  // 网站 logo 配置，使用.vuepress/public 文件夹下的静态资源
  head: [["link", { rel: "icon", href: "/images/1f605.png" }]],
  title: "Frozen Midsummer",
  description: "仲夏寒霜",
  bundler: viteBundler(),
  theme: defaultTheme({
    // 默认主题配置
    navbar: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "Github",
        link: "https://github.com/frozen-midsummer",
      },
    ],
    // 侧边栏对象
    // 不同子路径下的页面会使用不同的侧边栏
    sidebar: {
      "/": [
        {
          text: "HTML/CSS",
          link: "/htmlcss/",
        },
        {
          text: "javascript",
          link: "/javascript/",
        },
        {
          text: "服务端",
          link: "/serverside/",
        },
        {
          text: "数据库",
          link: "/database/",
        },
        {
          text: "python",
          link: "/python/",
        },
        {
          text: "开发工具",
          link: "/devtools/",
        },
        {
          text: ".Net Framework",
          link: "/dotnet/",
        },
        {
          text: "网站建设",
          link: "/websiteconstruction/",
        },
        {
          text: "操作系统",
          link: "/os/",
        },
        {
          text: "Java面经",
          link: "/javainterviewexp/",
        },
      ],
    },
  }),
  plugins: [
    slimsearchPlugin({
      // 配置选项
      //开启全文搜索
      indexContent: true,
      indexLocaleOptions: {
        // 使用 nodejs-jieba 进行分词
        tokenize: (text, fieldName) =>
          fieldName === "id" ? [text] : cut(text, true),
      },
    }),
  ],
});
