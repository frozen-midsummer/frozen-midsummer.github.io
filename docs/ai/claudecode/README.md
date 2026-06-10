---
lang: zh-CN
title: Claude Code
description: CC(Claude Code)的使用
sidebar: heading
---

# Claude Code 完整使用指南

## 0 序言

### 什么是 Claude Code？

Claude Code 是 Anthropic 推出的官方命令行工具，它将 Claude AI 的强大能力直接集成到开发者的工作流程中。通过 Claude Code，你可以在终端中直接与 Claude 交互，让 AI 助手帮你完成代码编写、调试、重构、文档生成等各种开发任务。

### 核心特性

- **智能代码编辑**：Claude 可以直接读取、编辑和创建文件
- **项目理解**：通过上下文管理，Claude 能够理解整个项目结构
- **工具系统**：内置多种工具（Bash、Git、文件操作等）
- **代理系统**：支持子代理（Sub-agents）处理复杂任务
- **MCP 扩展**：通过 Model Context Protocol 扩展 Claude 的能力
- **Skills 系统**：可以定义可重用的技能和工作流

### 适用场景

- 快速原型开发
- 代码重构和优化
- Bug 调试和修复
- 生成单元测试
- 编写技术文档
- 代码审查和解释
- 项目迁移和升级

---

## 快速开始

### 安装 Claude Code

#### 1. 前置要求

- Node.js >= 18.0.0
- npm 或 pnpm
- 稳定的网络连接

#### 2. 安装命令

打开 PowerShell 或 CMD，运行以下命令：

```powershell
npm install -g @anthropic-ai/claude-code
```

国内用户可以使用镜像源加速：

```powershell
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com
```

**注意**：如果遇到权限问题，请以管理员身份运行 PowerShell。

#### 3. 验证安装

安装完成后，输入以下命令检查是否安装成功：

```powershell
claude --version
```

如果看到版本号输出，说明安装成功。

### 初始化配置

#### 1. 设置 API Key

首次使用需要配置 Anthropic API Key：

```bash
claude auth login
```

系统会引导你完成认证流程。你也可以直接在配置文件中设置：

```bash
# 查看配置文件路径
claude config path

# 编辑配置文件
# Windows: %USERPROFILE%\.claude\config.json
# macOS/Linux: ~/.claude/config.json
```

#### 2. 基础配置示例

```json
{
  "apiKey": "your-api-key-here",
  "model": "claude-sonnet-4-5-20250929",
  "maxTokens": 200000,
  "temperature": 0.7
}
```

### 更新 Claude Code

定期更新以获取最新功能和修复：

```bash
claude update
```

或使用 npm：

```bash
npm update -g @anthropic-ai/claude-code
```

### 第一次使用

#### 启动交互式会话

```bash
# 在当前目录启动
claude

# 在指定目录启动
claude --cwd /path/to/project
```

#### 基础命令示例

```bash
# 让 Claude 帮你创建一个简单的函数
> 帮我写一个 JavaScript 函数，用于验证邮箱格式

# 让 Claude 解释代码
> 解释一下 src/utils/auth.js 文件的功能

# 让 Claude 重构代码
> 重构 components/UserList.vue，使用 Composition API
```

---

## 核心概念

### 工具系统（Tools）

Claude Code 内置了多种工具，让 Claude 能够执行各种操作：

#### 1. 文件操作工具

- **Read**：读取文件内容
- **Write**：写入新文件
- **Edit**：编辑现有文件
- **Glob**：文件模式匹配和查找
- **Grep**：内容搜索

**示例**：
```bash
> 读取 package.json 文件并显示所有依赖项
```
Claude 会使用 Read 工具读取文件，然后解析并展示依赖项。

#### 2. Shell 工具

- **Bash**：执行 shell 命令
- **KillShell**：终止后台进程

**示例**：
```bash
> 运行 npm install 安装依赖
> 启动开发服务器
```

#### 3. Git 工具

- 自动使用 Bash 工具执行 Git 命令
- 支持提交、分支管理、PR 创建等

**示例**：
```bash
> 创建一个新分支 feature/add-login
> 提交当前更改，commit message: "Add login functionality"
```

#### 4. LSP 工具

