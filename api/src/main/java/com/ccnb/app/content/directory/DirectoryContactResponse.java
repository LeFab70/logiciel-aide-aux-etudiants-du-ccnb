package com.ccnb.app.content.directory;

public record DirectoryContactResponse(
        Long id,
        Long campusId,
        String name,
        String role,
        String department,
        String email,
        String phone,
        String officeLocation) {

    public static DirectoryContactResponse from(DirectoryContact contact) {
        return new DirectoryContactResponse(
                contact.getId(),
                contact.getCampus().getId(),
                contact.getName(),
                contact.getRole(),
                contact.getDepartment(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getOfficeLocation());
    }
}
