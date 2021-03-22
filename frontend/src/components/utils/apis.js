const getPaymentTypes = function () {
  return fetch("/api/paymentTypes")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export function update_market_statics(callback) {
  fetch("/api/investment_types/update/all", {
    method: "PUT",
  }).then((res) => {
    if (callback) {
      callback();
    }
  });
}