- **goToDefinition**：跳转到定义
- **findReferences**：查找引用
- **hover**：获取悬停信息
- **documentSymbol**：获取文档符号

#### 5. Web 工具

- **WebFetch**：获取网页内容
- **WebSearch**：搜索网络信息

### 代理系统（Agents）

Claude Code 使用分层代理架构处理复杂任务：

#### 主代理（Main Agent）

- 与用户直接交互
- 分配任务给子代理
- 汇总子代理的结果

#### 子代理（Sub-agents）

不同类型的子代理专注于特定任务：

| 代理类型 | 用途 | 工具权限 |
|---------|------|---------|
| `general-purpose` | 通用任务、代码搜索、多步骤任务 | 所有工具 |
| `Explore` | 快速探索代码库、查找文件、搜索关键字 | 所有工具 |
| `Plan` | 设计实现计划、架构设计 | 所有工具 |
| `claude-code-guide` | Claude Code 使用指南查询 | Glob, Grep, Read, WebFetch, WebSearch |

#### 使用子代理

**快捷键**：`Ctrl+B` - 将当前任务转发给子代理

**示例**：
```bash
> 找到所有使用了 deprecated API 的文件
# 按 Ctrl+B，让 Explore 代理处理
```

### 计划模式（Plan Mode）

对于复杂的实现任务，Claude 会先进入计划模式：

1. 探索代码库
2. 设计实现方案
3. 提交计划给用户审批
4. 用户批准后执行

**触发条件**：
- 新功能实现
- 多文件重构
- 架构决策
- 复杂的 bug 修复

---

## 上下文管理

上下文管理是 Claude Code 的核心功能之一。良好的上下文管理能够：
- 减少 token 消耗
- 提高响应速度
- 保持对话聚焦

上下文管理可以分为三类：**卸载**、**精简**和**隔离**。

### 卸载（Offload）

将静态的项目信息从对话上下文中分离出来。

#### CLAUDE.md 文件

最经典的上下文卸载方式。在项目根目录创建 `CLAUDE.md` 文件，写入项目信息：

```markdown
# CLAUDE.md

这个文件提供给 Claude Code 关于项目的背景信息。

## 项目概述
这是一个使用 Vue 3 和 TypeScript 开发的电商管理系统。

## 技术栈
- 前端：Vue 3 + TypeScript + Vite
- 状态管理：Pinia
- 路由：Vue Router 4
- UI 框架：Element Plus
- 后端：Node.js + Express + MongoDB

## 项目结构
- `src/components/` - Vue 组件
- `src/views/` - 页面视图
- `src/store/` - Pinia 状态管理
- `src/api/` - API 请求封装
- `src/utils/` - 工具函数

## 编码规范
- 使用 ESLint + Prettier
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 优先使用 Composition API

## 常用命令
- 开发：`pnpm dev`
- 构建：`pnpm build`
- 测试：`pnpm test`
```

**优势**：
- Claude 自动读取并记忆项目信息
- 每次会话自动加载，无需重复说明
- 减少初始对话的 token 消耗
- 团队成员可以共享项目知识

**最佳实践**：
- 保持 CLAUDE.md 简洁明了
- 定期更新项目变更
- 包含关键的架构决策
- 添加常见问题和解决方案

### 精简（Compact）

压缩对话历史，保留关键信息。

#### /compact 命令

```bash
/compact
```

**功能**：
- 自动总结之前的对话
- 保留重要的上下文信息
- 清理冗余的对话内容
- 大幅减少 token 消耗

**使用场景**：
- 长对话后感觉响应变慢
- 切换到新的任务主题
- 需要重置对话焦点

**示例**：
```bash
# 经过一系列代码修改后
> /compact
# Claude 会总结之前的工作，然后你可以开始新任务
> 现在帮我添加用户认证功能
```

### 隔离（Isolate）

将复杂任务委托给子代理，保持主对话清晰。

#### Ctrl+B 快捷键

**快捷键**：`Ctrl+B`

**功能**：
- 将当前任务转发给专门的子代理
- 子代理在独立的上下文中工作
- 完成后返回精简的结果摘要

**工作流程**：
```
主会话 → [Ctrl+B] → 子代理处理 → 返回结果 → 主会话继续
```

