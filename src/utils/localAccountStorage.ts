import type { RegisterInput } from "@/schemas/registerSchema";
import type { AuthSession, AuthUser } from "@/types/auth";

const LOCAL_ACCOUNTS_STORAGE_KEY = "product-dashboard:local-accounts";

type LocalAccount = Omit<RegisterInput, "confirmPassword"> & {
  id: number;
};

function generateLocalToken() {
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `local-access-${randomId}`;
}

function toAuthUser(account: LocalAccount): AuthUser {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
  };
}

function toSession(account: LocalAccount): AuthSession {
  return {
    accessToken: generateLocalToken(),
    provider: "local",
    user: toAuthUser(account),
  };
}

function getAccounts(): LocalAccount[] {
  const rawAccounts = window.localStorage.getItem(LOCAL_ACCOUNTS_STORAGE_KEY);

  if (!rawAccounts) {
    return [];
  }

  try {
    return JSON.parse(rawAccounts) as LocalAccount[];
  } catch {
    window.localStorage.removeItem(LOCAL_ACCOUNTS_STORAGE_KEY);
    return [];
  }
}

function setAccounts(accounts: LocalAccount[]) {
  window.localStorage.setItem(LOCAL_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export const localAccountStorage = {
  create(input: RegisterInput, id: number) {
    const accounts = getAccounts();
    const account: LocalAccount = {
      id,
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.username,
      email: input.email,
      age: input.age,
      password: input.password,
    };

    const nextAccounts = accounts.filter((item) => item.username !== account.username);
    setAccounts([...nextAccounts, account]);

    return toSession(account);
  },

  login(username: string, password: string) {
    const account = getAccounts().find(
      (item) => item.username === username && item.password === password
    );

    return account ? toSession(account) : null;
  },
};
