"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckUnauth {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({ response, auth }, next) {
        try {
            if (await auth.check()) {
                return response.route("dashboard.index");
            } else {
                await next();
            }
        } catch (error) {
            await next();
        }
    }
}

module.exports = CheckUnauth;