**示例**：
```bash
# 主会话中
> 帮我找出项目中所有的性能瓶颈

# 按 Ctrl+B
# 子代理会：
# 1. 搜索代码
# 2. 分析性能问题
# 3. 生成报告
# 4. 将报告返回给主会话

# 主会话收到简洁的分析结果，无需看到所有中间过程
```

**优势**：
- 主会话保持简洁
- 复杂搜索不污染上下文
- 并行处理多个任务
- 更好的关注点分离

### 上下文管理最佳实践

| 场景 | 推荐策略 | 原因 |
|------|---------|------|
| 项目初始化 | 创建 CLAUDE.md | 一次性加载项目信息 |
| 长对话后 | 使用 /compact | 清理历史，保持性能 |
| 代码搜索 | 使用 Ctrl+B | 避免搜索结果污染上下文 |
| 任务切换 | /compact + 新对话 | 清晰的任务边界 |
| 复杂分析 | Ctrl+B 委托子代理 | 并行处理，结果聚焦 |

---

## MCP (Model Context Protocol)

MCP 是 Claude 的扩展协议，允许接入外部工具和数据源。

### MCP 基础概念

#### 什么是 MCP？

Model Context Protocol（模型上下文协议）是一个开放标准，让 AI 模型能够安全地访问外部工具、数据库和服务。

#### MCP 服务器的类型

- **工具服务器**：提供额外的工具能力（如文件系统访问、数据库查询）
- **数据服务器**：提供特定领域的数据（如文档、API 数据）
- **集成服务器**：连接第三方服务（如 GitHub、Notion）

### 常用 MCP 服务器

#### 1. Serena

功能丰富的文件系统和项目管理 MCP。

**仓库**：https://github.com/oraios/serena

**功能**：
- 高级文件系统操作
- 项目结构分析
- 代码导航和搜索
- 智能文件管理

**安装**：
```bash
# 使用 uvx（推荐）
claude mcp add serena -- uvx serena start-mcp-server

# 或者从本地源码
git clone https://github.com/oraios/serena.git
claude mcp add --scope user serena -- uv --project "path/to/serena" run serena start-mcp-server --context claude-code --project-from-cwd
```

#### 2. DeepWiki

GitHub 仓库文档和知识库访问。

**功能**：
- 读取 GitHub 仓库的 Wiki
- 访问项目文档
- 查询仓库结构

**使用示例**：
```bash
# 在 Claude Code 中使用 DeepWiki 工具
> 使用 DeepWiki 读取 facebook/react 的文档结构
```

#### 3. Context7

在线代码上下文服务。

**官网**：https://context7.com/dashboard

**功能**：
- 云端代码索引
- 跨项目搜索
- 代码关系图谱
- 智能代码推荐

**配置**：
1. 在 Context7 网站注册账号
2. 获取 API Key
3. 配置到 Claude Code：

```bash
claude mcp add context7 -- npx -y @context7/mcp-server --api-key YOUR_API_KEY
```

### MCP 配置管理

#### 查看已安装的 MCP

```bash
claude mcp list
```

#### 添加 MCP 服务器

```bash
# 语法
claude mcp add <name> -- <command>

# 示例：添加用户级别的 MCP
claude mcp add --scope user my-mcp -- npx my-mcp-server

# 示例：添加项目级别的 MCP
claude mcp add --scope project my-mcp -- ./local-mcp-server.js
```

#### 删除 MCP 服务器

```bash
claude mcp remove <name>
```

#### 编辑 MCP 配置

配置文件位置：
- **用户级别**：`~/.claude/mcp.json`
- **项目级别**：`.claude/mcp.json`

配置文件示例：
```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": ["serena", "start-mcp-server"],
      "env": {}
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server", "--api-key", "YOUR_API_KEY"],
      "env": {}
    }
  }
}
```

### 本地运行 MCP 的最佳实践

像 context7、serena 等 MCP 支持本地运行调用。使用 `uvx` 运行时常常会遇到启动失败的问题。

**解决方案**：

1. **克隆源码到本地**

```bash
git clone https://github.com/oraios/serena.git
cd serena
```

2. **使用本地路径配置**

