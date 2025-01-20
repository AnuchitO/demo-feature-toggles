import dayjs from 'dayjs'

export const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const commaSeparated = (value: number) => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const formatDate = (date: string = 'YYYY-MM-DDTHH:mm:ssZ') => {
  return dayjs(date).format('DD MMM YYYY');
}

export const satangToBaht = (satang: number) => {
  return satang / 100;
}

