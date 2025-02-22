package com.server.services;

import com.server.domain.entities.Car;
import com.server.domain.entities.Purchase;
import com.server.domain.entities.Rent;
import com.server.domain.entities.User;
import com.server.domain.enums.PurchaseStatus;
import com.server.domain.models.binding.PurchaseCarModel;
import com.server.domain.models.view.PurchaseViewModel;
import com.server.exceptions.CarCreationBindingModel;
import com.server.domain.models.view.CarViewModel;
import com.server.domain.models.binding.WithinDatesAndUserNameModel;
import com.server.exceptions.CarHasActiveRentsException;
import com.server.exceptions.CarNotFoundException;
import com.server.repositories.CarRepository;
import com.server.repositories.PurchaseRepository;
import com.server.repositories.RentRepository;
import com.server.repositories.UserRepository;
import com.server.util.PageMapper;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CarServiceImpl implements CarService {
    private final CarRepository carRepository;
    private final ModelMapper modelMapper;
    private final RentRepository rentRepository;
    private final UserRepository userRepository;
    private final PurchaseRepository purchaseRepository;

    public CarServiceImpl(CarRepository carRepository, ModelMapper modelMapper, RentRepository rentRepository, UserRepository userRepository, PurchaseRepository purchaseRepository) {
        this.carRepository = carRepository;
        this.modelMapper = modelMapper;
        this.rentRepository = rentRepository;
        this.userRepository = userRepository;
        this.purchaseRepository = purchaseRepository;

    }

    @Override
    public CarCreationBindingModel CreateCar(CarCreationBindingModel model) {
        Car newCar = modelMapper.map(model, Car.class);

        return this.modelMapper.map(this.carRepository.saveAndFlush(newCar), CarCreationBindingModel.class);
    }
    @Override
    @Transactional
    public PurchaseViewModel purchaseCar(String carId, PurchaseCarModel model) throws Exception {
        Car car = this.carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));

        if (!car.isForSale()) {
            throw new IllegalStateException("This car is not for sale");
        }

        User user = this.userRepository.findByUsername(model.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Purchase purchase = new Purchase();
        purchase.setCar(car);
        purchase.setUser(user);
        purchase.setPrice(car.getPrice());
        purchase.setPurchaseDate(LocalDateTime.now());
        purchase.setStatus(PurchaseStatus.COMPLETED);

        // Update car status
        car.setForSale(false);
        car.setOwner(user);

        this.carRepository.save(car);
        Purchase savedPurchase = this.purchaseRepository.save(purchase);

        return this.modelMapper.map(savedPurchase, PurchaseViewModel.class);
    }
    @Override
    public CarViewModel getFirstById(String id) {

        Car car = this.carRepository.findFirstById(id);
        if(car == null){
            throw new CarNotFoundException();
        }

        return this.modelMapper.map(car, CarViewModel.class);
    }

    @Override
    public boolean deleteById(String id) {
        Car car = this.carRepository.findFirstById(id);
        if (car == null) {
            throw new CarNotFoundException();
        }

        if(car.getActiveRents().size() > 0){
            throw new CarHasActiveRentsException();
        }
        for(Rent r : this.rentRepository.findAllByCar(car)){
            this.rentRepository.delete(r);
        }

        this.carRepository.delete(car);

        return true;
    }

    @Override
    public CarViewModel editCar(String id, CarCreationBindingModel model) {
        Car car = this.carRepository.findFirstById(id);

        if (car == null) {
            throw new CarNotFoundException();
        }

        car.setBrand(model.getBrand());
        car.setModel(model.getModel());
        car.setSeats(model.getSeats());
        car.setYear(model.getYear());
        car.setTrunkCapacity(model.getTrunkCapacity());
        car.setCount(model.getCount());
        car.setImageUrl(model.getImageUrl());
        car.setDescription(model.getDescription());
        car.setLitersPerHundredKilometers(model.getLitersPerHundredKilometers());
        car.setPricePerDay(model.getPricePerDay());
        car.setForSale(model.isForSale());
        car.setPrice(model.getPrice());

        return this.modelMapper.map(this.carRepository.saveAndFlush(car), CarViewModel.class);
    }

    @Override
    public Page<CarViewModel> allCars(Pageable pageable, String query) {
        if(query == null){
            query = "";
        }
        Page<Car> cars = this.carRepository.findAllByBrandContainsOrModelContainsOrderByBrand(pageable, query, query);
        return PageMapper.mapPage(cars, CarViewModel.class, modelMapper);
    }

    @Override
    public Page<CarViewModel> allAvailableCars(Pageable pageable, WithinDatesAndUserNameModel model, String query) {

        List<Car> freeCars = this.carRepository.findAll()
                .stream()
                .filter(c -> c.isAvailable(model.getStartDate(), model.getEndDate())
                                && ( c.getModel().toLowerCase().contains(query.toLowerCase() )
                                    || c.getBrand().toLowerCase().contains(query.toLowerCase())))
                .sorted(Comparator.comparing(Car::getBrand))
                .collect(Collectors.toList());

        long start = pageable.getOffset();

        long end = (start + pageable.getPageSize()) > freeCars.size() ? freeCars.size() : (start + pageable.getPageSize());
        Page<Car> cars = new PageImpl<>(freeCars.subList((int)start, (int)end), pageable, freeCars.size());

        return PageMapper.mapPage(cars, CarViewModel.class, this.modelMapper);
    }

    @Override
    public boolean checkAvailability(String id, LocalDate startDate, LocalDate endDate) {
        Car car = this.carRepository.findFirstById(id);
        if(car == null){
            throw new CarNotFoundException();
        }
        return car.isAvailable(startDate,endDate);
    }
}
