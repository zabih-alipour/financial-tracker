const getPaymentTypes = function () {
  return fetch("/api/paymentTypes")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};
