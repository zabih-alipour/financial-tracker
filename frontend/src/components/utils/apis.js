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

export function investment_details(investment, callback) {
  fetch("/api/investments/details/" + investment.id)
    .then((response) => response.json())
    .then((details) => {
      callback(details);
    });
}

export function get_users(callback) {
  fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    });
}

export function investment_types_search(searchCriteria = null, callback) {
  fetch("/api/investment_types/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchCriteria),
  })
    .then((response) => response.json())
    .then((data) => callback(data));
}

export function payment_type_persist(type, callback) {
  const requestOptions = {
    method: type.id == null ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  };
  fetch("/api/paymentTypes", requestOptions).then((res) => {
    callback("SUCCESSFUL");
  });
}

export function get_payment_types(callback) {
  fetch("/api/paymentTypes")
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    });
}

export function delete_payment_type(type, callback) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };
  fetch("/api/paymentTypes/" + type.id, requestOptions).then((res) => {
    callback();
  });
}

export function payment_search(searchCriteria, callback) {
  fetch("/api/payments/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchCriteria),
  })
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    });
}

export function payment_by_id(payment, callback) {
  fetch("/api/payments/" + payment.id)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    });
}

export function payment_settlement_detail(payment, callback) {
  fetch("/api/payments/by-parent/" + payment.id)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    });
}

export function delete_payment(payment, callback) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };
  fetch("/api/payments/" + payment.id, requestOptions).then((data) => {
    callback(data);
  });
}

export function settlement_payment(payment, callback) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  };
  fetch("/api/payments/settlement", requestOptions).then((data) => {
    callback(data);
  });
}

export function asset_summary(callback) {
  fetch("/api/investments/asset_summary")
    .then((res) => res.json())
    .then((data) => {
      callback(data);
    });
}
