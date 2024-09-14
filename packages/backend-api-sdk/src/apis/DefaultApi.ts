/* tslint:disable */
/* eslint-disable */
/**
 * Nest basic API for users
 * The users API description
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  UserDto,
} from '../models/index';
import {
    CreateUserDtoFromJSON,
    CreateUserDtoToJSON,
    LoginUserDtoFromJSON,
    LoginUserDtoToJSON,
    UpdateUserDtoFromJSON,
    UpdateUserDtoToJSON,
    UserDtoFromJSON,
    UserDtoToJSON,
} from '../models/index';

export interface AuthControllerLoginRequest {
    loginUserDto: LoginUserDto;
}

export interface AuthControllerSignupRequest {
    createUserDto: CreateUserDto;
}

export interface UserControllerFindOneRequest {
    id: string;
}

export interface UserControllerRemoveRequest {
    id: string;
}

export interface UserControllerUpdateRequest {
    id: string;
    updateUserDto: UpdateUserDto;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     */
    async appControllerGetHelloRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async appControllerGetHello(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.appControllerGetHelloRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async authControllerGetProfileRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/auth/profile`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserDtoFromJSON(jsonValue));
    }

    /**
     */
    async authControllerGetProfile(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserDto> {
        const response = await this.authControllerGetProfileRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async authControllerLoginRaw(requestParameters: AuthControllerLoginRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['loginUserDto'] == null) {
            throw new runtime.RequiredError(
                'loginUserDto',
                'Required parameter "loginUserDto" was null or undefined when calling authControllerLogin().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/login`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LoginUserDtoToJSON(requestParameters['loginUserDto']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async authControllerLogin(requestParameters: AuthControllerLoginRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.authControllerLoginRaw(requestParameters, initOverrides);
    }

    /**
     */
    async authControllerSignupRaw(requestParameters: AuthControllerSignupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserDto>> {
        if (requestParameters['createUserDto'] == null) {
            throw new runtime.RequiredError(
                'createUserDto',
                'Required parameter "createUserDto" was null or undefined when calling authControllerSignup().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/signup`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateUserDtoToJSON(requestParameters['createUserDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserDtoFromJSON(jsonValue));
    }

    /**
     */
    async authControllerSignup(requestParameters: AuthControllerSignupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserDto> {
        const response = await this.authControllerSignupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerFindAllRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<UserDto>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/users`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(UserDtoFromJSON));
    }

    /**
     */
    async userControllerFindAll(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<UserDto>> {
        const response = await this.userControllerFindAllRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerFindOneRaw(requestParameters: UserControllerFindOneRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling userControllerFindOne().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/users/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserDtoFromJSON(jsonValue));
    }

    /**
     */
    async userControllerFindOne(requestParameters: UserControllerFindOneRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserDto> {
        const response = await this.userControllerFindOneRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerRemoveRaw(requestParameters: UserControllerRemoveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling userControllerRemove().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/users/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async userControllerRemove(requestParameters: UserControllerRemoveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.userControllerRemoveRaw(requestParameters, initOverrides);
    }

    /**
     */
    async userControllerUpdateRaw(requestParameters: UserControllerUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling userControllerUpdate().'
            );
        }

        if (requestParameters['updateUserDto'] == null) {
            throw new runtime.RequiredError(
                'updateUserDto',
                'Required parameter "updateUserDto" was null or undefined when calling userControllerUpdate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/users/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateUserDtoToJSON(requestParameters['updateUserDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserDtoFromJSON(jsonValue));
    }

    /**
     */
    async userControllerUpdate(requestParameters: UserControllerUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserDto> {
        const response = await this.userControllerUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
