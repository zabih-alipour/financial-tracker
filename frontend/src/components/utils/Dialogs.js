import InvestmentSpecificDetail from "../investement/InvestmentSpecificDetail";
import InvestmentForm from "../investement/InvestmentForm";
import InvestmentTypeForm from "../investement/InvestmentTypeForm";
import PaymentTypeForm from "../accountant/PaymentTypeForm";
import PaymentListPopup from "../accountant/PaymentListPopup";
import PaymentForm from "../accountant/PaymentForm";
import UserForm from "../user/UserForm";
import PaymentSettlementForm from "../accountant/PaymentSettlementForm";
import PaymentDetail from "../accountant/PaymentDetails";
import PaymenttypeUserDetail from "../accountant/PaymentTypeUserDetail";
import UserPaymentTypeDetail from "../accountant/UserPaumentTypeDetail";
import InvestementTypeUserDetail from "../investement/InvestementTypeUserDetail";
import UserPerInvestementTypeDetail from "../investement/UserPerInvestementTypeDetail";

export const INVESTMENT_FORM_KEY = "INVESTMENT_FORM";
export const INVESTMENT_SPECIFIC_DETAIL_KEY = "INVESTMENT_SPECIFIC_DETAIL";
export const INVESTMENT_TYPE_FORM_KEY = "INVESTMENT_TYPE_FORM";
export const PAYMENT_TYPE_FORM_KEY = "PAYMENT_TYPE_FORM";
export const PAYMENT_LIST_POPUP_KEY = "PAYMENT_LIST_POPUP";
export const PAYMENT_FORM_KEY = "PAYMENT_FORM";
export const USER_FORM_KEY = "USER_FORM";
export const PAYMENT_SETTLEMENT_KEY = "PAYMENT_SETTLEMENT";
export const PAYMENT_LIST_DETAIL_KEY = "PAYMENT_LIST_DETAIL";
export const PAYMENT_TYPE_USER_DETAIL_KEY = "PAYMENT_TYPE_USER_DETAIL";
export const USER_PAYMENT_TYPE_DETAIL_KEY = "USER_PAYMENT_TYPE_DETAIL";
export const INVESTMENT_TYPE_USER_DETAIL_KEY = "INVESTMENT_TYPE_USER_DETAIL";
export const USER_INVESTMENT_TYPE_DETAIL_KEY = "USER_INVESTMENT_TYPE_DETAIL";


export function ShowDialog(info, onCloseCallback) {
  const { dialog } = info;
  if (dialog === INVESTMENT_FORM_KEY) {
    return INVESTMENT_FORM(info, onCloseCallback);
  } else if (dialog === INVESTMENT_SPECIFIC_DETAIL_KEY) {
    return INVESTMENT_SPECIFIC_DETAIL(info, onCloseCallback);
  } else if (dialog === INVESTMENT_TYPE_FORM_KEY) {
    return INVESTMENT_TYPE_FORM(info, onCloseCallback);
  } else if (dialog === PAYMENT_TYPE_FORM_KEY) {
    return PAYMENT_TYPE_FORM(info, onCloseCallback);
  } else if (dialog === PAYMENT_LIST_POPUP_KEY) {
    return PAYMENT_LIST_POPUP(info, onCloseCallback);
  } else if (dialog === PAYMENT_FORM_KEY) {
    return PAYMENT_FORM(info, onCloseCallback);
  } else if (dialog === USER_FORM_KEY) {
    return USER_FORM(info, onCloseCallback);
  } else if (dialog === PAYMENT_SETTLEMENT_KEY) {
    return PAYMENT_SETTLEMENT(info, onCloseCallback);
  } else if (dialog === PAYMENT_LIST_DETAIL_KEY) {
    return PAYMENT_LIST_DETAIL(info, onCloseCallback);
  } else if (dialog === PAYMENT_TYPE_USER_DETAIL_KEY) {
    return PAYMENT_TYPE_USER_DETAIL(info, onCloseCallback);
  } else if (dialog === USER_PAYMENT_TYPE_DETAIL_KEY) {
    return USER_PAYMENT_TYPE_DETAIL(info, onCloseCallback);
  } else if (dialog === INVESTMENT_TYPE_USER_DETAIL_KEY) {
    return INVESTMENT_TYPE_USER_DETAIL(info, onCloseCallback);
  } else if (dialog === USER_INVESTMENT_TYPE_DETAIL_KEY) {
    return USER_INVESTMENT_TYPE_DETAIL(info, onCloseCallback);
  }

}

function USER_INVESTMENT_TYPE_DETAIL(info, onCloseCallback) {
  return (
    <UserPerInvestementTypeDetail
      user={info.user}
      openDialog={true}
      onClose={onCloseCallback}
    />
  );
}

function INVESTMENT_TYPE_USER_DETAIL(info, onCloseCallback) {
  return (
    <InvestementTypeUserDetail
      investmentType={info.type}
      openDialog={true}
      onClose={onCloseCallback}
    />
  );
}


function USER_PAYMENT_TYPE_DETAIL(info, onCloseCallback) {
  return (
    <UserPaymentTypeDetail
      user={info.user}
      openDialog={true}
      onClose={onCloseCallback}
    />
  );
}

function PAYMENT_TYPE_USER_DETAIL(info, onCloseCallback) {
  return (
    <PaymenttypeUserDetail
      paymentType={info.type}
      openDialog={true}
      onClose={onCloseCallback}
    />
  );
}

function PAYMENT_LIST_DETAIL(info, onCloseCallback) {
  return (
    <PaymentDetail
      payment={info.payment}
      openDialog={true}
      onClose={onCloseCallback}
    />
  );
}

function PAYMENT_SETTLEMENT(info, onCloseCallback) {
  return (
    <PaymentSettlementForm
      payment={info.payment}
      openDialog={true}
      onClose={onCloseCallback}
    />
  );
}

function USER_FORM(info, onCloseCallback) {
  return (
    <UserForm user={info.user} openDialog={true} onClose={onCloseCallback} />
  );
}

function INVESTMENT_TYPE_FORM(info, onCloseCallback) {
  return (
    <InvestmentTypeForm
      openDialog={true}
      type={info.type}
      onClose={onCloseCallback}
    />
  );
}

function INVESTMENT_SPECIFIC_DETAIL(info, onCloseCallback) {
  const { user, type } = info;
  console.log(info);
  return (
    <InvestmentSpecificDetail
      openDialog={true}
      user={user}
      type={type}
      onClose={onCloseCallback}
    />
  );
}

function INVESTMENT_FORM(info, onCloseCallback) {
  const investment = {
    user: info.user,
    change: {
      investmentType: info.type,
    },
  };
  return (
    <InvestmentForm
      openDialog={true}
      investment={investment}
      onClose={onCloseCallback}
    />
  );
}

function PAYMENT_TYPE_FORM(info, onCloseCallback) {
  const { type } = info;
  return (
    <PaymentTypeForm openDialog={true} type={type} onClose={onCloseCallback} />
  );
}

function PAYMENT_LIST_POPUP(info, onCloseCallback) {
  const { type, user } = info;
  return (
    <PaymentListPopup
      openDialog={true}
      user={user}
      type={type}
      onClose={onCloseCallback}
    />
  );
}

function PAYMENT_FORM(info, onCloseCallback) {
  var { type, payment } = info;

  if (type) {
    payment = {
      paymentType: type,
    };
  }
  return (
    <PaymentForm
      openDialog={true}
      payment={payment}
      onClose={onCloseCallback}
    />
  );
}
