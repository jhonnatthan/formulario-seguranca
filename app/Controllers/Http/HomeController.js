"use strict";

class HomeController {
    index({ response }) {
        return response.route("login.create");
    }
}

module.exports = HomeController;
