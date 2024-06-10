// app/auth/login/page.tsx

'use client';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Tooltip,
  Text,
  Spinner,
  Checkbox,
} from '@chakra-ui/react';
import { useLogin } from './login.use';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { error, showPassword, setShowPassword, handleSubmit } = useLogin();
  const { loading } = useAuth();

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={8}
        mx={'auto'}
        maxW={'lg'}
        py={12}
        px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Log in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl
                id="username"
                isInvalid={!!error.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                />
                <FormErrorMessage>{error.username}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isInvalid={!!error.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{error.password}</FormErrorMessage>
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Tooltip
                    label="Not available yet"
                    shouldWrapChildren
                    mt="3">
                    <Text
                      as="span"
                      color="gray.500">
                      <Checkbox isDisabled>Remember me</Checkbox>
                    </Text>
                  </Tooltip>
                  <Tooltip
                    label="Not available yet"
                    shouldWrapChildren
                    mt="3">
                    <Text
                      as="span"
                      color="gray.500"
                      cursor="not-allowed">
                      Forgot password?
                    </Text>
                  </Tooltip>
                </Stack>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  isLoading={loading}
                  spinner={<Spinner />}>
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