```bash
# Windows 示例
claude mcp add --scope user serena -- uv --project "D:/projects/serena" run serena start-mcp-server --context claude-code --project-from-cwd

# macOS/Linux 示例
claude mcp add --scope user serena -- uv --project "/Users/username/projects/serena" run serena start-mcp-server --context claude-code --project-from-cwd
```

3. **验证配置**

```bash
claude mcp list
# 检查 serena 是否正常列出
```

**注意事项**：
- 确保 Python 和 uv 已正确安装
- 路径使用绝对路径，避免相对路径问题
- 定期更新本地 MCP 源码（`git pull`）

### 自定义 MCP 服务器

你也可以创建自己的 MCP 服务器。

**基础模板**：

```javascript
// my-mcp-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-custom-mcp',
  version: '1.0.0',
});

// 定义工具
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'my_tool',
      description: 'My custom tool',
      inputSchema: {
        type: 'object',
        properties: {
          input: { type: 'string' }
        },
        required: ['input']
      }
    }
  ]
}));

// 处理工具调用
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'my_tool') {
    // 实现你的工具逻辑
    return {
      content: [
        {
          type: 'text',
          text: `Processed: ${request.params.arguments.input}`
        }
      ]
    };
  }
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## Claude Skills

Skills 是 Claude Code 的可重用工作流系统，类似于编程中的函数或宏。

### 什么是 Skills？

Skills 允许你定义可重用的任务流程，通过简单的命令即可调用。

**示例场景**：
- 定期执行的代码审查流程
- 标准化的项目初始化步骤
- 自动化的测试和部署流程

### 内置 Skills

查看可用的 Skills：

```bash
claude skills list
```

### 创建自定义 Skill

#### 1. Skill 文件位置

- **用户级别**：`~/.claude/skills/`
- **项目级别**：`.claude/skills/`

#### 2. Skill 文件格式

创建 `my-skill.md`：

```markdown
---
name: code-review
description: 执行代码审查流程
---

# Code Review Skill

请按照以下步骤执行代码审查：

1. 检查代码风格是否符合项目规范
2. 查找潜在的 bug 和性能问题
3. 验证是否有适当的错误处理
4. 检查是否有安全漏洞
5. 评估代码的可维护性
6. 生成审查报告

## 检查项

- [ ] 代码格式化
- [ ] 命名规范
- [ ] 注释完整性
- [ ] 单元测试覆盖率
- [ ] 性能优化机会
- [ ] 安全性检查
```

#### 3. 使用 Skill

```bash
> /code-review src/components/UserList.vue
```

### Skill 最佳实践

- **模块化**：每个 Skill 专注于一个明确的任务
- **文档化**：在 Skill 中包含清晰的说明
- **参数化**：使用占位符支持动态输入
- **版本控制**：将 Skills 纳入项目的 Git 仓库

---

## 命令参考

### Slash Commands（斜杠命令）

| 命令 | 功能 | 示例 |
|------|------|------|
| `/help` | 显示帮助信息 | `/help` |
| `/clear` | 清除当前会话 | `/clear` |
| `/compact` | 压缩对话历史 | `/compact` |
| `/exit` | 退出 Claude Code | `/exit` |
| `/settings` | 打开设置 | `/settings` |

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+B` | 将任务委托给子代理 |
| `Ctrl+C` | 中断当前操作 |
| `Ctrl+D` | 退出 Claude Code |
| `↑` / `↓` | 浏览命令历史 |

### 终端文本编辑快捷键

在 Claude Code 的输入框中，可以使用以下快捷键高效编辑文本：

| 快捷键 | 功能 |
|--------|------|
| `Home` | 移动光标到行首 |
| `End` | 移动光标到行尾 |
| `Ctrl+A` | 移动光标到行首（同 `Home`） |
| `Ctrl+E` | 移动光标到行尾（同 `End`） |
| `Ctrl+←` | 光标向后移动一个单词 |
| `Ctrl+→` | 光标向前移动一个单词 |
| `Alt+B` | 光标向后移动一个单词（类 Unix 终端风格） |
| `Alt+F` | 光标向前移动一个单词（类 Unix 终端风格） |
| `Ctrl+U` | 删除光标前的整行内容 |
| `Ctrl+K` | 删除光标后的整行内容 |
| `Ctrl+W` | 删除光标前的一个单词 |
| `Ctrl+D` | 删除光标所在位置的字符 |
| `Ctrl+H` / `Backspace` | 删除光标前的一个字符 |

