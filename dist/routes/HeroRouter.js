"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SGHelper = require('sendgrid').mail;
const SG = require('sendgrid')(process.env.SENDGRID_API_KEY);
class HeroRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    hello(req, res, next) {
        let fromEmail = new SGHelper.Email(req.body.from);
        let toEmail = new SGHelper.Email(req.body.to);
        let subject = req.body.subject;
        let content = new SGHelper.Content('text/plain', req.body.content);
        let mail = new SGHelper.Mail(fromEmail, subject, toEmail, content);
        let request = SG.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });
        SG.API(request, function (error, response) {
            let status = error ? 500 : 200;
            res.status(status).send(response);
        });
    }
    init() {
        this.router.post('/hello/', this.hello);
    }
}
exports.HeroRouter = HeroRouter;
// Create the HeroRouter, and export its configured Express.Router
const heroRoutes = new HeroRouter();
heroRoutes.init();
exports.default = heroRoutes.router;
