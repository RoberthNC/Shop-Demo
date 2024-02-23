import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CommonService } from '../common/common.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password: passwordRegister, ...restCreateUserDto } =
        createUserDto;
      const user = this.userRepository.create({
        ...restCreateUserDto,
        password: bcrypt.hashSync(passwordRegister, 10),
      });
      const { password, ...rest } = await this.userRepository.save(user);
      return {
        ...rest,
        token: this.generateJwt({ id: user.id, name: user.name }),
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password: passwordLogin } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user)
      throw new UnauthorizedException('Credenciales inválidas (correo)');
    if (!bcrypt.compareSync(passwordLogin, user.password))
      throw new UnauthorizedException('Credenciales inválidas (contraseña)');
    const { password, ...rest } = user;
    return {
      ...rest,
      token: await this.generateJwt({ id: user.id, name: user.name }),
    };
  }

  private async generateJwt(payload: JwtPayload): Promise<String> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      this.logger.error(error.detail);
      throw new InternalServerErrorException(
        'Error al crear el usuario, revise la consola por favor.',
      );
    }
  }
}
