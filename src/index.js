import For from "./components/For.vue";
import Break from "./components/Break.vue";
import Continue from "./components/Continue.vue";

export default {
    install(app) {
        app.component("for", For);
        app.component("break", Break);
        app.component("continue", Continue);
    },
};
