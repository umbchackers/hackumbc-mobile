import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID ?? 'USER_POOL_ID_NOT_SET',
            userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID ?? 'USER_POOL_CLIENT_ID_NOT_SET',
            loginWith: {
                email: true
            },
            signUpVerificationMethod: 'code',
            userAttributes: {
                email: {
                    required: true
                }
            },
            passwordFormat: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireNumbers: true,
                requireSpecialCharacters: true
            }
        }
    }
});