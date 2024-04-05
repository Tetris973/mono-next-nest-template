import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ResourceType } from './casl-ability.factory/casl-ability.factory';
import { Action } from '@prisma/client';

// action, object
export type RequiredPermission = [Action, ResourceType];
export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';
export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);
