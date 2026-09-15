import { AppDataSource } from "../config/database.js";
import { User } from "../entities/user.js";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async validateUser(userId: number): Promise<User> {
    if (!Number.isInteger(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    return user;
  }

  async createUser(name: string, email: string): Promise<User> {
    if (!name || !name.trim()) {
      throw new Error("Name is required");
    }

    if (!email || !email.trim()) {
      throw new Error("Email is required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      throw new Error(`User with email ${normalizedEmail} already exists`);
    }

    const user = this.userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
    });

    return await this.userRepository.save(user);
  }

  async updateUser(
    userId: number,
    updates: { name?: string; email?: string },
  ): Promise<User> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    let hasChanges = false;

    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        throw new Error("Name is required");
      }

      user.name = updates.name.trim();

      hasChanges = true;
    }

    if (updates.email !== undefined) {
      if (!updates.email.trim()) {
        throw new Error("Email is required");
      }

      const normalizedEmail = updates.email.trim().toLowerCase();

      const existingUser = await this.userRepository.findOne({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error(`User with email ${normalizedEmail} already exists`);
      }

      user.email = normalizedEmail;

      hasChanges = true;
    }

    if (!hasChanges) {
      return user;
    }

    return await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<boolean> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    await this.userRepository.remove(user);

    return true;
  }
}
