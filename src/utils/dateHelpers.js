import { isToday, isPast, parseISO, format } from 'date-fns';

// date-fns kullandım çünkü native Date ile "bugün mü" veya "geçmiş mi" kontrolü
// yazmak (saat dilimi, gün başlangıcı gibi detaylar yüzünden) çok daha hata yapmaya açık

export function isDueToday(dateString) {
  if (!dateString) return false;
  return isToday(parseISO(dateString));
}

export function isOverdue(dateString) {
  if (!dateString) return false;
  const d = parseISO(dateString);
  // isToday'i ayrıca kontrol ediyorum çünkü isPast bugünün tarihini de "geçmiş" sayıyor,
  // ama bugün teslim edilecek bir kartı henüz "gecikmiş" diye işaretlemek istemiyorum
  return isPast(d) && !isToday(d);
}

export function formatDeadline(dateString) {
  if (!dateString) return null;
  // gg/aa/yyyy formatını kullandım çünkü ekip Türkiye'de ve bu format daha tanıdık geliyor
  return format(parseISO(dateString), 'dd/MM/yyyy');
}
