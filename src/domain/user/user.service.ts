import { Injectable } from '@nestjs/common';
import { JoinRequestDTO } from './dtos/JoinRequest.dto';
import { LoginRequestDTO } from './dtos/LoginRequest.dto';
import { MeResponseDTO } from './dtos/MeResponse.dto';
import { UserDTO } from './dtos/User.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async join(joinRequestDTO: JoinRequestDTO) {
    return await this.userRepository.createUser(joinRequestDTO);
  }

  async login(loginRequestDTO: LoginRequestDTO) {
    return await this.userRepository.findUserByIdAndPassword(loginRequestDTO);
  }

  async getUserByIdx(userIdx: number) {
    return await this.userRepository.findUserByIdx(userIdx);
  }

  userToMe(user: UserDTO): MeResponseDTO {
    return {
      id: user.id,
      name: user.name,
    };
  }
}
