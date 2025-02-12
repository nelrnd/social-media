export default function LoginForm() {
  return (
    <form>
      <h1>Log in</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>
      <button>Log in</button>
    </form>
  )
}
