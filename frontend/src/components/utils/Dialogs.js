import InvestmentSpecificDetail from "../investement/InvestmentSpecificDetail";
import InvestmentForm from "../investement/InvestmentForm";

export function ShowDialog(info, onCloseCallback) {
  const { dialog } = info;
  if (dialog === "INVESTMENT_FORM") {
    return INVESTMENT_FORM(info, onCloseCallback);
  } else if (dialog === "INVESTMENT_SPECIFIC_DETAIL") {
    return INVESTMENT_SPECIFIC_DETAIL(info, onCloseCallback);
  }
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