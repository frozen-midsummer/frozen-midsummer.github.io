import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
// import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig({
  base: "/",
  // 网站 logo 配置，使用.vuepress/public 文件夹下的静态资源
  head: [['link', { rel: 'icon', href: '/images/1f605.png' }]],
  title: 'Frozen Midsummer',
  description: '仲夏寒霜',
  bundler: viteBundler(),
  theme: defaultTheme({
    // 默认主题配置
    navbar: [
      {
        text: "首页",
        link: "/",
      },
    ],
    // 侧边栏对象
    // 不同子路径下的页面会使用不同的侧边栏
    sidebar: {
      "/": [
        {
          text: "学习笔记",
          // 相对路径会自动追加子路径前缀
          children: [
            {
              text: "DDD Learning",
              link: "/dddlearning/领域驱动设计",
            },
            {
              text: "Github Pages",
              link: "/githubpages/",
            },
            {
              text: "Java Learning",
              link: "/javalearning/",
            },
            {
              text: "VuePress Learning",
              link: "/vuepresslearning/",
            },
          ],
        },
      ],
      "/dddlearning/领域驱动设计": "heading",
      "/githubpages/": "heading",
      "/vuepresslearning/": "heading",
    },
  }),
  plugins: [
    searchPlugin({
      // 配置项
    }),
  ],
});
