/* eslint-disable */
export default async () => {
    const t = {
        ["./modules/user/dto/user.dto"]: await import("./modules/user/dto/user.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./modules/user/dto/create-user.dto"), { "CreateUserDto": { username: { required: true, type: () => String, minLength: 6, maxLength: 32 }, password: { required: true, type: () => String }, confirmPassword: { required: true, type: () => String } } }], [import("./modules/user/dto/log-in-user.dto"), { "LoginUserDto": { username: { required: true, type: () => String, minLength: 6, maxLength: 32 }, password: { required: true, type: () => String } } }], [import("./modules/user/dto/full-user.dto"), { "FullUserDto": { id: { required: true, type: () => Number }, username: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./modules/user/dto/user.dto"), { "UserDto": {} }], [import("./modules/user/dto/update-user.dto"), { "UpdateUserDto": {} }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String } } }], [import("./auth/auth.controller"), { "AuthController": { "signup": { type: t["./modules/user/dto/user.dto"].UserDto }, "login": {}, "getProfile": { type: t["./modules/user/dto/user.dto"].UserDto } } }], [import("./modules/user/user.controller"), { "UserController": { "findAll": { type: [t["./modules/user/dto/user.dto"].UserDto] }, "findOne": { type: t["./modules/user/dto/user.dto"].UserDto }, "update": { type: t["./modules/user/dto/user.dto"].UserDto }, "delete": {} } }]] } };
};