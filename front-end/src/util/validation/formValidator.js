const registerValidation = (username, email, password, confirmPassword) => {
  const validEmail = (() => {
    const mailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const testMail = mailRegex.test(email);
    return testMail && email !== "" && email.length < 36;
  })();

  const validUsername = (() => {
    return username.length > 3 && username.length < 16 && username !== "";
  })();

  const validPassword = (() => {
    return password.length > 7 && password.length < 21 && password !== "";
  })();

  const validConfirmPassword = (() => {
    return (
      confirmPassword.length > 7 &&
      confirmPassword.length < 21 &&
      confirmPassword !== "" &&
      confirmPassword === password
    );
  })();

  return {
    validEmail,
    validUsername,
    validPassword,
    validConfirmPassword,
  };
};

const loginValidation = (username, password) => {
  const validUsername = (() => {
    return username.length > 3 && username.length < 16 && username !== "";
  })();

  const validPassword = (() => {
    return password.length > 7 && password.length < 21 && password !== "";
  })();

  return {
    validUsername,
    validPassword,
  };
};

const dateValidation = (startDate, endDate) => {
  const currentDateTime = new Date(Date.now()).setHours(0, 0, 0, 0);
  const startDateTime = new Date(startDate).setHours(0, 0, 0, 0);
  const endDateTime = new Date(endDate).setHours(0, 0, 0, 0);

  const validStartDate = (() => {
    return startDateTime >= currentDateTime && startDateTime <= endDateTime;
  })();

  const validEndDate = (() => {
    return endDateTime >= currentDateTime && startDateTime <= endDateTime;
  })();

  return {
    validStartDate,
    validEndDate,
  };
};

const createCarValidation = (
  brand,
  model,
  count,
  seats,
  year,
  fuelExpense,
  description,
  imageUrl,
  trunkCapacity,
  pricePerDay,
  forSale,
  price,
  priceAttachment
) => {
  const validBrand = (() => {
    return brand.length > 2 && brand.length < 15 && brand !== "";
  })();

  const validModel = (() => {
    return brand !== "";
  })();

  const validDescription = (() => {
    return (
      description.length > 10 && description.length < 500 && description !== ""
    );
  })();

  const validImage = (() => {
    return (
      (imageUrl.startsWith("https://") || imageUrl.startsWith("http://")) &&
      imageUrl.length >= 10
    );
  })();

  const validTrunkCapacity = (() => {
    return trunkCapacity !== "";
  })();

  const validPrice = (() => {
    return pricePerDay > 0 && pricePerDay !== "";
  })();

  const validCount = (() => {
    return count > 0 && count !== "";
  })();

  const validYear = (() => {
    return year > 0 && year !== "";
  })();

  const validSeats = (() => {
    return seats > 0 && seats !== "";
  })();

  const validFuelExpense = (() => {
    return fuelExpense > 0 && fuelExpense !== "";
  })();

  const validSalePrice = (() => {
    return !forSale || (forSale && price > 0 && price !== "");
  })();

  const validPriceAttachment = (() => {
    return priceAttachment >= 0 && priceAttachment !== "";
  })();

  return {
    validBrand,
    validModel,
    validDescription,
    validImage,
    validTrunkCapacity,
    validPrice,
    validSeats,
    validYear,
    validFuelExpense,
    validCount,
    validSalePrice,
    validPriceAttachment,
  };
};

export {
  registerValidation,
  loginValidation,
  createCarValidation,
  dateValidation,
};
