import Joi from 'joi';

export const createTaskSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(500),
    status: Joi.string().valid('pending', 'in progress', 'completed').required(),
    priority: Joi.string().valid('low', 'medium', 'high').required(),
    deadline: Joi.date().optional()  
});

export const updateTaskSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    description: Joi.string().max(500),
    status: Joi.string().valid('pending', 'in progress', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    deadline: Joi.date().optional()  
});
