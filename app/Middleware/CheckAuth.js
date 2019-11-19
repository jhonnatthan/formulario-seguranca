"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckAuth {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({ response, auth }, next) {
        try {
            if (await auth.check()) {
                await next();
            }
        } catch (error) {
            return response.route("login.create");
        }
    }
}

module.exports = CheckAuth;
