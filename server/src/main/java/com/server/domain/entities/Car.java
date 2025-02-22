package com.server.domain.entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Entity
@Table(name = "cars")
public class Car extends BaseEntity {

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    private Integer trunkCapacity;
    private String description;
    private Integer year;
    private Integer seats;
    private String imageUrl;
    private Double litersPerHundredKilometers;
    private Double pricePerDay;
    private Integer count;
    private boolean isForSale;
    @Column(nullable = true)
    private Double price;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rent> activeRents = new ArrayList<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Purchase> purchases = new ArrayList<>();

    public Car() {
        this.activeRents = new ArrayList<>();
        this.purchases = new ArrayList<>();
    }

    // Getters and Setters
    public List<Rent> getActiveRents() {
        return activeRents;
    }

    public void setActiveRents(List<Rent> activeRents) {
        this.activeRents = activeRents;
    }

    public List<Purchase> getPurchases() {
        return purchases;
    }

    public void setPurchases(List<Purchase> purchases) {
        this.purchases = purchases;
    }

    public void addPurchase(Purchase purchase) {
        purchases.add(purchase);
        purchase.setCar(this);
    }

    public void removePurchase(Purchase purchase) {
        purchases.remove(purchase);
        purchase.setCar(null);
    }


    @Column(nullable = false)
    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    @Column(nullable = false)
    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    @Lob
    @Column(nullable = false)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(nullable = false)
    public Integer getTrunkCapacity() {
        return trunkCapacity;
    }

    public void setTrunkCapacity(Integer trunkCapacity) {
        this.trunkCapacity = trunkCapacity;
    }

    @Column(nullable = false)
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    @Column(nullable = false)
    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    @Column(nullable = false)
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Column(nullable = false)
    public Double getLitersPerHundredKilometers() {
        return litersPerHundredKilometers;
    }

    public void setLitersPerHundredKilometers(Double litersPerHundredKilometers) {
        this.litersPerHundredKilometers = litersPerHundredKilometers;
    }

    @Column(nullable = false)
    public Double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(Double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    @Column(nullable = false)
    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }


    @Column(nullable = false)
    public boolean isForSale() {
        return isForSale;
    }

    public void setForSale(boolean forSale) {
        isForSale = forSale;
    }

    @Column(nullable = false)
    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    @ManyToOne
    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public boolean isAvailable(LocalDate startDate, LocalDate endDate){
        long rents = this.getActiveRents()
                .stream()
                .filter(r -> (!startDate.isBefore(r.getStartDate()) && !startDate.isAfter(r.getEndDate()))
                            || (!endDate.isAfter(r.getEndDate()) && !endDate.isBefore(r.getStartDate()))
                            || (endDate.isAfter(r.getEndDate()) && startDate.isBefore(r.getStartDate())))
                .count();

        return rents < this.getCount();
    }
}
