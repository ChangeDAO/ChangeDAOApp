import { Notify, openURL } from "quasar";
import { i18n } from "../boot/i18n";
import { TX_URL } from "../util/constants";
import { isString } from "lodash";

const { t, te } = i18n.global;

export const notifyTx = (hash) => {
  return Notify.create({
    message: t("Transaction Pending"),
    type: "warning",
    icon: "pending",
    timeout: 0,
    position: "top-right",
    multiLine: false,
    actions: [
      {
        label: t("View"),
        color: "primary",
        noDismiss: true,
        handler() {
          openURL(TX_URL + hash);
        },
      },
      { icon: "close", color: "grey-10" },
    ],
  });
};

export const notifyError = (error) => {
  Notify.create({
    message: formatError(error),
    type: "negative",
    icon: "error",
    timeout: 0,
    position: "top-right",
    actions: [{ icon: "close", color: "grey-1" }],
  });
};

export const notifySuccess = (success) => {
  return Notify.create({
    message: formatSuccess(success),
    type: "positive",
    icon: "success",
    timeout: 0,
    position: "top-right",
    multiLine: false,
    actions: [{ icon: "close", color: "grey-1" }],
  });
};

export const notifyWarning = (warning) => {
  return Notify.create({
    message: formatWarning(warning),
    type: "warning",
    icon: "warning",
    timeout: 0,
    position: "top-right",
    multiLine: false,
    actions: [{ icon: "close", color: "grey-10" }],
  });
};

export const notifyHint = (hint) => {
  return Notify.create({
    message: formatHint(hint),
    type: "info",
    icon: "info",
    timeout: 0,
    position: "top-right",
    multiLine: false,
    actions: [{ icon: "close", color: "grey-1" }],
  });
};

export const formatError = (error) => {
  if (isString(error)) {
    if (te(`error["${error}"]`)) {
      return t(`error["${error}"]`);
    } else {
      return error;
    }
  } else {
    if (te(`error["${error.code}"]`)) {
      return t(`error["${error.code}"]`);
    } else if ("message" in error) {
      if (te(`error["${error.message}"]`)) {
        return t(`error["${error.message}"]`);
      } else {
        return error.message;
      }
    }
  }
};

export const formatSuccess = (success) => {
  if (isString(success)) {
    if (te(`success["${success}"]`)) {
      return t(`success["${success}"]`);
    } else {
      return success;
    }
  }
};

export const formatWarning = (warning) => {
  if (isString(warning)) {
    if (te(`warning["${warning}"]`)) {
      return t(`warning["${warning}"]`);
    } else {
      return warning;
    }
  } else {
    if (te(`warning["${warning.code}"]`)) {
      return t(`warning["${warning.code}"]`);
    } else if ("message" in warning) {
      if (te(`warning["${warning.message}"]`)) {
        return t(`warning["${warning.message}"]`);
      } else {
        return warning.message;
      }
    }
  }
};

export const formatHint = (hint) => {
  if (isString(hint)) {
    if (te(`hint["${hint}"]`)) {
      return t(`hint["${hint}"]`);
    } else {
      return hint;
    }
  }
};
