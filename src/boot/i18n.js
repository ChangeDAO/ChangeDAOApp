import { boot } from "quasar/wrappers";
import { createI18n, DefineDateTimeFormat } from "vue-i18n";
import messages from "src/i18n";

const numberFormats = {
  "en-US": {
    compactUSD: {
      style: "currency",
      currency: "USD",
      notation: "compact"
    },
    USD: {
      style: "currency",
      currency: "USD"
    }
  }
};

const datetimeFormats = {
  "en-US": {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric"
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric"
    }
  }
};

const i18n = createI18n({
  locale: navigator.language,
  fallbackLocale: "en-US",
  messages,
  numberFormats,
  datetimeFormats
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
