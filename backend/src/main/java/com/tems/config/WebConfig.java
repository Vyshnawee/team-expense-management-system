package com.tems.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  //allow all end points
                        .allowedOrigins("http://localhost:5173")  //only allow this url from frontend
                        .allowedMethods("*");  //all http methods are allowed
            }
            
            // for static files
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:C:/Users/Admin/git/repository/tems/backend/uploads/");
            }
        };
    }
}