"use strict";

const User = use("App/Models/User");

class LoginController {
    async create({ view }) {
        const users = await User.all();
        return view.render("auth/login", { users: users.rows });
    }
    async store({ request, response, auth }) {
        const data = request.only(["username", "password"]);
        await auth.attempt(data.username, data.password);
        return response.route("dashboard.index");
    }
    async destroy({ response, auth }) {
        await auth.logout();
        return response.route("login.create");
    }
}

module.exports = LoginController;