### CLI 参数

```bash
# 指定工作目录
claude --cwd /path/to/project

# 指定模型
claude --model claude-opus-4-5-20251101

# 指定配置文件
claude --config /path/to/config.json

# 调试模式
claude --debug

# 查看版本
claude --version
```

---

## 最佳实践

### 1. 有效的提示词（Prompting）

#### 清晰明确
```bash
# ❌ 不好
> 改进这个文件

# ✅ 好
> 重构 src/utils/auth.js，将所有的回调函数改为 async/await，并添加错误处理
```

#### 提供上下文
```bash
# ❌ 不好
> 添加一个按钮

# ✅ 好
> 在 LoginForm.vue 的表单底部添加一个"忘记密码"按钮，点击后跳转到 /reset-password 路由
```

#### 分步骤执行
```bash
# ❌ 不好
> 实现完整的用户管理系统

# ✅ 好
> 第一步：创建 User 模型和数据库 schema
# 完成后
> 第二步：实现用户 CRUD 的 API 端点
# 完成后
> 第三步：创建用户管理的前端界面
```

### 2. 项目结构优化

#### 使用 CLAUDE.md

在每个项目根目录创建 `CLAUDE.md`，包含：
- 项目概述
- 技术栈
- 目录结构
- 编码规范
- 常用命令

#### 使用 .claudeignore

类似于 `.gitignore`，创建 `.claudeignore` 排除不需要 Claude 访问的文件：

```
node_modules/
dist/
build/
.env
*.log
coverage/
.git/
```

### 3. 上下文管理策略

#### 定期压缩

在长对话中定期使用 `/compact`：
```bash
# 每完成一个大任务后
> /compact

# 或者感觉响应变慢时
> /compact
```

#### 任务隔离

对于探索性任务，使用 `Ctrl+B`：
```bash
# 主会话
> 分析项目中的性能问题
# 按 Ctrl+B，让子代理处理分析
```

#### 新会话策略

对于完全不同的任务，考虑启动新会话：
```bash
# 在终端中
# Ctrl+C 退出当前会话
# 重新启动
claude
```

### 4. Git 工作流集成

#### 提交前审查

```bash
> 检查暂存区的代码，确保没有问题后创建 commit
```

#### 创建 PR

```bash
> 将当前分支的更改创建一个 Pull Request，标题是 "Add user authentication"，描述包含主要变更点
```

#### 代码审查

```bash
> 审查 PR #123 的代码变更，重点关注安全性和性能
```

### 5. 错误处理

#### 遇到错误时

```bash
# ❌ 不好
> 修复这个错误

# ✅ 好
> 运行测试时出现 "TypeError: Cannot read property 'name' of undefined"，错误发生在 src/components/UserProfile.vue:45，帮我定位并修复
```

#### 调试策略

```bash
> 在 src/api/user.js 的 fetchUser 函数中添加 console.log，帮我调试为什么用户数据没有正确加载
```

---

## 高级用法

### 1. 自动化工作流

#### 使用 Skills 链

创建复杂的自动化流程：

```bash
# 创建 deploy.skill.md
> /deploy
# 该 Skill 会自动：
# 1. 运行测试
# 2. 构建项目
# 3. 提交更改
# 4. 创建 tag
# 5. 推送到远程
```

#### 钩子（Hooks）

在 `.claude/config.json` 中配置钩子：

```json
{
  "hooks": {
    "beforeEdit": "npm run lint",
    "afterCommit": "npm run test"
  }
}
```

### 2. 团队协作

#### 共享 CLAUDE.md

将项目规范和最佳实践写入 `CLAUDE.md`，让团队成员的 Claude Code 保持一致的理解。

#### 共享 Skills

在项目的 `.claude/skills/` 目录中定义团队通用的 Skills：

```
.claude/
  skills/
    code-review.md
    deploy.md
    generate-docs.md
```

### 3. 多项目管理

#### 项目模板

创建项目模板，包含标准的 `CLAUDE.md` 和 Skills：

```bash
my-project-template/
  CLAUDE.md
  .claude/
    config.json
    skills/
      init.md
      test.md
```

