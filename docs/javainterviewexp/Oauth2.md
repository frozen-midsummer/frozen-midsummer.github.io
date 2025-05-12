# Oauth2

主要是授权第三方

+ 授权码模式

![1695133281508](C:\Users\ZGG\AppData\Roaming\Typora\typora-user-images\1695133281508.png)

![1695133302647](C:\Users\ZGG\AppData\Roaming\Typora\typora-user-images\1695133302647.png)

+ 简化模式

![1695133391728](C:\Users\ZGG\AppData\Roaming\Typora\typora-user-images\1695133391728.png)

+ 密码模式

  ![1695133423446](C:\Users\ZGG\AppData\Roaming\Typora\typora-user-images\1695133423446.png)

资源拥有者直接把用户名密码给第三方

+ 客户端模式

  ![1695133476445](C:\Users\ZGG\AppData\Roaming\Typora\typora-user-images\1695133476445.png)

主要在于三方的信任程度。

## jwt令牌

jwt令牌可以解决应用拿到令牌需要请求服务验证所造成的性能瓶颈，jwt令牌实质上是一个加密的字符串

![1695135174801](C:\Users\ZGG\AppData\Roaming\Typora\typora-user-images\1695135174801.png)

 

## sso跟Oauth2的关系

**OAuth2.0**的使用场景通常称为联合登录。一处注册，多处使用。（注册一个微信，可以登录很多地方）

**sso** Single Sign On单点登录。一处登录，多处同时登录。（适用于内部系统，登录淘宝，访问天猫无须登录）

重点是session信息同一存储。都是使用Spring security帮助我们实现。



## 微信开放平台的双向加密

：你向微信发请求，需要带上微信的公钥，微信用私钥解密。微信想你推送消息也相同。

![1695136966272](C:\Users\ZGG\AppData\Roaming\Typora\typora-user-images\1695136966272.png)

