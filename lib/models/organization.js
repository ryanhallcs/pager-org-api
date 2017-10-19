const Joi = require('joi');
const Sequelize = require('sequelize');

export class Organization {
    static get EMPLOYER_TYPE() { return 'employer'; }
    static get INSURANCE_TYPE() { return 'insurance'; }
    static get HEALTHSYS_TYPE() { return 'health system'; }
    static get ALL_TYPES() { return [this.EMPLOYER_TYPE, this.INSURANCE_TYPE, this.HEALTHSYS_TYPE]; }
    
    static get schema() { 
        return {
            id: Joi.number(),
            code: Joi.string().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            url: Joi.string().uri().required(),
            type: Joi.string().valid(this.ALL_TYPES).required()
        };
    }
        
    static get dbSchema() { 
        return {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            }
        };
    }

    constructor(id, name, description, url, code, type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.code = code;
        this.type = type;
    }
}
