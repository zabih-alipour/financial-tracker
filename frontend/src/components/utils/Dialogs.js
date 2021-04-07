import InvestmentSpecificDetail from "../investement/InvestmentSpecificDetail";
import InvestmentForm from "../investement/InvestmentForm";
import InvestmentTypeForm from "../investement/InvestmentTypeForm";
import PaymentTypeForm from "../accountant/PaymentTypeForm";
import PaymentListPopup from "../accountant/PaymentListPopup";
import PaymentForm from "../accountant/PaymentForm";
import UserForm from "../user/UserForm";

export const INVESTMENT_FORM_KEY = "INVESTMENT_FORM";
export const INVESTMENT_SPECIFIC_DETAIL_KEY = "INVESTMENT_SPECIFIC_DETAIL";
export const INVESTMENT_TYPE_FORM_KEY = "INVESTMENT_TYPE_FORM";
export const PAYMENT_TYPE_FORM_KEY = "PAYMENT_TYPE_FORM";
export const PAYMENT_LIST_POPUP_KEY = "PAYMENT_LIST_POPUP";
export const PAYMENT_FORM_KEY = "PAYMENT_FORM";
export const USER_FORM_KEY = "USER_FORM";

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
  }
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
