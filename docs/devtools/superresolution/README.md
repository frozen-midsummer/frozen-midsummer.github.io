## 镜像源配置

conda 镜像源配置参考此文章
https://blog.csdn.net/SUNYUAN0627/article/details/130181974
pip 镜像源配置参考此文章
https://blog.csdn.net/weixin_57950978/article/details/142653359

```sh
# 配置镜像源
## conda镜像源
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
## pip镜像源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
## pip镜像源位置
C:\Users\jxwang\AppData\Roaming\pip\pip.ini
# 设置搜索时显示通道地址
conda config --set show_channel_urls yes
# 创建虚拟环境
conda create -n BasicSR python=3.6
# 遇到问题
AttributeError: module 'lib' has no attribute 'X509_V_FLAG_CB_ISSUER_CHECK'
# 解决方案
pip uninstall pyOpenSSL
pip install pyOpenSSL
pip install pyOpenSSL --upgrade --可选
# 继续创建虚拟环境
conda create -n BasicSR python=3.6
# 进入项目路径
cd C:/Users/jxwang/Desktop/superresolution/BasicSR-master
# 安装requirements.txt
pip install -r requirements.txt
# 报错
Exception: Building py-lmdb from source on Windows requires the "patch-ng" python module.
# 安装patch-ng
pip install patch-ng
# 继续安装requirements.txt
pip install -r requirements.txt
```
