import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const usersRouter = Router();

// All user management routes require SUPER_ADMIN role as per PRD RBAC
usersRouter.use(authenticateToken, requireRole(['SUPER_ADMIN']));

// GET /api/users (List all admin users)
usersRouter.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ users });
  } catch (error: any) {
    console.error('Fetch users error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user accounts.' });
  }
});

// POST /api/users (Invite/Create new admin)
usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password, role, avatarUrl } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRoles = ['SUPER_ADMIN', 'EDITOR', 'VIEWER'];
    const userRole = validRoles.includes(role) ? role : 'EDITOR';

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: userRole,
        avatarUrl: avatarUrl || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true
      }
    });

    return res.status(201).json({ message: 'User created successfully.', user });
  } catch (error: any) {
    console.error('Create user error:', error);
    return res.status(500).json({ error: 'Failed to create user account.' });
  }
});

// PUT /api/users/:id (Update role or details)
usersRouter.put('/:id', async (req, res) => {
  try {
    const { name, role, password, avatarUrl } = req.body;

    const data: any = {};
    if (name) data.name = name;
    if (role && ['SUPER_ADMIN', 'EDITOR', 'VIEWER'].includes(role)) data.role = role;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        updatedAt: true
      }
    });

    return res.json({ message: 'User updated successfully.', user });
  } catch (error: any) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Failed to update user account.' });
  }
});

// DELETE /api/users/:id (Revoke admin access)
usersRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });

    return res.json({ message: 'User account removed.' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user account.' });
  }
});
