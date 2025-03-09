import { Injectable } from '@nestjs/common';
import { JoinRequestDTO } from './dtos/JoinRequestDTO';
import { LoginRequestDTO } from './dtos/LoginRequestDTO';
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
}
