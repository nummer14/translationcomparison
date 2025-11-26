package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String path = Paths.get("uploads").toAbsolutePath().toUri().toString();

        System.out.println("이미지 경로 연결됨: " + path);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(path);
    }
}