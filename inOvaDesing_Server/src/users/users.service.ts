import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Ya existe una cuenta con ese correo');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({ ...dto, password: hashedPassword });
    return this.sanitize(user);
  }

  // ── FIND ALL ──────────────────────────────────────────────────────────────
  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  // ── FIND ONE ──────────────────────────────────────────────────────────────
  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  // ── FIND BY EMAIL (uso interno — auth) ───────────────────────────────────
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  // ── ESTUDIANTES DE UN DOCENTE ─────────────────────────────────────────────
  async findStudentsByTeacher(idDocente: string) {
    return this.userModel
      .find({ rol: 'estudiante', idDocente })
      .select('-password')
      .exec();
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password')
      .exec();
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return { message: 'Usuario eliminado correctamente' };
  }

  // ── HELPER: quitar password de la respuesta ───────────────────────────────
  private sanitize(user: UserDocument) {
    const { password, ...rest } = user.toObject();
    return rest;
  }
}
