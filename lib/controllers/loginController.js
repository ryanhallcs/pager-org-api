const Joi = require('joi');

export class LoginController {
    constructor(jwt, secret) {
        this.jwt = jwt;
        this.secret = secret;
        console.log('secret:', this.secret);
    }

    get loginRoute() {
        return {
            method: ['POST'],
            path: '/api/v1/login',
            config: {
                validate: {
                    payload: {
                        id: Joi.number().required()
                    }
                },
                handler: (request, reply) => {
                    reply(this.jwt.sign({ id: request.payload.id }, this.secret));
                }
            }
        }
    }

    getAllRoutes() {
        return [this.loginRoute];
    }
}