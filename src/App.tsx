import { useState, type ChangeEvent, type FormEvent } from 'react'
import { z } from 'zod'

type Errors = Record<string, string>

const getErrors = (error: z.ZodError) => {
  const errors: Errors = {}
  error.issues.forEach(issue => {
    const key = String(issue.path[0])
    if (!errors[key]) errors[key] = issue.message
  })
  return errors
}

const loginSchema = z.object({
  email: z.email('Неправильний формат пошти'),
  password: z.string().min(6, 'Пароль має бути мінімум 6 символів'),
})

const registerSchema = z.object({
  name: z.string().min(2, "Ім'я занадто коротке"),
  email: z.email('Неправильний формат пошти'),
  password: z.string().min(6, 'Пароль має бути мінімум 6 символів'),
})

const languages = ['JavaScript', 'TypeScript', 'Python', 'Java'] as const

const developerSchema = z.object({
  name: z.string().min(2, "Введіть ім'я"),
  age: z.coerce
    .number('Вік має бути числом')
    .min(18, 'Вік від 18 років')
    .max(65, 'Вік до 65 років'),
  language: z.enum(languages, 'Оберіть мову'),
})

const ratingSchema = z.object({
  rating: z.coerce.number().min(1, 'Оберіть оцінку').max(5),
  comment: z.string().min(5, 'Коментар має бути мінімум 5 символів').optional(),
})

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      setErrors(getErrors(result.error))
      return
    }

    alert('Вхід виконано')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Вхід</h3>

      <input
        placeholder="Пошта"
        value={email}
        onChange={e => {
          setEmail(e.target.value)
          setErrors({ ...errors, email: '' })
        }}
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => {
          setPassword(e.target.value)
          setErrors({ ...errors, password: '' })
        }}
      />
      {errors.password && <p className="error">{errors.password}</p>}

      <button>Увійти</button>
    </form>
  )
}

function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse(form)

    if (!result.success) {
      setErrors(getErrors(result.error))
      return
    }

    alert('Реєстрація успішна')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Реєстрація</h3>

      <input name="name" placeholder="Ім'я" value={form.name} onChange={handleChange} />
      {errors.name && <p className="error">{errors.name}</p>}

      <input name="email" placeholder="Пошта" value={form.email} onChange={handleChange} />
      {errors.email && <p className="error">{errors.email}</p>}

      <input
        name="password"
        type="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && <p className="error">{errors.password}</p>}

      <button>Зареєструватися</button>
    </form>
  )
}

function DeveloperForm() {
  const [form, setForm] = useState({ name: '', age: '', language: '' })
  const [errors, setErrors] = useState<Errors>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = developerSchema.safeParse(form)

    if (!result.success) {
      setErrors(getErrors(result.error))
      return
    }

    alert(JSON.stringify(result.data))
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Профіль розробника</h3>

      <input name="name" placeholder="Ім'я" value={form.name} onChange={handleChange} />
      {errors.name && <p className="error">{errors.name}</p>}

      <input name="age" placeholder="Вік" value={form.age} onChange={handleChange} />
      {errors.age && <p className="error">{errors.age}</p>}

      <select name="language" value={form.language} onChange={handleChange}>
        <option value="">Мова програмування</option>
        {languages.map(lang => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      {errors.language && <p className="error">{errors.language}</p>}

      <button>Зберегти</button>
    </form>
  )
}

function RatingForm() {
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = ratingSchema.safeParse({
      rating,
      comment: comment || undefined,
    })

    if (!result.success) {
      setErrors(getErrors(result.error))
      return
    }

    alert('Дякуємо за оцінку!')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Оцінка матеріалу</h3>

      <select
        value={rating}
        onChange={e => {
          setRating(e.target.value)
          setErrors({ ...errors, rating: '' })
        }}
      >
        <option value="">Оцінка</option>
        {[1, 2, 3, 4, 5].map(n => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      {errors.rating && <p className="error">{errors.rating}</p>}

      <textarea
        placeholder="Коментар (необов'язково)"
        value={comment}
        onChange={e => {
          setComment(e.target.value)
          setErrors({ ...errors, comment: '' })
        }}
      />
      {errors.comment && <p className="error">{errors.comment}</p>}

      <button>Надіслати</button>
    </form>
  )
}

export default function App() {
  return (
    <div className="app">
      <LoginForm />
      <RegisterForm />
      <DeveloperForm />
      <RatingForm />
    </div>
  )
}
