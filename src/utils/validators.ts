export const validateName = (name: string): string | null => {
  if (!name.trim()) return 'Name is mandatory';
  // Letters/numbers plus ' and -
  const regex = /^[\p{L}\p{N}' -]+$/u;
  if (!regex.test(name)) return "Name can only contain letters, numbers, spaces, ' and -";
  return null;
};

export const validateIBAN = (iban: string): string | null => {
  if (!iban.trim()) return 'IBAN is mandatory';
  
  // Strip spaces for length check
  const stripped = iban.replace(/\s/g, '');
  
  // Letters/numbers only, max length 20
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(stripped)) return "IBAN can only contain letters and numbers";
  if (stripped.length > 20) return "IBAN maximum length is 20";
  
  return null;
};
