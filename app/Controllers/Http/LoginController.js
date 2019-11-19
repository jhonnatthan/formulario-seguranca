"use strict";

const User = use("App/Models/User");

class LoginController {
    async create({ view, session }) {
        const users = await User.all();
        const error = session.pull("error");
        return view.render("auth/login", { users: users.rows, error });
    }
    async store({ request, response, auth, session }) {
        const data = request.only(["username", "password"]);
        try {
            await auth.attempt(data.username, data.password);
            return response.route("dashboard.index");
        } catch (error) {
            session.put("error", "Login e/ou senha incorretos!");
            return response.route("login.create");
        }
    }
    async destroy({ response, auth }) {
        await auth.logout();
        return response.route("login.create");
    }
}

module.exports = LoginController;