#### 工作区切换

```bash
# 在不同项目间快速切换
cd ~/projects/project-a && claude
# 完成后
cd ~/projects/project-b && claude
# 每个项目有独立的上下文
```

---

## 常见问题与故障排查

### 安装和配置问题

#### Q: 安装时提示权限错误

**A**: 以管理员身份运行终端，或使用 npm 的用户目录：

```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
npm install -g @anthropic-ai/claude-code
```

#### Q: API Key 配置失败

**A**: 手动编辑配置文件：

1. 找到配置文件：`claude config path`
2. 编辑文件，添加：
```json
{
  "apiKey": "sk-ant-..."
}
```

### 使用问题

#### Q: Claude 响应很慢

**A**: 可能是上下文过长，尝试：
- 使用 `/compact` 压缩对话
- 使用 `Ctrl+B` 委托子代理处理复杂任务
- 检查 `.claudeignore` 是否正确排除了大文件

#### Q: MCP 服务器启动失败

**A**:
1. 检查 MCP 配置：`claude mcp list`
2. 查看日志：`claude --debug`
3. 尝试使用本地源码安装（参见 MCP 章节）

#### Q: 文件编辑后出现错误

**A**:
- 检查是否有语法错误
- 使用 Git 回滚：`git checkout -- <file>`
- 让 Claude 修复：`刚才的修改导致语法错误，请修复`

### 性能优化

#### Q: 如何减少 token 消耗？

**A**:
1. 使用 `CLAUDE.md` 卸载静态信息
2. 配置 `.claudeignore` 排除无关文件
3. 定期使用 `/compact`
4. 对复杂搜索使用 `Ctrl+B`

#### Q: 如何提高响应速度？

**A**:
1. 使用更快的模型（如 `claude-sonnet`）
2. 减少上下文长度
3. 使用 MCP 服务器缓存外部数据
4. 本地部署 MCP 服务器

---

## 参考资源

### 官方文档

- [Claude Code 官方文档](https://docs.anthropic.com/claude/claude-code)
- [Anthropic API 文档](https://docs.anthropic.com/)
- [MCP 协议规范](https://modelcontextprotocol.io/)

### 社区资源

- [Claude Code GitHub Issues](https://github.com/anthropics/claude-code/issues)
- [MCP 服务器列表](https://github.com/modelcontextprotocol/servers)

### 相关工具

- [VS Code 集成](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code)
- [JetBrains IDE 插件](https://plugins.jetbrains.com/plugin/claude-code)

---

## 附录

### A. 快速命令速查表

```bash
# 安装和更新
npm install -g @anthropic-ai/claude-code  # 安装
claude update                              # 更新
claude --version                          # 查看版本

# 会话管理
claude                                    # 启动
claude --cwd /path/to/project            # 指定目录
/compact                                  # 压缩对话
/clear                                    # 清除会话
/exit 或 Ctrl+D                          # 退出

# MCP 管理
claude mcp list                           # 列出 MCP
claude mcp add <name> -- <command>       # 添加 MCP
claude mcp remove <name>                 # 删除 MCP

# 配置管理
claude config path                        # 配置路径
claude auth login                         # 登录认证
```

### B. 配置文件模板

#### config.json
```json
{
  "apiKey": "sk-ant-...",
  "model": "claude-sonnet-4-5-20250929",
  "maxTokens": 200000,
  "temperature": 0.7,
  "hooks": {
    "beforeEdit": "npm run lint",
    "afterCommit": "npm run test"
  }
}
```

#### .claudeignore
```
node_modules/
dist/
build/
*.log
.env
.env.local
coverage/
.git/
.DS_Store
```

### C. 术语表

| 术语 | 说明 |
|------|------|
| Agent | 代理，执行任务的 AI 实体 |
| Sub-agent | 子代理，处理特定任务的专门代理 |
| MCP | Model Context Protocol，模型上下文协议 |
| Skill | 可重用的工作流程 |
| Tool | 工具，Claude 可以调用的函数 |
| Context | 上下文，对话历史和项目信息 |
| Compact | 压缩，总结并简化上下文 |
| Hook | 钩子，在特定事件触发的命令 |

---

**最后更新时间**：2025-12-29