### Компонент `<Input>`
Данный компонент добавляет элемент `input` на страницу Вашего приложения.
```jsx
<Input
    onChange={(e) => { console.log(e.target.value) }}
    placeholder={"Ваше ФИО"}
    />
```
Список props, которые может принимать данный компонент.

|Название|Тип|Описание|
| ------------ | ------------ | ------------ |
| defaultValue  | string  | Текст по-умолчанию.  |
| type  | string  | Тип поля ввода: text или password.  |
| className  | string  | Имя пользовательского класса, чтобы переписать стандартные less-стили поля ввода.  |
| placeholder  | string  | Текст, когда поле ввода пустое.  |
| onChange |function | Функция, которая вызывается при изменении содержания поля ввода. Принимает один аргумент: **event** (событие изменения) |
| maxLength | number | Максимальное допустимое количество символов для ввода. |
