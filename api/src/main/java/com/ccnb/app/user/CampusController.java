package com.ccnb.app.user;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/campuses")
public class CampusController {

    private final CampusRepository campusRepository;

    public CampusController(CampusRepository campusRepository) {
        this.campusRepository = campusRepository;
    }

    @GetMapping
    public List<CampusResponse> list() {
        return campusRepository.findAll().stream().map(CampusResponse::from).toList();
    }
}
