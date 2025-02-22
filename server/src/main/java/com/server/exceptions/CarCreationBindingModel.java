package com.server.exceptions;

import org.hibernate.validator.constraints.Length;
import javax.validation.constraints.*;

public class CarCreationBindingModel {
    private String brand;
    private String model;
    private Integer trunkCapacity;
    private Integer seats;
    private Integer year;
    private String description;
    private String imageUrl;
    private Double litersPerHundredKilometers;
    private Double pricePerDay;
    private Integer count;
    private boolean isForSale;
    private Double price;

    public CarCreationBindingModel() {
    }

    @NotNull
    @Length(min=3, max=15)
    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    @NotNull
    @Length(min=1, max=15)
    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    @NotNull
    @Length(min=10, max=500)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @NotNull
    @Min(1)
    public Integer getTrunkCapacity() {
        return trunkCapacity;
    }

    public void setTrunkCapacity(Integer trunkCapacity) {
        this.trunkCapacity = trunkCapacity;
    }

    @NotNull
    @Min(1)
    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    @NotNull
    @Min(1)
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    @NotNull
    @Length(min=14)
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @NotNull
    @DecimalMin("0.1")
    public Double getLitersPerHundredKilometers() {
        return litersPerHundredKilometers;
    }

    public void setLitersPerHundredKilometers(Double litersPerHundredKilometers) {
        this.litersPerHundredKilometers = litersPerHundredKilometers;
    }

    // Remove @NotNull from pricePerDay since it's conditional
    @DecimalMin("0.1")
    public Double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(Double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    @NotNull
    public boolean isForSale() {
        return isForSale;
    }

    public void setForSale(boolean forSale) {
        isForSale = forSale;
    }

    @DecimalMin("0.1")
    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    // Add custom validation method
    @AssertTrue(message = "Either price or pricePerDay must be set based on forSale flag")
    private boolean isPricingValid() {
        if (isForSale) {
            return price != null && price > 0 && pricePerDay == null;
        } else {
            return pricePerDay != null && pricePerDay > 0 && price == null;
        }
    }

    @NotNull
    @Min(1)
    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}