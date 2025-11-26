package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranslationDto {
    private Long id;
    private String translator;
    private String publisher;
    private Integer year;
    private String description;
    private String status;
    private MultipartFile coverImage;
    private String imagePath;
}