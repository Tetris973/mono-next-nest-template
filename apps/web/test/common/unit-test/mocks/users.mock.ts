import { UserDto } from '@web/common/dto/backend-index.dto';

export const mockUsers: UserDto[] = [
  {
    id: 1,
    username: 'johndoe',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-15'),
  },
  {
    id: 2,
    username: 'janedoe',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-06-20'),
  },
  {
    id: 3,
    username: 'bobsmith',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-06-25'),
  },
  {
    id: 4,
    username: 'alicejohnson',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-06-30'),
  },
  {
    id: 5,
    username: 'charliebrownwithaveryverylongusername',
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-07-05'),
  },
];
