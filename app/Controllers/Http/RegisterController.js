"use strict";

const User = use("App/Models/User");
const Env = use("Env");
const axios = use("axios");

class RegisterController {
    create({ view, session }) {
        const error = session.pull("error");
        return view.render("auth/register", { error });
    }
    async store({ request, response, session }) {
        const captcha = request.get("g-recaptcha-response");

        if (captcha) {
            let url = "https://www.google.com/recaptcha/api/siteverify";
            url = url + `?secret=${Env.get("RECAPTCHA_SECRET")}`;
            url = url + `&response=${captcha}`;

            const response = await axios.post(url);

            if (response.data.success) {
                try {
                    const data = request.only([
                        "username",
                        "email",
                        "password"
                    ]);

                    await User.create(data);
                    return response.route("home.index");
                } catch (error) {
                    session.put("error", "Erro ao cadastrar o usuário");
                    return response.route("home.index");
                }
            } else {
                session.put("error", "Captcha inválido");
                return response.route("home.index");
            }
        } else {
            session.put("error", "Captcha inválido");
            return response.route("home.index");
        }
    }
}

module.exports = RegisterController;
