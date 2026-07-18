package com.ccnb.app.content.faq;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/faq")
public class FaqController {

    private final FaqRepository faqRepository;

    public FaqController(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    @GetMapping
    public List<FaqResponse> list(@RequestParam(required = false) Long campusId) {
        List<Faq> faqs =
                campusId != null ? faqRepository.findVisibleForCampus(campusId) : faqRepository.findVisibleForAllCampuses();
        return faqs.stream().map(FaqResponse::from).toList();
    }
}
