package com.example.backend.controller;

import com.example.backend.domain.Book;
import com.example.backend.repository.BookRepository;
import com.example.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookRepository bookRepository;
    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<Book> createBook(
            @RequestParam("title") String title,
            @RequestParam("originalAuthor") String originalAuthor,
            @RequestParam("category") String category,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        String imagePath = null;
        if (coverImage != null && !coverImage.isEmpty()) {
            imagePath = fileStorageService.storeFile(coverImage);
        }

        Book book = Book.builder()
                .title(title)
                .originalAuthor(originalAuthor)
                .category(category)
                .imagePath(imagePath)
                .build();

        return ResponseEntity.ok(bookRepository.save(book));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setTitle(bookDetails.getTitle());
        book.setOriginalAuthor(bookDetails.getOriginalAuthor());
        book.setCategory(bookDetails.getCategory());

        return ResponseEntity.ok(bookRepository.save(book));
    }

}