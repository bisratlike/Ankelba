import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';
import { Role } from '../model/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    roles: Role[] = [Role.User],
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password,
      phoneNumber,
      roles,
    });
    return newUser.save();
  }

  async updateUser(
    userId: string,
    updateData: Partial<UserDocument>,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  async deleteUser(userId: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}
