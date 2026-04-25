const bankMap: Record<string, string> = {
  '1234': 'Nairobi Bank',
  '1235': 'Denver Bank',
  '1236': 'Moscow Bank',
  '1237': 'Tokio Bank',
};

export const calculateBankFromIBAN = (iban: string): string => {
  const stripped = iban.replace(/\s/g, '');

  if (stripped.length < 8) {
    throw new Error('IBAN is too short to determine the bank');
  }

  const bankCode = stripped.substring(4, 8);
  const bankName = bankMap[bankCode];

  if (!bankName) {
    throw new Error('Bank does not exist');
  }

  return bankName;
};
