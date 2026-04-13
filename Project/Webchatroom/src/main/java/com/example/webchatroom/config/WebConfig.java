package com.example.webchatroom.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 映射 /uploads/** 到本地 uploads 文件夹
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
    }
}