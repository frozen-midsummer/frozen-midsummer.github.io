import{_ as l,c as a,a as s,o as r}from"./app-fW5bkkDf.js";const t={};function i(n,e){return r(),a("div",null,e[0]||(e[0]=[s('<h2 id="oracle" tabindex="-1"><a class="header-anchor" href="#oracle"><span>oracle</span></a></h2><h2 id="mysql" tabindex="-1"><a class="header-anchor" href="#mysql"><span>mysql</span></a></h2><h3 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h3><ul><li>在 spring boot 集成 mysql 和 mybatis plus 时，若使用 mysql 的自增索引为主键，在 mapper.selectXXX(QueryWrapper)时会遇到数据映射错位的问题，例如表中 created_time 字段无法映射到 DO 的 createdTime 字段。</li></ul><p>解决方案：使用雪花 id 生成器代替 mysql 的自增索引作为主键</p>',5)]))}const m=l(t,[["render",i],["__file","index.html.vue"]]),o=JSON.parse('{"path":"/serverside/sql/","title":"Sql","lang":"zh-CN","frontmatter":{"lang":"zh-CN","title":"Sql","description":"sql","sidebar":"heading"},"headers":[{"level":2,"title":"oracle","slug":"oracle","link":"#oracle","children":[]},{"level":2,"title":"mysql","slug":"mysql","link":"#mysql","children":[{"level":3,"title":"常见问题","slug":"常见问题","link":"#常见问题","children":[]}]}],"git":{"updatedTime":1735796440000,"contributors":[{"name":"wjx","email":"610798187@qq.com","commits":1,"url":"https://github.com/wjx"}]},"filePathRelative":"serverside/sql/README.md","excerpt":"<h2>oracle</h2>\\n<h2>mysql</h2>\\n<h3>常见问题</h3>\\n<ul>\\n<li>在 spring boot 集成 mysql 和 mybatis plus 时，若使用 mysql 的自增索引为主键，在 mapper.selectXXX(QueryWrapper)时会遇到数据映射错位的问题，例如表中 created_time 字段无法映射到 DO 的 createdTime 字段。</li>\\n</ul>\\n<p>解决方案：使用雪花 id 生成器代替 mysql 的自增索引作为主键</p>\\n"}');export{m as comp,o as data};