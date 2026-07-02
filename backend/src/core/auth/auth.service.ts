import { Injectable } from '@nestjs/common';
import { AuthLoginRequest } from './dto/request/auth-login-request.dto';
import { AuthLoginResponse } from './dto/response/auth-login-response.dto';

@Injectable()
export class AuthService {
  login(loginDto: AuthLoginRequest): AuthLoginResponse {
    return new AuthLoginResponse;
  }
}
