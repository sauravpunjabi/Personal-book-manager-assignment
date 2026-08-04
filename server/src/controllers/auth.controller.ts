import type { NextFunction, Request, Response } from 'express';
import { clearAuthCookie, setAuthCookie } from '../lib/authCookie';
import { signToken } from '../lib/jwt';
import { readString } from '../lib/parseBody';
import { IUser, User } from '../models/User';

const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Record<string, string>;

function publicUser(user: IUser) {
  return { _id: user._id.toString(), name: user.name, email: user.email };
}

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body: Record<string, unknown> = req.body ?? {};
    const name = readString(body, 'name');
    const email = readString(body, 'email').toLowerCase();
    const password = readString(body, 'password');

    const errors: FieldErrors = {};
    if (name.length < MIN_NAME_LENGTH) {
      errors.name = `Name must be at least ${MIN_NAME_LENGTH} characters`;
    }
    if (!EMAIL_PATTERN.test(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ message: 'Please check the highlighted fields', errors });
      return;
    }

    if (await User.exists({ email })) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const user = await User.create({ name, email, password });

    setAuthCookie(res, signToken(user._id.toString()));
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body: Record<string, unknown> = req.body ?? {};
    const email = readString(body, 'email').toLowerCase();
    const password = readString(body, 'password');

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Same response whether the email is unknown or the password is wrong —
    // telling them apart would let anyone probe for registered addresses.
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    setAuthCookie(res, signToken(user._id.toString()));
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export function logout(_req: Request, res: Response): void {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}
