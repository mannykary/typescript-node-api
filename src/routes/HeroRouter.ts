import {Router, Request, Response, NextFunction} from 'express';
const SGHelper = require('sendgrid').mail;
const SG = require('sendgrid')(process.env.SENDGRID_API_KEY);

export class HeroRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
  }

  public hello(req: Request, res: Response, next: NextFunction) {
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
      res.status(status).send(response)
    });
  }

  init() {
    this.router.post('/hello/', this.hello);    
  }

}

// Create the HeroRouter, and export its configured Express.Router
const heroRoutes = new HeroRouter();
heroRoutes.init();

export default heroRoutes.router;
