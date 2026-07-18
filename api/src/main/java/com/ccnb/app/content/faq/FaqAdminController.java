package com.ccnb.app.content.faq;

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
@RequestMapping("/api/v1/admin/faq")
public class FaqAdminController {

    private final FaqRepository faqRepository;
    private final CampusRepository campusRepository;

    public FaqAdminController(FaqRepository faqRepository, CampusRepository campusRepository) {
        this.faqRepository = faqRepository;
        this.campusRepository = campusRepository;
    }

    @PostMapping
    public ResponseEntity<FaqResponse> create(@Valid @RequestBody FaqRequest request) {
        Faq faq = new Faq();
        applyRequest(faq, request);
        faq = faqRepository.save(faq);
        return ResponseEntity.status(HttpStatus.CREATED).body(FaqResponse.from(faq));
    }

    @PutMapping("/{id}")
    public FaqResponse update(@PathVariable Long id, @Valid @RequestBody FaqRequest request) {
        Faq faq = faqRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FAQ introuvable"));
        applyRequest(faq, request);
        return FaqResponse.from(faqRepository.save(faq));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!faqRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "FAQ introuvable");
        }
        faqRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(Faq faq, FaqRequest request) {
        Campus campus = null;
        if (request.campusId() != null) {
            campus = campusRepository
                    .findById(request.campusId())
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Campus invalide"));
        }
        faq.setCampus(campus);
        faq.setQuestion(request.question());
        faq.setAnswer(request.answer());
        faq.setCategory(request.category());
        faq.setDisplayOrder(request.displayOrder());
    }
}
