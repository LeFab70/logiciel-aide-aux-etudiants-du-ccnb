package com.ccnb.app.user;

public record CampusResponse(Long id, String code, String name) {

    public static CampusResponse from(Campus campus) {
        return new CampusResponse(campus.getId(), campus.getCode(), campus.getName());
    }
}
