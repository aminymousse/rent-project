package com.server.domain.models.binding;

import javax.validation.constraints.NotEmpty;

public class PurchaseCarModel {
    @NotEmpty(message = "Username cannot be empty")
    private String username;

    // Constructor
    public PurchaseCarModel() {
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}