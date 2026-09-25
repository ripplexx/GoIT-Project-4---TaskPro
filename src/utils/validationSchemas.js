import * as yup from "yup";

// Ortak Yup yardımcıları burada kalıyor; auth şemaları authSchemas.js'te bunları import eder.
export const nameRules = yup
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(32, "Name must be at most 32 characters.")
  .required("Name is required.");

export const emailRules = yup
  .string()
  .trim()
  .email("Enter a valid email address.")
  .required("Email is required.");

// Gereksinim: zorunlu, sadece Latin harfi+rakam+sembol (büyük/küçük harf serbest),
// 8-64 karakter, boşluk yasak. Karakter seti zorlaması içermiyor (örn. büyük harf
// veya rakam şart değil), sadece izin verilen karakterleri kısıtlıyor.
export const passwordRules = yup
  .string()
  .required("Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .max(64, "Password must be at most 64 characters.")
  .matches(/^\S+$/, "Password must not contain spaces.")
  .matches(
    /^[\x21-\x7E]*$/,
    "Password can only contain Latin letters, numbers, and symbols.",
  );

export const editProfileSchema = yup.object({
  name: nameRules,
  email: emailRules,
  // Profil düzenlemede şifre alanını boş bırakmaya izin veriyorum (değiştirmek istemeyebilir),
  // ama bir şey yazdıysa yine de güçlü şifre kuralını uyguluyorum
  password: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .test(
      "optional-strong",
      "8-64 chars, no spaces, Latin letters/numbers/symbols only.",
      (val) => {
        if (!val) return true;
        return (
          val.length >= 8 &&
          val.length <= 64 &&
          /^\S+$/.test(val) &&
          /^[\x21-\x7E]*$/.test(val)
        );
      },
    ),
  // Şifre boş bırakılmışsa onay alanının da boş olmasına izin veriyorum;
  // bir şifre girildiyse onay alanı aynı değeri içermek zorunda
  confirmPassword: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .test("passwords-match", "Passwords must match.", function (value) {
      const { password } = this.parent;
      if (!password) return true;
      return value === password;
    }),
});

export const boardSchema = yup.object({
  title:      yup.string().trim().required('Board name is required.').max(100),
  icon:       yup.string().required('Please select an icon.'),
  // boş string "arka plan yok" seçeneğini temsil ediyor, bu yüzden required() koymadım
  background: yup.string(),
});

export const columnSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(1)
    .max(80)
    .required("Column title is required."),
});

export const cardSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(1)
    .max(200)
    .required("Card title is required."),
  description: yup.string().trim().max(1000).nullable(),
  priority: yup
    .string()
    .oneOf(["without", "low", "medium", "high"])
    .required("Priority is required."),
  deadline: yup.string().nullable(),
});
