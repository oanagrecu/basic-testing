import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

// --- Test for resolveValue ---
describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 42;
    await expect(resolveValue(value)).resolves.toBe(value);
  });
});

// --- Test for throwError ---
describe('throwError', () => {
  test('should throw error with provided message', () => {
    const message = 'Test error';
    expect(() => throwError(message)).toThrow(message);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

// --- Test for throwCustomError ---
describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });
});

// --- Test for rejectCustomError ---
describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });
});

// --- BankAccount class for testing ---
class BankAccount {
  private balance = 0;

  async deposit(amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than 0');
    }
    this.balance += amount;
  }

  async withdraw(amount: number): Promise<void> {
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }
    this.balance -= amount;
  }

  async getBalance(): Promise<number> {
    return this.balance;
  }

  async transferTo(target: BankAccount, amount: number): Promise<void> {
    await this.withdraw(amount); // throws if not enough funds
    await target.deposit(amount);
  }
}

// --- Tests for BankAccount ---
describe('BankAccount', () => {
  let accountA: BankAccount;
  let accountB: BankAccount;

  beforeEach(() => {
    accountA = new BankAccount();
    accountB = new BankAccount();
  });

  test('should deposit money', async () => {
    await accountA.deposit(100);
    await expect(accountA.getBalance()).resolves.toBe(100);
  });

  test('should not allow negative deposit', async () => {
    await expect(accountA.deposit(-50)).rejects.toThrow(
      'Deposit amount must be greater than 0',
    );
  });

  test('should withdraw money if funds available', async () => {
    await accountA.deposit(200);
    await accountA.withdraw(150);
    await expect(accountA.getBalance()).resolves.toBe(50);
  });

  test('should throw error on overdraft', async () => {
    await accountA.deposit(50);
    await expect(accountA.withdraw(100)).rejects.toThrow('Insufficient funds');
  });

  test('should transfer funds between accounts', async () => {
    await accountA.deposit(300);
    await accountA.transferTo(accountB, 200);
    await expect(accountA.getBalance()).resolves.toBe(100);
    await expect(accountB.getBalance()).resolves.toBe(200);
  });

  test('should fail to transfer if insufficient funds', async () => {
    await accountA.deposit(50);
    await expect(accountA.transferTo(accountB, 100)).rejects.toThrow(
      'Insufficient funds',
    );
  });
});
