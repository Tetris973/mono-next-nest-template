'use client';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import ProfileForm from './ProfileForm';
import Header from '@web/app/components/Header';

export default function UserProfileEdit(): JSX.Element {
  return (
    <>
      <Header />
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <ProfileForm />
      </Flex>
    </>
  );
}
