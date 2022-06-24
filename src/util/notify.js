import Moralis from "moralis";
import { Notify, openURL } from "quasar";
import { i18n } from "../boot/i18n";
import { TX_URL } from "../util/constants";
import { isString } from "lodash";

const { t, te } = i18n.global;

export const notifyTx = (hash) => {
  return Notify.create({
    message: t("Transaction Pending"),
    type: "warning",
    spinner: true,
    timeout: 0,
    position: "top-right",
    multiLine: false,
    actions: [
      {
        label: t("View"),
        color: "primary",
        handler() {
          openURL(TX_URL + hash);
        },
      },
      { icon: "close", color: "grey-10, dense: true" },
    ],
  });
};

export const notifyCopied = (text) => {
  return Notify.create({
    message: formatSuccess("Copied" + " " + text),
    icon: "copy",
    position: "bottom",
    multiLine: false,
    timeout: 1e3,
  });
};

export const notifyError = (error) => {
  Notify.create({
    message: formatError(error),
    type: "negative",
    icon: "error",
    timeout: 0,
    position: "top-right",
    actions: [{ icon: "close", color: "grey-1", dense: true }],
  });
};

export const notifySuccess = (success, timeout = 3e3) => {
  return Notify.create({
    message: formatSuccess(success),
    type: "positive",
    icon: "success",
    position: "top-right",
    multiLine: false,
    actions: [{ icon: "close", color: "grey-1", dense: true }],
    timeout,
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
    actions: [{ icon: "close", color: "grey-10", dense: true }],
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
    actions: [{ icon: "close", color: "grey-1", dense: true }],
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

export const listenPending = async ({
  params,
  onCreation,
  onUpdate,
  onNewlyMatched,
  onNewlyUnmatched,
  onDeletion,
}) => {
  const Pending = Moralis.Object.extend("Pending");
  const query = new Moralis.Query(Pending);
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) query.containedIn(key, value);
    else query.equalTo(key, value);
  });
  const subscription = await query.subscribe();

  const formatPendingChange = (pendingChange) => ({
    id: pendingChange.id,
    eventName: pendingChange.get("eventName"),
    entityType: pendingChange.get("entityType"),
    entityId: pendingChange.get("entityId"),
    dataFromUI: pendingChange.get("dataFromUI"),
    dataFromChain: pendingChange.get("dataFromChain"),
  });

  if (onCreation)
    subscription.on("create", (pendingChange) =>
      onCreation(formatPendingChange(pendingChange))
    );
  if (onUpdate)
    subscription.on("update", (pendingChange) =>
      onUpdate(formatPendingChange(pendingChange))
    );
  if (onNewlyMatched)
    subscription.on("enter", (pendingChange) =>
      onNewlyMatched(formatPendingChange(pendingChange))
    );
  if (onNewlyUnmatched)
    subscription.on("leave", (pendingChange) =>
      onNewlyUnmatched(formatPendingChange(pendingChange))
    );
  if (onDeletion)
    subscription.on("delete", (pendingChange) =>
      onDeletion(formatPendingChange(pendingChange))
    );

  const initialPendingChanges = Object.fromEntries(
    (await query.find()).map((pendingChange) => [
      pendingChange.id,
      formatPendingChange(pendingChange),
    ])
  );
  return {
    subscription,
    initialPendingChanges,
  };
};
