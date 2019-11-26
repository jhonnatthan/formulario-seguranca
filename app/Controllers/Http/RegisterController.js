"use strict";

const User = use("App/Models/User");
const Env = use("Env");
const axios = use("axios");
const Mail = use("Mail");

class RegisterController {
    create({ view, session }) {
        const error = session.pull("error");
        return view.render("auth/register", { error });
    }
    async store({ request, response, session }) {
        const { "g-recaptcha-response": captcha } = request.all();

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

                    await Mail.send("emails.welcome", {}, message => {
                        message
                            .to(data.email)
                            .from("jhonnatthan.santos@fatec.sp.gov.br")
                            .subject("Seja bem vindo!");
                    });

                    return response.route("home.index");
                } catch (error) {
                    console.log(error);
                    session.put("error", "Erro ao cadastrar o usuário");
                }
            } else {
                session.put("error", "Captcha inválido");
            }
        } else {
            session.put("error", "Captcha inválido");
        }
        return response.route("register.create");
    }
}

module.exports = RegisterController;
