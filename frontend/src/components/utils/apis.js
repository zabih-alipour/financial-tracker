import {toast} from 'react-toastify';

export function shutdown() {
    return fetch("/shutdown")
        .then((res) => toast.success("Server successfully shutdown"))
        .finally(() => window.close());
}


export function save_user(user, callback) {
    const requestOptions = {
        method: user.id == null ? "POST" : "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user),
    };
    callApi("/api/users", requestOptions, {show: true}, callback);
}

export function get_users(callback) {
    const requestOptions = {
        method: "GET"
    };
    callApi("/api/users", requestOptions, {show: false}, callback);
}

export function delete_users(user, callback) {
    const requestOptions = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    };
    callApi("/api/users/" + user.id, requestOptions, {show: true}, callback);
}

export function save_payment(payment, callback) {

    const requestOptions = {
        method: payment.id == null ? "POST" : "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payment),
    };
    callApi("/api/payments", requestOptions, {show: true}, callback);
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

export function investment_search(searchCriteria, callback) {
    fetch("/api/investments/search/v2", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(searchCriteria),
    })
        .then((response) => response.json())
        .then((data) => {
            callback(data);
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

export function get_users_with_detail(params, callback) {
    const {showAsset = false, showBalance = false} = params;
    fetch("/api/users/v2?showAsset=" + showAsset + "&showBalance=" + showBalance)
        .then((response) => response.json())
        .then((data) => callback(data));
}

export function investment_types_search(searchCriteria = null, callback) {
    fetch("/api/investment_types/search", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(searchCriteria),
    })
        .then((response) => response.json())
        .then((data) => callback(data));
}

export function payment_type_persist(type, callback) {
    const init = {
        method: type.id == null ? "POST" : "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(type),
    };

    const notification = {
        show: true,
        message: (type.id == null ? "نوع پرداخت با موفقیت ذخیره شد" : "نوع پرداخت با موفقیت ویرایش شد")
    };
    callApi("/api/paymentTypes/", init, notification, callback)
}

export function get_payment_types(callback) {
    callApi("/api/paymentTypes", null, {show: false}, callback)
}

export function payment_type_user_datails(paymentType, callback) {
    fetch("/api/paymentTypes/users/" + paymentType.id)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        });
}

export function investment_type_user_details(investmentType, callback) {
    fetch("/api/investment_types/type/" + investmentType.id)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        });
}

export function user_per_invest_type_details(user, callback) {
    callApi("/api/investment_types/user/" + user.id, {}, {show: false}, callback);
}


export function user_payment_type_details(user, callback) {
    callApi("/api/users/payment-type/" + user.id, {}, {show: false}, callback)
}

export function delete_payment_type(type, callback) {
    const notification = {show: true, message: "نوع پرداخت با موفقیت حذف شد"};
    const init = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    };
    callApi("/api/paymentTypes/" + type.id, init, notification, callback)
}

export function payment_search(searchCriteria, callback) {
    const notification = {show: false};
    const init = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(searchCriteria),
    };
    callApi("/api/payments/search", init, notification, callback)
}

function callApi(url, init, notification, callback) {
    fetch(url, init)
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            console.log(response)
            if (response.status === "OK") {
                if (notification.show) {
                    toast.success(response.message, {
                        position: toast.POSITION.BOTTOM_LEFT
                    })
                }
                callback(response.data)
            } else if (response.status === "BAD_REQUEST") {
                toast.error(errors(response.message), {
                    position: toast.POSITION.BOTTOM_LEFT
                })
            } else {
                toast.error(response.message, {
                    position: toast.POSITION.BOTTOM_LEFT
                })
            }
        })
        .catch(reason => {
            console.error('Error:', reason);
        });
}

function errors(message) {
    let split = message.split("\n");
    if (split.length === 1) {
        return <div style={{marginTop: 8, color: "red"}}> {split[0]}</div>;
    } else {
        return <ul>
            {
                split.map((val, idx) => {
                    return <li key={idx} style={{marginTop: 8, color: "red"}}> {val}</li>
                })
            }
        </ul>
    }

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
        headers: {"Content-Type": "application/json"},
    };
    fetch("/api/payments/" + payment.id, requestOptions).then((data) => {
        callback(data);
    });
}

export function settlement_payment(payment, callback) {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
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
