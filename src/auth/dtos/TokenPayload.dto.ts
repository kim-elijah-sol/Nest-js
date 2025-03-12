import { UserDTO } from 'src/domain/user/dtos/User.dto';

export type TokenPayloadDTO = Pick<UserDTO, 'id' | 'idx'>;
