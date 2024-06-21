'use client';
import { Flex, Stack, Heading, useColorModeValue } from '@chakra-ui/react';
import { SignupForm } from './SignupForm';
import { Header } from '@web/app/components/Header';

export default function Signup(): JSX.Element {
  return (
    <>
      <Header />
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
            <Heading fontSize={'4xl'}>Sign up new account</Heading>
          </Stack>
          <SignupForm />
        </Stack>
      </Flex>
    </>
  );
}
