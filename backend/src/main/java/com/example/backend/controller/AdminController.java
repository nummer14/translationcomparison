package com.example.backend.controller;

import com.example.backend.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final TranslationService translationService;
    private final com.example.backend.repository.TranslationRepository translationRepository;

    @PostMapping("/translations/{id}/approve")
    public ResponseEntity<String> approveTranslation(
            @PathVariable Long id,
            @RequestParam boolean approve
    ) {
        translationService.approveTranslation(id, approve);
        return ResponseEntity.ok(approve ? "Approved" : "Rejected");
    }

    @GetMapping("/translations/pending")
    public ResponseEntity<java.util.List<com.example.backend.dto.TranslationDto>> getPendingTranslations() {

        java.util.List<com.example.backend.dto.TranslationDto> list =
                translationRepository.findAll().stream()
                        .filter(t -> t.getStatus() == com.example.backend.domain.ApprovalStatus.PENDING)
                        .map(t -> com.example.backend.dto.TranslationDto.builder()
                                .id(t.getId())
                                .translator(t.getTranslator())
                                .publisher(t.getPublisher())
                                .year(t.getPublishedYear())
                                .status(t.getStatus().name())
                                .build()
                        )
                        .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(list);
    }
}
