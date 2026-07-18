package com.ccnb.app.content.directory;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/directory")
public class DirectoryContactController {

    private final DirectoryContactRepository directoryContactRepository;

    public DirectoryContactController(DirectoryContactRepository directoryContactRepository) {
        this.directoryContactRepository = directoryContactRepository;
    }

    @GetMapping
    public List<DirectoryContactResponse> list(@RequestParam Long campusId) {
        return directoryContactRepository.findByCampusIdOrderByNameAsc(campusId).stream()
                .map(DirectoryContactResponse::from)
                .toList();
    }
}
