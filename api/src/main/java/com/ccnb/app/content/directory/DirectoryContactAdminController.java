package com.ccnb.app.content.directory;

import com.ccnb.app.common.ApiException;
import com.ccnb.app.user.Campus;
import com.ccnb.app.user.CampusRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/directory")
public class DirectoryContactAdminController {

    private final DirectoryContactRepository directoryContactRepository;
    private final CampusRepository campusRepository;

    public DirectoryContactAdminController(
            DirectoryContactRepository directoryContactRepository, CampusRepository campusRepository) {
        this.directoryContactRepository = directoryContactRepository;
        this.campusRepository = campusRepository;
    }

    @PostMapping
    public ResponseEntity<DirectoryContactResponse> create(@Valid @RequestBody DirectoryContactRequest request) {
        DirectoryContact contact = new DirectoryContact();
        applyRequest(contact, request);
        contact = directoryContactRepository.save(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(DirectoryContactResponse.from(contact));
    }

    @PutMapping("/{id}")
    public DirectoryContactResponse update(
            @PathVariable Long id, @Valid @RequestBody DirectoryContactRequest request) {
        DirectoryContact contact = directoryContactRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Contact introuvable"));
        applyRequest(contact, request);
        return DirectoryContactResponse.from(directoryContactRepository.save(contact));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!directoryContactRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Contact introuvable");
        }
        directoryContactRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(DirectoryContact contact, DirectoryContactRequest request) {
        Campus campus = campusRepository
                .findById(request.campusId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Campus invalide"));
        contact.setCampus(campus);
        contact.setName(request.name());
        contact.setRole(request.role());
        contact.setDepartment(request.department());
        contact.setEmail(request.email());
        contact.setPhone(request.phone());
        contact.setOfficeLocation(request.officeLocation());
    }
}
