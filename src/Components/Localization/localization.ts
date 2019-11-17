import LocalizedStrings, { LocalizedStringsMethods } from "react-localization";

export interface stringsTypeUnknown extends LocalizedStringsMethods {
  addAverage: string;
  buildCharts: string;
  addingAverage: string;
  buildingCharts: string;
  lot: string;
  browseFiles: string;
  selectFiles: string;
  foundBug: string;
  home: string;
  account: string;
  signOut: string;
  signIn: string;
  signUp: string;
  email: string;
  password: string;
  guestMode: string;
  forgotPassword: string;
  dontHave: string;
  bugs: string;
  newBug: string;
  minAgo: string;
  hoursAgo: string;
  daysAgo: string;
  yearsAgo: string;
  confirmPassword: string;
  passHint: string;
  usernameHint: string;
  confirmPassHint: string;
  changePassword: string;
  username: string;
  repeatPassword: string;
  date: string;
  details: string;
  resetPassword: string;
  toggleStarred: string;
  filesSelected: string;
  toggleEdit: string;
  print: string;
  star: string;
  save: string;
  delete: string;
  title: string;
  submit: string;
  admin: string;
  leaveComment: string;
  passwordForget: string;
  abr13S: string;
  abr22S: string;
  abrR4S: string;
  abr41S: string;
  abr8X: string;
  lastname: string;
  deviceName: string;
  notes: string;
  units: string;
  abbreviations: string;
  update: string;
  madeFor: string;
  wrongFormatError: string;
  wrongExtensionError: string;
}

