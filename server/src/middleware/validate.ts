import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

export const validateResult = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map((err) => ({
        field: (err as any).path || (err as any).param || 'unknown',
        message: err.msg,
      })),
    });
    return;
  }
  next();
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];
