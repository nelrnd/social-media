export default function RegisterForm() {
  return (
    <form>
      <h1>Register</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>
      <button>Register</button>
    </form>
  )
}
