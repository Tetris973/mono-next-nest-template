/* eslint-disable */
export default async () => {
  const t = {
    ['./user/dto/user.dto']: await import('./user/dto/user.dto'),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./user/dto/create-user.dto'),
          {
            CreateUserDto: {
              username: { required: true, type: () => String, minLength: 6, maxLength: 32 },
              password: { required: true, type: () => String },
              confirmPassword: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./user/dto/log-in-user.dto'),
          {
            LogInUserDto: {
              username: { required: true, type: () => String, minLength: 6, maxLength: 32 },
              password: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./user/dto/user.dto'),
          {
            UserDto: {
              id: { required: true, type: () => Number },
              username: { required: true, type: () => String },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [import('./user/dto/update-user.dto'), { UpdateUserDto: {} }],
      ],
      controllers: [
        [import('./app.controller'), { AppController: { getHello: { type: String } } }],
        [
          import('./auth/auth.controller'),
          {
            AuthController: {
              signup: { type: t['./user/dto/user.dto'].UserDto },
              login: {},
              getProfile: { type: t['./user/dto/user.dto'].UserDto },
            },
          },
        ],
        [
          import('./user/user.controller'),
          {
            UserController: {
              findAll: { type: [t['./user/dto/user.dto'].UserDto] },
              findOne: { type: t['./user/dto/user.dto'].UserDto },
              update: { type: t['./user/dto/user.dto'].UserDto },
              remove: {},
            },
          },
        ],
      ],
    },
  };
};
