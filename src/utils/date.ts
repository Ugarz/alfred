// src/utils/date.ts

interface ParsedDate {
  day: number;
  month: number;
  year: number | null;
}

interface ValidationResult {
  date: ParsedDate | null;
  error: string | null;
}

export function validateAndParseDate(dateInput: string): ValidationResult {
  const dateRegex = /^(\d{2})\/(\d{2})(\/(\d{4}))?$/;
  const match = dateInput.match(dateRegex);

  if (!match) {
    return { date: null, error: '❌ Format de date invalide ! Utilise DD/MM ou DD/MM/YYYY (ex: 25/12 ou 25/12/1990)' };
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = match[4] ? parseInt(match[4], 10) : null;

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return { date: null, error: '❌ Date invalide ! Vérifie le jour (1-31) et le mois (1-12)' };
  }

  // Validation de la date complète si l'année est fournie
  if (year) {
    const testDate = new Date(year, month - 1, day);
    if (testDate.getDate() !== day || testDate.getMonth() !== month - 1 || testDate.getFullYear() !== year) {
      return { date: null, error: '❌ Cette date n\'existe pas (ex: 31/02 est invalide)' };
    }
  } else {
    // Check for invalid dates like 31/02 without a year by testing against the current year
    const currentYear = new Date().getFullYear();
    const testDate = new Date(currentYear, month - 1, day);
     if (testDate.getDate() !== day || testDate.getMonth() !== month - 1) {
      return { date: null, error: '❌ Cette date n\'existe pas (ex: 31/02 est invalide)' };
    }
  }

  return { date: { day, month, year }, error: null };
}

export function getNextBirthday(day: number, month: number): Date {
  const nextBirthday = new Date();
  nextBirthday.setMonth(month - 1);
  nextBirthday.setDate(day);
  nextBirthday.setHours(9, 0, 0, 0);

  if (nextBirthday < new Date()) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  return nextBirthday;
}