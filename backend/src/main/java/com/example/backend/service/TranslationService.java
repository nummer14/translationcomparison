package com.example.backend.service;

import com.example.backend.domain.*;
import com.example.backend.dto.TranslationDto;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TranslationService {
    private final TranslationRepository translationRepository;
    private final BookRepository bookRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<TranslationDto> getApprovedTranslations(Long bookId) {
        return translationRepository.findByBookIdAndStatus(bookId, ApprovalStatus.APPROVED)
                .stream()
                .map(t -> TranslationDto.builder()
                        .id(t.getId())
                        .translator(t.getTranslator())
                        .publisher(t.getPublisher())
                        .year(t.getPublishedYear())
                        .description(t.getDescription())
                        .status(t.getStatus().name())
                        .imagePath(t.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void proposeTranslation(Long bookId, TranslationDto request, User uploader) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        String imageFileName = null;
        if (request.getCoverImage() != null && !request.getCoverImage().isEmpty()) {
            imageFileName = fileStorageService.storeFile(request.getCoverImage());
        }

        Translation translation = Translation.builder()
                .book(book)
                .translator(request.getTranslator())
                .publisher(request.getPublisher())
                .publishedYear(request.getYear())
                .description(request.getDescription())
                .uploader(uploader)
                .status(ApprovalStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .imagePath(imageFileName)
                .build();

        translationRepository.save(translation);
    }

    @Transactional
    public void approveTranslation(Long translationId, boolean approve) {
        Translation t = translationRepository.findById(translationId)
                .orElseThrow(() -> new RuntimeException("Not found"));
        if (approve) t.approve();
        else t.reject();
    }
}