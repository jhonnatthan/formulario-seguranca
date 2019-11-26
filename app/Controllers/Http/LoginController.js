"use strict";

const User = use("App/Models/User");
const Env = use("Env");
const axios = use("axios");

class LoginController {
    async create({ view, session }) {
        const users = await User.all();
        const error = session.pull("error");
        return view.render("auth/login", { users: users.rows, error });
    }
    async store({ request, response, auth, session }) {
        const data = request.all();

        if (data["g-recaptcha-response"] != null) {
            console.log(Env.get("RECAPTCHA_SECRET"));
            let url = "https://www.google.com/recaptcha/api/siteverify";
            url = url + `?secret=${Env.get("RECAPTCHA_SECRET")}`;
            url = url + `&response=${data["g-recaptcha-response"]}`;

            const response = await axios.post(url);

            if (response.data.success) {
                try {
                    await auth.attempt(data.username, data.password);
                    return response.route("dashboard.index");
                } catch (error) {
                    session.put("error", "Login e/ou senha incorretos!");
                    return response.route("login.create");
                }
            } else {
                session.put("error", "Captcha inválido");
                return response.route("login.create");
            }
        } else {
            session.put("error", "Captcha inválido");
            return response.route("login.create");
        }
    }
    async destroy({ response, auth }) {
        await auth.logout();
        return response.route("login.create");
    }
}

module.exports = LoginController;
