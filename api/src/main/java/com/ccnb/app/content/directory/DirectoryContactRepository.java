package com.ccnb.app.content.directory;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectoryContactRepository extends JpaRepository<DirectoryContact, Long> {

    List<DirectoryContact> findByCampusIdOrderByNameAsc(Long campusId);
}
