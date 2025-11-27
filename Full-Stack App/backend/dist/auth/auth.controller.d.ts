import { PocketBaseService } from '../pocketbase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly pbService;
    constructor(pbService: PocketBaseService);
    signup(signupDto: SignupDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
}
