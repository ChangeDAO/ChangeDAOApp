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

export default boot(({ app }) => {
  const i18n = createI18n({
    locale: "en-US",
    messages,
    numberFormats,
    datetimeFormats
  });

  // Set i18n instance on app
  app.use(i18n);
});
