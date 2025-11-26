package com.example.backend.controller;

import com.example.backend.domain.Book;
import com.example.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookRepository bookRepository;

    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        System.out.println("=================================");
        System.out.println("프론트에서 요청 옴!");
        System.out.println("제목: " + book.getTitle());
        System.out.println("작가: " + book.getOriginalAuthor());
        System.out.println("=================================");

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

        return ResponseEntity.ok(bookRepository.save(book));
    }
}