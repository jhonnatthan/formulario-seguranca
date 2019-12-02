"use strict";

const User = use("App/Models/User");
const Env = use("Env");
const axios = use("axios");
const Mail = use("Mail");

class RegisterController {
    create({ view, session }) {
        const error = session.pull("error");
        const success = session.pull("success");
        return view.render("auth/register", { error, success });
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

                    const user = await User.create(data);

                    try {
                        await Mail.send(
                            "emails.welcome",
                            user.toJSON(),
                            message => {
                                message
                                    .to(user.email)
                                    .from(Env.get("MAIL_USERNAME"))
                                    .subject("Seja bem vindo!");
                            }
                        );
                    } catch (error) {
                        console.log(
                            "--------------------------- E-mail error ---------------------------"
                        );
                        console.log(error);

                        session.put(
                            "error",
                            "Erro ao enviar e-mail de cadastro"
                        );
                    }

                    session.put("success", "Usuário cadastrado com sucesso");
                } catch (error) {
                    console.log(
                        "--------------------------- Cadastrar usuário ---------------------------"
                    );
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
