package com.ccnb.app.content.campusplan;

import com.ccnb.app.user.Campus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "campus_plan")
@Getter
@Setter
@NoArgsConstructor
public class CampusPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id", nullable = false, unique = true)
    private Campus campus;

    @Column(name = "image_url")
    private String imageUrl;

    private String description;

    @OneToMany(mappedBy = "campusPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanPoint> points = new ArrayList<>();
}
