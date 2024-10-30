// @Injectable()
// export class AuthService {
//   constructor(
//     private userRepository: UserRepository,
//     private jwtService: JwtService,
//     private passwordHasher: PasswordHasher,
//   ) {}
//
//   async validateUser(email: string, password: string): Promise<User | null> {
//     const user = await this.userRepository.findByEmail(new Email(email));
//     if (!user || !(await this.passwordHasher.compare(password, user.getPasswordHash()))) {
//       return null;
//     }
//     return user;
//   }
//
//   async login(user: User) {
//     const payload = {
//       sub: user.getId(),
//       email: user.getEmail(),
//       name: user.getName(),
//     };
//
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.getId(),
//         name: user.getName(),
//         email: user.getEmail(),
//         profilePhotoUrl: user.getProfilePhotoUrl(),
//       },
//     };
//   }
// }
