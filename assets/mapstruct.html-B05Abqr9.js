import{_ as s,c as a,a as p,o as t}from"./app-fW5bkkDf.js";const e={};function c(l,n){return t(),a("div",null,n[0]||(n[0]=[p(`<h2 id="_0-intro" tabindex="-1"><a class="header-anchor" href="#_0-intro"><span>0 Intro</span></a></h2><p>在 DDD 架构中，mapstruct 是一款实用工具，将 source 类映射为 target 类，本文以 UT2 与 SP11 之间的报文映射为例总结 mapstruct 的使用心得</p><h2 id="_1-基础语法" tabindex="-1"><a class="header-anchor" href="#_1-基础语法"><span>1 基础语法</span></a></h2><h3 id="_1-1-java-表达式" tabindex="-1"><a class="header-anchor" href="#_1-1-java-表达式"><span>1.1 java 表达式</span></a></h3><h3 id="_1-2-不同变量类型的映射" tabindex="-1"><a class="header-anchor" href="#_1-2-不同变量类型的映射"><span>1.2 不同变量类型的映射</span></a></h3><h3 id="_1-3-枚举映射" tabindex="-1"><a class="header-anchor" href="#_1-3-枚举映射"><span>1.3 枚举映射</span></a></h3><h3 id="_1-4-多对一映射" tabindex="-1"><a class="header-anchor" href="#_1-4-多对一映射"><span>1.4 多对一映射</span></a></h3><h4 id="_1-4-1-基本多对一映射" tabindex="-1"><a class="header-anchor" href="#_1-4-1-基本多对一映射"><span>1.4.1 基本多对一映射</span></a></h4><p>其实没啥好写的，问 AI 就行</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token annotation punctuation">@Mapper</span><span class="token punctuation">(</span>componentModel<span class="token operator">=</span><span class="token constant">SPRING</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> testConvertor<span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Mapping</span><span class="token punctuation">(</span>target<span class="token operator">=</span><span class="token string">&quot;name&quot;</span><span class="token punctuation">,</span>expression<span class="token operator">=</span><span class="token string">&quot;java(source1.getName()+source2.getName())&quot;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token class-name">Target</span> <span class="token function">toTarget</span><span class="token punctuation">(</span><span class="token class-name">Source1</span> source1<span class="token punctuation">,</span> <span class="token class-name">Source2</span> source2<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-4-2-服务类传入" tabindex="-1"><a class="header-anchor" href="#_1-4-2-服务类传入"><span>1.4.2 服务类传入</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token annotation punctuation">@Mapper</span><span class="token punctuation">(</span>componentModel<span class="token operator">=</span><span class="token constant">SPRING</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> testConvertor<span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Mapping</span><span class="token punctuation">(</span>target<span class="token operator">=</span><span class="token string">&quot;name&quot;</span><span class="token punctuation">,</span>expression<span class="token operator">=</span><span class="token string">&quot;java(source1.getName()+source2.getName())&quot;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token class-name">Target</span> <span class="token function">toTarget</span><span class="token punctuation">(</span><span class="token class-name">Source1</span> source1<span class="token punctuation">,</span> <span class="token annotation punctuation">@Context</span> <span class="token class-name">SourceService</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-5-before-after-mapping" tabindex="-1"><a class="header-anchor" href="#_1-5-before-after-mapping"><span>1.5 before&amp;after Mapping</span></a></h3><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token annotation punctuation">@AfterMapping</span></span>
<span class="line"><span class="token keyword">default</span> <span class="token keyword">void</span> <span class="token function">afterMapping</span><span class="token punctuation">(</span><span class="token annotation punctuation">@MappingTarget</span> <span class="token class-name">Target</span> target<span class="token punctuation">,</span> <span class="token annotation punctuation">@Context</span> <span class="token class-name">SourceService</span> sourceService<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span><span class="token punctuation">(</span>target<span class="token operator">!=</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token doc-comment comment">/**</span>
<span class="line">         * 映射过程</span>
<span class="line">         */</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-项目应用" tabindex="-1"><a class="header-anchor" href="#_2-项目应用"><span>2 项目应用</span></a></h2><h3 id="_2-1-ut2-与-sp11-之间枚举值的映射" tabindex="-1"><a class="header-anchor" href="#_2-1-ut2-与-sp11-之间枚举值的映射"><span>2.1 UT2 与 SP11 之间枚举值的映射</span></a></h3><p>由于 SP11 与 UT2 采取不同的数据字典，SP11 更倾向于 IMIX 报文风格；而 UT2 采用宽表的设计，数据字典更大、更通用。本节采用 mapstruct 编写 convertor 类统一完成两个系统之间的枚举映射，并进行相应的空值保护。</p><h4 id="_2-1-1-枚举接口" tabindex="-1"><a class="header-anchor" href="#_2-1-1-枚举接口"><span>2.1.1 枚举接口</span></a></h4><p>所有枚举继承此枚举接口，为 code 转枚举和枚举转 code 做了空值保护</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">UtEnumeration</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">T</span> <span class="token function">code</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">String</span> <span class="token function">describe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span> <span class="token keyword">extends</span> <span class="token class-name">Enum</span><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">&gt;</span> <span class="token operator">&amp;</span> <span class="token class-name">UtEnumeration</span><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span><span class="token punctuation">,</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">E</span> <span class="token function">codeOf</span><span class="token punctuation">(</span><span class="token class-name">T</span> code<span class="token punctuation">,</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">&gt;</span></span> clazz<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span><span class="token punctuation">(</span>code<span class="token operator">==</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token class-name">EnumSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">&gt;</span></span> allEnums <span class="token operator">=</span> <span class="token class-name">EnumSet</span><span class="token punctuation">.</span><span class="token function">allOf</span><span class="token punctuation">(</span>clazz<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> allEnums<span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>e <span class="token operator">-&gt;</span> e<span class="token punctuation">.</span><span class="token function">code</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">.</span><span class="token function">findFirst</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">.</span><span class="token function">orElseThrow</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;枚举：[%s]不存在枚举项：[%s]&quot;</span><span class="token punctuation">,</span>clazz<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>code<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span> <span class="token keyword">extends</span> <span class="token class-name">UtEnumeration</span><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span><span class="token punctuation">,</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">T</span> <span class="token function">getCodeOrDefault</span><span class="token punctuation">(</span><span class="token class-name">E</span> value<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token class-name">UtEnumeration</span><span class="token operator">::</span><span class="token function">code</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">.</span><span class="token function">orElse</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-1-2-枚举类" tabindex="-1"><a class="header-anchor" href="#_2-1-2-枚举类"><span>2.1.2 枚举类</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token annotation punctuation">@RequiredArgsConstructor</span></span>
<span class="line"><span class="token annotation punctuation">@Getter</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token keyword">enum</span> <span class="token class-name">Sp11Enunm</span> <span class="token keyword">implements</span> <span class="token class-name">Sp11Enumeration</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">SP11_A</span><span class="token punctuation">(</span><span class="token string">&quot;Sp11A&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;sp11a&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function">SP11_B</span><span class="token punctuation">(</span><span class="token string">&quot;Sp11B&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;sp11b&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">String</span> code<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">String</span> desc<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Sp11Enunm</span> <span class="token function">utCodeOf</span><span class="token punctuation">(</span><span class="token class-name">String</span> ut2<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>ut2<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token class-name">Ut2Enum</span> ut2Enum <span class="token operator">=</span> <span class="token class-name">UtEnumeration</span><span class="token punctuation">.</span><span class="token function">codeOf</span><span class="token punctuation">(</span>ut2<span class="token punctuation">,</span><span class="token class-name">Ut2Enum</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">switch</span><span class="token punctuation">(</span>ut2Enum<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">case</span> <span class="token constant">UT2_A</span><span class="token operator">:</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token constant">SP11_A</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">case</span> <span class="token constant">UT2_B</span><span class="token operator">:</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token constant">SP11_B</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">default</span><span class="token operator">:</span></span>
<span class="line">                <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;枚举Ut2Enunm:[%s]无法映射到系统内枚举[%s]&quot;</span><span class="token punctuation">,</span>ut2<span class="token punctuation">,</span><span class="token string">&quot;Sp11Enunm&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token annotation punctuation">@RequiredArgsConstructor</span></span>
<span class="line"><span class="token annotation punctuation">@Getter</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token keyword">enum</span> <span class="token class-name">Ut2Enum</span> <span class="token keyword">implements</span> <span class="token class-name">UtEnumeration</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">UT2_A</span><span class="token punctuation">(</span><span class="token string">&quot;Ut2A&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;ut2a&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function">UT2_B</span><span class="token punctuation">(</span><span class="token string">&quot;Ut2B&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;ut2b&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">String</span> code<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">String</span> desc<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">getCodeBySpEnum</span><span class="token punctuation">(</span><span class="token class-name">Sp11Enunm</span> sp11Enum<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span><span class="token punctuation">(</span>sp11Enum<span class="token operator">==</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">switch</span><span class="token punctuation">(</span>sp11Enum<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">case</span> <span class="token constant">SP11_A</span><span class="token operator">:</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token constant">UT2_A</span><span class="token punctuation">.</span><span class="token function">code</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">case</span> <span class="token constant">SP11_B</span><span class="token operator">:</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token constant">UT2_B</span><span class="token punctuation">.</span><span class="token function">code</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">default</span><span class="token operator">:</span></span>
<span class="line">                <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;枚举Sp11Enunm:[%s]无法映射到报盘枚举[%s]&quot;</span><span class="token punctuation">,</span>sp11Enum<span class="token punctuation">.</span><span class="token function">code</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token string">&quot;Ut2Enunm&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,22)]))}const i=s(e,[["render",c],["__file","mapstruct.html.vue"]]),u=JSON.parse('{"path":"/projectexperience/utils/mapstruct/mapstruct.html","title":"Mapstruct","lang":"zh-CN","frontmatter":{"lang":"zh-CN","title":"Mapstruct","description":"mapstruct使用经验","sidebar":"heading"},"headers":[{"level":2,"title":"0 Intro","slug":"_0-intro","link":"#_0-intro","children":[]},{"level":2,"title":"1 基础语法","slug":"_1-基础语法","link":"#_1-基础语法","children":[{"level":3,"title":"1.1 java 表达式","slug":"_1-1-java-表达式","link":"#_1-1-java-表达式","children":[]},{"level":3,"title":"1.2 不同变量类型的映射","slug":"_1-2-不同变量类型的映射","link":"#_1-2-不同变量类型的映射","children":[]},{"level":3,"title":"1.3 枚举映射","slug":"_1-3-枚举映射","link":"#_1-3-枚举映射","children":[]},{"level":3,"title":"1.4 多对一映射","slug":"_1-4-多对一映射","link":"#_1-4-多对一映射","children":[]},{"level":3,"title":"1.5 before&after Mapping","slug":"_1-5-before-after-mapping","link":"#_1-5-before-after-mapping","children":[]}]},{"level":2,"title":"2 项目应用","slug":"_2-项目应用","link":"#_2-项目应用","children":[{"level":3,"title":"2.1 UT2 与 SP11 之间枚举值的映射","slug":"_2-1-ut2-与-sp11-之间枚举值的映射","link":"#_2-1-ut2-与-sp11-之间枚举值的映射","children":[]}]}],"git":{"updatedTime":1734601260000,"contributors":[{"name":"wjx","email":"610798187@qq.com","commits":1,"url":"https://github.com/wjx"},{"name":"wangjiaxuan","email":"610798187@qq.com","commits":4,"url":"https://github.com/wangjiaxuan"}]},"filePathRelative":"projectexperience/utils/mapstruct/mapstruct.md","excerpt":"<h2>0 Intro</h2>\\n<p>在 DDD 架构中，mapstruct 是一款实用工具，将 source 类映射为 target 类，本文以 UT2 与 SP11 之间的报文映射为例总结 mapstruct 的使用心得</p>\\n<h2>1 基础语法</h2>\\n<h3>1.1 java 表达式</h3>\\n<h3>1.2 不同变量类型的映射</h3>\\n<h3>1.3 枚举映射</h3>\\n<h3>1.4 多对一映射</h3>\\n<h4>1.4.1 基本多对一映射</h4>\\n<p>其实没啥好写的，问 AI 就行</p>\\n<div class=\\"language-java line-numbers-mode\\" data-highlighter=\\"prismjs\\" data-ext=\\"java\\" data-title=\\"java\\"><pre><code><span class=\\"line\\"><span class=\\"token annotation punctuation\\">@Mapper</span><span class=\\"token punctuation\\">(</span>componentModel<span class=\\"token operator\\">=</span><span class=\\"token constant\\">SPRING</span><span class=\\"token punctuation\\">)</span></span>\\n<span class=\\"line\\"><span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">interface</span> testConvertor<span class=\\"token punctuation\\">{</span></span>\\n<span class=\\"line\\">    <span class=\\"token annotation punctuation\\">@Mapping</span><span class=\\"token punctuation\\">(</span>target<span class=\\"token operator\\">=</span><span class=\\"token string\\">\\"name\\"</span><span class=\\"token punctuation\\">,</span>expression<span class=\\"token operator\\">=</span><span class=\\"token string\\">\\"java(source1.getName()+source2.getName())\\"</span><span class=\\"token punctuation\\">)</span></span>\\n<span class=\\"line\\">    <span class=\\"token class-name\\">Target</span> <span class=\\"token function\\">toTarget</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">Source1</span> source1<span class=\\"token punctuation\\">,</span> <span class=\\"token class-name\\">Source2</span> source2<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span></span>\\n<span class=\\"line\\"><span class=\\"token punctuation\\">}</span></span>\\n<span class=\\"line\\"></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{i as comp,u as data};