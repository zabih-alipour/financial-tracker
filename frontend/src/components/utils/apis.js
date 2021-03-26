export function getPaymentTypes() {
  return fetch("/api/paymentTypes")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function update_market_statics(callback) {
  fetch("/api/investment_types/update/all", {
    method: "PUT",
  }).then((res) => {
    if (callback) {
      callback();
    }
  });
}

export function investment_report_summary(callback) {
  fetch("api/investments/reports/summaries")
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    })
    .catch((e) => console.log(e));
}

export function investment_report_by_user(user, callback) {
  if (user) {
    fetch("api/investments/reports/" + user.id)
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      })
      .catch((e) => console.log(e));
  }
}
