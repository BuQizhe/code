# 基础镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 复制jar包
COPY target/Webchatroom-0.0.1-SNAPSHOT.jar app.jar

# 创建图片上传目录
RUN mkdir -p /app/uploads

# 暴露端口
EXPOSE 8080

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]