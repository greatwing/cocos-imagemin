# 使用gulp-imagemin压缩cocos creator项目里的图片

### 安装:  
npm install

### 使用方法:
1. 配置path.json
2. 运行gulp 

---------------
### Nginx的配置心得：
#### 一、压缩设置
1. 编辑nginx.conf
```
    gzip  on;
    gzip_min_length 1000;
    gzip_buffers 4 16k;
    gzip_comp_level 2;
    gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/json application/javascript font/ttf application/octet-stream;
    gzip_vary on;
    gzip_disable "MSIE [1-6].";
```
2. 重新加载Nginx  
    ps -ef|grep nginx
    /usr/sbin/nginx -s reload    
    
3. 用curl测试Gzip是否成功开启  
    curl -I -H "Accept-Encoding: gzip, deflate" "http://xxx"
    
    
#### 二、缓存设置
1. 在server块前配置  
```
    map $sent_http_content_type $expires {
        default                    off;
        text/html                  epoch;
        text/css                   max;
        application/javascript     max;
        application/json           max;
        ~image/                    max;
    }
```
2. 在server块里增加配置  
expires $expires;

3. 重新加载Nginx  
/usr/sbin/nginx -s reload

4. 用curl测试
    curl -I "http://xxx"