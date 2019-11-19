"use strict";

const User = use("App/Models/User");

class RegisterController {
    create({ view }) {
        return view.render("auth/register");
    }
    async store({ request, response }) {
        const data = request.only(["username", "email", "password"]);
        await User.create(data);
        return response.route("home.index",);
    }
}

module.exports = RegisterController;
