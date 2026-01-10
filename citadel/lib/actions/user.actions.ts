'use server';
import { AuthenticatorType, AuthenticationFactor } from "node-appwrite";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { toast } from "sonner";

const {
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: DATABASE_ID,
    NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
    try {
        const { database } = await createAdminClient();
        const user = await database.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )
        if(user.documents.length === 0) return null;
        
        return parseStringify(user.documents[0]);
    }
    catch (error) {
        console.log(error)
        return null; 
    }
}

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        const user = await getUserInfo({ userId: session.userId })
        return parseStringify(user);
    }
    catch (error) {
        console.error('Error', error);
    }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email, firstName, lastName } = userData;
    let newUserAccount;
    try {
        const { account, database } = await createAdminClient();
        newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );
        if (!newUserAccount) throw new Error('Error creating user')

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal'
        })
        if (!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }
        )

        const session = await account.createEmailPasswordSession(email, password);
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        }
        );

        return parseStringify(newUser);
    }
    catch (error) {
        console.error('Error', error);
    }
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const result = await account.get();
        const user = await getUserInfo({ userId: result.$id })
        if(!user) return null;
        return parseStringify(user);
    }
    catch (error) {
        console.log(error)
        return null;
    }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();
        (await cookies()).delete('appwrite-session');
        await account.deleteSession('current');
    }
    catch (error) {
        return null;
    }
}

export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US'] as CountryCode[],
        }
        const response = await plaidClient.linkTokenCreate(tokenParams);
        return parseStringify({ linkToken: response.data.link_token })
    }
    catch (error) {
        console.log(error);
    }
}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient();

        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId,
            }
        )

        return parseStringify(bankAccount);
    }
    catch (error) {
        console.log(error);
    }
}

export const exchangePublicToken = async ({
    publicToken,
    user,
}: exchangePublicTokenProps) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        if (!fundingSourceUrl) throw new Error("Error creating funding source");
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id),
        });


        revalidatePath("/");

        return parseStringify({
            publicTokenExchange: "complete",
        });
    } 
    catch (error) {
       console.error("An error occurred while exchanging token:", error);
       throw error;
    }
};

export const getBanks = async ({ userId }: getBanksProps) => {
    try {
        const { database } = await createAdminClient();

        const banks = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )

        return parseStringify(banks.documents);
    }
    catch (error) {
        console.log(error)
    }
}

export const getBank = async ({ documentId }: getBankProps) => {
    try {
        const { database } = await createAdminClient();
        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('$id', [documentId])]
        )
        return parseStringify(bank.documents[0]);
    }
    catch (error) {
        console.log(error)
    }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
    try {
        const { database } = await createAdminClient();
        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('accountId', [accountId])]
        )
        if (bank.total !== 1) return null;
        return parseStringify(bank.documents[0]);
    }
    catch (error) {
        console.log(error)
    }
}

// 1. Initiate 2FA (Get the Secret & QR URI)
export const get2FASecret = async () => {
  try {
    const { account } = await createSessionClient();
    
    // Create a generic TOTP authenticator
    // This returns the secret and a generic URI usually
    const challenge = await account.createMfaAuthenticator(AuthenticatorType.Totp);

    return parseStringify(challenge);
  } catch (error) {
    console.error("Error initiating 2FA:", error);
    return null; // Handle error gracefully in UI
  }
}

// 2. Activate 2FA (Verify the code user typed)
export const activate2FA = async ({ code, secret }: { code: string, secret: string }) => {
  try {
    const { account } = await createSessionClient();

    // Verify the code to finalize setup
    const response = await account.updateMfaAuthenticator(
        AuthenticatorType.Totp, 
        code
    );

    // OPTIONAL: Update user prefs or DB to show "2FA: On" in UI immediately
    // await account.updatePrefs({ mfaEnabled: true });

    return parseStringify(response);
  } catch (error) {
    console.error("Error activating 2FA:", error);
    throw new Error("Invalid Code");
  }
}

// Verify the OTP code for sensitive actions (like transfers)
export const verifyOtpForTransaction = async (code: string) => {
    try {
        const { account } = await createSessionClient();
        
        // 1. Create a "Challenge" to prove identity
        const challenge = await account.createMfaChallenge(AuthenticationFactor.Totp);
        
        // 2. Solve the challenge with the user's code
        const response = await account.updateMfaChallenge(
            challenge.$id, 
            code
        );

        return parseStringify(response);
    } catch (error) {
        console.error("OTP Verification Failed:", error);
        throw new Error("Invalid 2FA Code");
    }
}