var strings: LocalizedStringsMethods = new LocalizedStrings({
  en: {
    addAverage: "Add average",
    buildCharts: "Build chart",
    addingAverage: "Adding...",
    buildingCharts: "Building...",
    lot: "Lot",
    browseFiles: "Browse",
    selectFiles: "Select files",
    foundBug: "Found any bug?",
    home: "Home",
    account: "Account",
    signOut: "Sign out",
    signIn: "Sign in",
    signUp: "Sign up",
    email: "Email address",
    password: "Password",
    guestMode: "Guest mode",
    forgotPassword: "Forgot password?",
    dontHave: "Don't have an account?",
    bugs: "Bugs",
    newBug: "New bug",
    minAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    yearsAgo: "years ago",
    confirmPassword: "Confirm password",
    passHint: "New password",
    usernameHint: "Enter full name",
    confirmPassHint: "Confirm new password",
    changePassword: "Change my password",
    username: "Username",
    repeatPassword: "Repeat password",
    date: "Date",
    details: "Details",
    resetPassword: "Reset my password",
    toggleStarred: "Toggle starred charts",
    filesSelected: " files selected",
    toggleEdit: "Toggle edit",
    print: "Print",
    star: "Star",
    save: "Save",
    delete: "Delete",
    title: "Title",
    submit: "Submit",
    admin: "Admin panel",
    leaveComment: "Leave a comment",
    passwordForget: "Password forget",
    abr13S:
      "is shown when a single control measurement " +
      "exceeds the mean plus 3s or the mean minus " +
      "3s control limit.",
    abr22S:
      "is shown when 2 consecutive control " +
      "measurements exceed the same mean plus " +
      "2s or the same mean minus 2s control limit.",
    abrR4S:
      "is shown when 1 control measurement in a " +
      "group exceeds the mean plus 2s and another " +
      "exceeds the mean minus 2s.",
    abr41S:
      "is shown when 4 consecutive control " +
      "measurements exceed the same mean plus 1s or " +
      "the same mean minus 1s control limit.",
    abr8X:
      "is shown when 8 consecutive control " +
      "measurements fall on one side of the mean.",
    lastname: "Operator's lastname",
    deviceName: "Device name",
    notes: "Units",
    units: "Notes",
    abbreviations: "Abbreviations",
    update: "Update",
    madeFor: "Made for",
    wrongFormatError: "Wrong file format!",
    wrongExtensionError: "Wrong file extension! Use only .xls, .xlsx files."
  },
  ru: {
    addAverage: "Добавить среднее",
    buildCharts: "Построить графики",
    addingAverage: "Добавляю...",
    buildingCharts: "Строю...",
    lot: "Лот",
    browseFiles: "Выбор",
    selectFiles: "Выберите файлы",
    foundBug: "Нашли баг?",
    home: "Дом",
    account: "Аккаунт",
    signOut: "Выйти",
    signIn: "Войти",
    admin: "Панель админа",
    signUp: "Зарегестрироваться",
    email: "Почта",
    password: "Пароль",
    guestMode: "Режим гостя",
    resetPassword: "Восстановить пароль",
    forgotPassword: "Забыли пароль?",
    dontHave: "Нет аккаунта?",
    bugs: "Баги",
    usernameHint: "Введите полное имя",
    newBug: "Новый баг",
    filesSelected: " файлов выбрано",
    minAgo: "минут назад",
    hoursAgo: "часов назад",
    daysAgo: "дней назад",
    yearsAgo: "лет назад",
    confirmPassword: "Подтвердите пароль",
    passHint: "Новый пароль",
    confirmPassHint: "Подтвердите новый пароль",
    changePassword: "Сменить пароль",
    username: "Логин",
    repeatPassword: "Повторите пароль",
    date: "Дата",
    details: "Детали",
    title: "Название",
    submit: "Подтвердить",
    leaveComment: "Оставте комментарий",
    toggleStarred: "Переключить показ помеченых графиков",
    toggleEdit: "Переключить показ редактирования",
    print: "Распечатать",
    star: "Пометить",
    save: "Скачать",
    delete: "Удалить",
    passwordForget: "Восстановление пароля",
    abr13S: 'виден когда одно из значений измерения "вылетает" за 3 сигмы.',
    abr22S: "виден когда два последовательных измерения превышают 2 сигмы.",
    abrR4S: "виден когда разница между двумя измерениями превышает 6 сигм.",
    abr41S:
      "виден когда 4 последовательных измерения лежат по один бок от среднего значения +- сигмы.",
    abr8X:
      "виден когда 8 и больше последовательных измерений лежат по один бок от среднего значения.",
    lastname: "Фамилия оператора",
    deviceName: "Название аппарата",
    notes: "Заметки",
    units: "Единицы измерения",
    abbreviations: "Аббревиатуры",
    update: "Обновить",
    madeFor: "Сделано для",
    wrongFormatError: "Неверная структура файла!",
    wrongExtensionError: "Неверное расширение файла(ов)! Используйте только .xls, .xlsx расширения"
  },
  uk: {
    addAverage: "Додати середнє значення",
    buildCharts: "Побудувати графіки",
    addingAverage: "Додаю...",
    buildingCharts: "Будую...",
    lot: "Лот",
    browseFiles: "Вибір",
    selectFiles: "Вибрати файли",
    foundBug: "Знайшли баг?",
    home: "Дім",
    account: "Акаунт",
    signOut: "Вийти",
    admin: "Панель адміна",
    signIn: "Зайти",
    signUp: "Зареєструватися",
    email: "Пошта",
    filesSelected: " файлів вибрано",
    password: "Пароль",
    guestMode: "Режим гостя",
    forgotPassword: "Забули пароль?",
    dontHave: "Немає акаунту?",
    usernameHint: "Введіть повне ім'я",
    bugs: "Баги",
    newBug: "Новий баг",
    minAgo: "хвилин тому",
    hoursAgo: "годин тому",
    daysAgo: "днів тому",
    yearsAgo: "років тому",
    title: "Назва",
    submit: "Підтвердити",
    leaveComment: "Залиште коментарій",
    confirmPassword: "Підтвердіть пароль",
    passHint: "Новий пароль",
    confirmPassHint: "Підтвердіть новий пароль",
    changePassword: "Змінити мій пароль",
    username: "Логін",
    repeatPassword: "Повторіть пароль",
    date: "Дата",
    details: "Деталі",
    passwordForget: "Відновлення пароля",
    resetPassword: "Відновити пароль",
    toggleStarred: "Переключити показ позначених графіків",
    toggleEdit: "Переключити показ редактування",
    print: "Роздрукувати",
    star: "Позначити",
    save: "Завантажити",
    delete: "Видалити",
    abr13S: "видно коли одне з значень перевищує 3 сигми.",
    abr22S: "видно коли два послідовних значення перевищують 2 сигми.",
    abrR4S: "видно коли різниця між двома вимірами перевищує 6 сигм.",
    abr41S:
      "видно коли 4 послідовних виміра лежать по один бік від середнього значення +- сигми.",
    abr8X:
      "видно коли 8 і більше послідовних виміра лежать по один бік від середнього значення.",
    lastname: "Прізвище оператора",
    deviceName: "Назва пристрою",
    notes: "Нотатки",
    units: "Одиниці вимірювання",
    abbreviations: "Абревіатури",
    update: "Оновити",
    madeFor: "Зроблено для",
    wrongFormatError: "Хибна структура файла!",
    wrongExtensionError: "Хибне розширення файла(ів)! Використовуюте тільки .xls та .xlsx розширення"
  }
});

export default strings;
