import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger('Bootstrap');

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...restCreateUserDto } = createUserDto;
      const user = this.userRepository.create({
        ...restCreateUserDto,
        password: bcrypt.hashSync(password, 10),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user)
      throw new UnauthorizedException('Credenciales inválidas (correo)');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales inválidas (contraseña)');
    return user;
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      this.logger.log(error.detail);
      throw new InternalServerErrorException(
        'Error al crear el usuario, revise la consola por favor',
      );
    }
  }
}
